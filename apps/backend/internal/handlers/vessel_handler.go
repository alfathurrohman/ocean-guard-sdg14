package handlers

import (
	"net/http"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
)

type Vessel struct {
	ID                 int    `json:"id"`
	VesselName         string `json:"vessel_name"`
	RegistrationNumber string `json:"registration_number"`
}

func CreateVessel(c *gin.Context) {
	type Input struct {
		VesselName         string `json:"vessel_name"`
		RegistrationNumber string `json:"registration_number"`
	}

	var input Input

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	userID := c.GetInt("user_id")

	query := `
		INSERT INTO vessels (
			user_id,
			vessel_name,
			registration_number
		)
		VALUES ($1, $2, $3)
	`

	_, err := config.DB.Exec(
		query,
		userID,
		input.VesselName,
		input.RegistrationNumber,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Vessel created successfully",
	})
}

func GetUserVessels(c *gin.Context) {
	userID := c.GetInt("user_id")

	query := `
		SELECT
			id,
			vessel_name,
			registration_number
		FROM vessels
		WHERE user_id = $1
		ORDER BY id DESC
	`

	rows, err := config.DB.Query(
		query,
		userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	defer rows.Close()

	var vessels []Vessel

	for rows.Next() {
		var vessel Vessel

		err := rows.Scan(
			&vessel.ID,
			&vessel.VesselName,
			&vessel.RegistrationNumber,
		)

		if err != nil {
			continue
		}

		vessels = append(vessels, vessel)
	}

	if vessels == nil {
		vessels = []Vessel{}
	}

	c.JSON(http.StatusOK, vessels)
}
