package handlers

import (
	"net/http"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
)

type Violation struct {
	ID             int    `json:"id"`
	VesselName     string `json:"vessel_name"`
	FishermanName  string `json:"fisherman_name"`
	ViolationType  string `json:"violation_type"`
	Description    string `json:"description"`
	Severity       string `json:"severity"`
	Status         string `json:"status"`
}

func GetViolations(c *gin.Context) {

	rows, err := config.DB.Query(`
		SELECT
			vl.id,
			v.vessel_name,
			u.name,
			vl.violation_type,
			vl.description,
			vl.severity,
			vl.status
		FROM violations vl
		JOIN vessels v
			ON vl.vessel_id = v.id
		JOIN users u
			ON v.user_id = u.id
		ORDER BY vl.id DESC
	`)

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

	var violations []Violation

	for rows.Next() {

		var violation Violation

		err := rows.Scan(
			&violation.ID,
			&violation.VesselName,
			&violation.FishermanName,
			&violation.ViolationType,
			&violation.Description,
			&violation.Severity,
			&violation.Status,
		)

		if err != nil {
			continue
		}

		violations = append(
			violations,
			violation,
		)
	}

	if violations == nil {
		violations = []Violation{}
	}

	c.JSON(
		http.StatusOK,
		violations,
	)
}

func UpdateViolationStatus(c *gin.Context) {

	id := c.Param("id")

	type Input struct {
		Status string `json:"status"`
	}

	var input Input

	if err := c.ShouldBindJSON(&input); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	validStatuses := map[string]bool{
		"OPEN": true,
		"INVESTIGATING": true,
		"RESOLVED": true,
	}

	if !validStatuses[input.Status] {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid status",
		})

		return
	}

	_, err := config.DB.Exec(`
		UPDATE violations
		SET status=$1
		WHERE id=$2
	`,
		input.Status,
		id,
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

	c.JSON(http.StatusOK, gin.H{
		"message": "Violation status updated",
	})
}

func DeleteViolation(c *gin.Context) {

	id := c.Param("id")

	var status string

	err := config.DB.QueryRow(`
		SELECT status
		FROM violations
		WHERE id=$1
	`, id).Scan(&status)

	if err != nil {

		c.JSON(
			http.StatusNotFound,
			gin.H{
				"error": "Violation not found",
			},
		)

		return
	}

	// =========================
	// ONLY RESOLVED CAN DELETE
	// =========================

	if status != "RESOLVED" {

		c.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "Only RESOLVED violations can be deleted",
			},
		)

		return
	}

	_, err = config.DB.Exec(`
		DELETE FROM violations
		WHERE id=$1
	`, id)

	if err != nil {

		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error": err.Error(),
			},
		)

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Violation deleted successfully",
	})
}
