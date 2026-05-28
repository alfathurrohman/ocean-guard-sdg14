package handlers

import (
	"database/sql"
	"net/http"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
)

type VesselLocation struct {
	ID            int       `json:"id"`
	VesselName    string    `json:"vessel_name"`
	FishermanName string    `json:"fisherman_name"`
	Latitude      float64   `json:"latitude"`
	Longitude     float64   `json:"longitude"`
	RecordedAt    string `json:"recorded_at"`
}

func CreateVesselLocation(c *gin.Context) {

	type Input struct {
		VesselID int     `json:"vessel_id"`
		Latitude float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	}

	var input Input

	if err := c.ShouldBindJSON(&input); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	_, err := config.DB.Exec(`
		INSERT INTO vessel_locations (
			vessel_id,
			latitude,
			longitude
		)
		VALUES ($1, $2, $3)
	`,
		input.VesselID,
		input.Latitude,
		input.Longitude,
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

	c.JSON(http.StatusCreated, gin.H{
		"message": "Location submitted",
	})
}

func GetVesselLocations(c *gin.Context) {

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
				vl.id,
				v.vessel_name,
				u.name,
				vl.latitude,
				vl.longitude,
				vl.recorded_at
			FROM vessel_locations vl
			JOIN vessels v
				ON vl.vessel_id = v.id
			JOIN users u
				ON v.user_id = u.id
			ORDER BY vl.id DESC
		`)

	} else {

		// =========================
		// FISHERMAN
		// =========================

		rows, err = config.DB.Query(`
			SELECT
				vl.id,
				v.vessel_name,
				u.name,
				vl.latitude,
				vl.longitude,
				vl.recorded_at
			FROM vessel_locations vl
			JOIN vessels v
				ON vl.vessel_id = v.id
			JOIN users u
				ON v.user_id = u.id
			WHERE v.user_id=$1
			ORDER BY vl.id DESC
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

	var locations []VesselLocation

	for rows.Next() {

		var location VesselLocation

		err := rows.Scan(
			&location.ID,
			&location.VesselName,
			&location.FishermanName,
			&location.Latitude,
			&location.Longitude,
			&location.RecordedAt,
		)

		if err != nil {
			continue
		}

		locations = append(
			locations,
			location,
		)
	}

	if locations == nil {
		locations = []VesselLocation{}
	}

	c.JSON(
		http.StatusOK,
		locations,
	)
}
