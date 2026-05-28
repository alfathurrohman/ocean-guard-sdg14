package handlers

import (
	"net/http"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
)

type DashboardStats struct {
	Vessels   int `json:"vessels"`
	Reports   int `json:"reports"`
	Violations int `json:"violations"`
}

func GetDashboardStats(c *gin.Context) {

	userID := c.GetInt("user_id")
	role := c.GetString("role")

	var stats DashboardStats

	// =========================
	// OFFICER DASHBOARD
	// =========================

	if role == "officer" {

		config.DB.QueryRow(`
			SELECT COUNT(*)
			FROM vessels
		`).Scan(&stats.Vessels)

		config.DB.QueryRow(`
			SELECT COUNT(*)
			FROM catch_reports
		`).Scan(&stats.Reports)

		config.DB.QueryRow(`
			SELECT COUNT(*)
			FROM violations
			WHERE status != 'RESOLVED'
		`).Scan(&stats.Violations)

	} else {

		// =========================
		// FISHERMAN DASHBOARD
		// =========================

		config.DB.QueryRow(`
			SELECT COUNT(*)
			FROM vessels
			WHERE user_id=$1
		`, userID).Scan(&stats.Vessels)

		config.DB.QueryRow(`
			SELECT COUNT(*)
			FROM catch_reports
			WHERE user_id=$1
		`, userID).Scan(&stats.Reports)

		config.DB.QueryRow(`
			SELECT COUNT(*)
			FROM violations v
			JOIN vessels ve
				ON v.vessel_id = ve.id
			WHERE ve.user_id=$1
			AND v.status != 'RESOLVED'
		`, userID).Scan(&stats.Violations)
	}

	c.JSON(
		http.StatusOK,
		stats,
	)
}
