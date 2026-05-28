package handlers

import (
	"database/sql"
	"net/http"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
)

type CatchReport struct {
	ID             int     `json:"id"`
	VesselName     string  `json:"vessel_name"`
	FishermanName  string  `json:"fisherman_name"`
	FishType       string  `json:"fish_type"`
	CatchWeight    float64 `json:"catch_weight"`
	FishingZone    string  `json:"fishing_zone"`
	ActivityStatus string  `json:"activity_status"`
	Severity       string  `json:"severity"`
}

func CreateCatchReport(c *gin.Context) {

	type Input struct {
		VesselID    int     `json:"vessel_id"`
		FishType    string  `json:"fish_type"`
		CatchWeight float64 `json:"catch_weight"`
		FishingZone string  `json:"fishing_zone"`
	}

	var input Input

	if err := c.ShouldBindJSON(&input); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	// =========================
	// DEFAULT STATUS
	// =========================

	activityStatus := "SAFE"
	severity := "LOW"

	// =========================
	// MARINE ZONES
	// =========================

	restrictedZones := map[string]bool{
		"Coral Conservation Area": true,
		"SDG14 Marine Reserve":    true,
	}

	monitoredZones := map[string]bool{
		"Natuna Sea": true,
	}

	// =========================
	// RESTRICTED ZONES
	// =========================

	if restrictedZones[input.FishingZone] {

		activityStatus = "RESTRICTED ZONE"

		severity = "CRITICAL"
	}

	// =========================
	// MONITORED ZONES
	// =========================

	if monitoredZones[input.FishingZone] {

		activityStatus = "MONITORED"

		severity = "MEDIUM"
	}

	// =========================
	// OVERFISHING
	// =========================

	if input.CatchWeight > 1000 {

		activityStatus = "OVERFISHING"

		severity = "HIGH"
	}

	if input.CatchWeight > 5000 {

		activityStatus =
			"EXTREME OVERFISHING"

		severity = "CRITICAL"
	}

	// =========================
	// PROHIBITED SPECIES
	// =========================

	prohibitedFish := map[string]bool{
		"Shark": true,
		"Whale": true,
	}

	if prohibitedFish[input.FishType] {

		activityStatus =
			"PROHIBITED SPECIES"

		severity = "CRITICAL"
	}

	// =========================
	// INSERT CATCH REPORT
	// =========================

	_, err := config.DB.Exec(`
		INSERT INTO catch_reports (
			vessel_id,
			fish_type,
			catch_weight,
			fishing_zone,
			activity_status,
			severity
		)
		VALUES ($1,$2,$3,$4,$5,$6)
	`,
		input.VesselID,
		input.FishType,
		input.CatchWeight,
		input.FishingZone,
		activityStatus,
		severity,
	)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	// =========================
	// CREATE VIOLATION
	// =========================

	if severity != "LOW" {

		description :=
			activityStatus +
				" detected in " +
				input.FishingZone

		_, err = config.DB.Exec(`
			INSERT INTO violations (
				vessel_id,
				violation_type,
				description,
				severity,
				status
			)
			VALUES ($1,$2,$3,$4,$5)
		`,
			input.VesselID,
			activityStatus,
			description,
			severity,
			"OPEN",
		)

		if err != nil {

			c.JSON(
				http.StatusInternalServerError,
				gin.H{
					"error": err.Error(),
				},
			)

			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Catch report created",
	})
}

func GetCatchReports(c *gin.Context) {

	userID := c.GetInt("user_id")
	role := c.GetString("role")

	var rows *sql.Rows
	var err error

	// =========================
	// OFFICER
	// =========================

	if role == "officer" {

		rows, err = config.DB.Query(`
			SELECT
				cr.id,
				v.vessel_name,
				u.name,
				cr.fish_type,
				cr.catch_weight,
				cr.fishing_zone,
				cr.activity_status,
				cr.severity
			FROM catch_reports cr
			JOIN vessels v
				ON cr.vessel_id = v.id
			JOIN users u
				ON v.user_id = u.id
			ORDER BY cr.id DESC
		`)

	} else {

		// =========================
		// FISHERMAN
		// =========================

		rows, err = config.DB.Query(`
			SELECT
				cr.id,
				v.vessel_name,
				u.name,
				cr.fish_type,
				cr.catch_weight,
				cr.fishing_zone,
				cr.activity_status,
				cr.severity
			FROM catch_reports cr
			JOIN vessels v
				ON cr.vessel_id = v.id
			JOIN users u
				ON v.user_id = u.id
			WHERE v.user_id = $1
			ORDER BY cr.id DESC
		`, userID)
	}

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	defer rows.Close()

	var reports []CatchReport

	for rows.Next() {

		var report CatchReport

		err := rows.Scan(
			&report.ID,
			&report.VesselName,
			&report.FishermanName,
			&report.FishType,
			&report.CatchWeight,
			&report.FishingZone,
			&report.ActivityStatus,
			&report.Severity,
		)

		if err != nil {

			continue
		}

		reports = append(
			reports,
			report,
		)
	}

	if reports == nil {

		reports = []CatchReport{}
	}

	c.JSON(
		http.StatusOK,
		reports,
	)
}
