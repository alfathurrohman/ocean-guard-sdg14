package handlers

import (
	"net/http"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
)

type Fisherman struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func GetFishermen(c *gin.Context) {

	rows, err := config.DB.Query(`
		SELECT
			id,
			name
		FROM users
		WHERE role='fisherman'
		ORDER BY id DESC
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

	var fishermen []Fisherman

	for rows.Next() {

		var fisherman Fisherman

		err := rows.Scan(
			&fisherman.ID,
			&fisherman.Name,
		)

		if err != nil {
			continue
		}

		fishermen = append(
			fishermen,
			fisherman,
		)
	}

	if fishermen == nil {

		fishermen = []Fisherman{}
	}

	c.JSON(
		http.StatusOK,
		fishermen,
	)
}
