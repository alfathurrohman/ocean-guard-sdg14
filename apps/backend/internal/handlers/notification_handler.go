package handlers

import (
	"net/http"
	"time"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
)

type Notification struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	IsRead    bool      `json:"is_read"`
	CreatedAt time.Time `json:"created_at"`
}

func SendNotification(c *gin.Context) {

	type Input struct {
		UserID  int    `json:"user_id"`
		Title   string `json:"title"`
		Message string `json:"message"`
	}

	var input Input

	if err := c.ShouldBindJSON(&input); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	_, err := config.DB.Exec(`
		INSERT INTO notifications (
			user_id,
			title,
			message
		)
		VALUES ($1,$2,$3)
	`,
		input.UserID,
		input.Title,
		input.Message,
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
		"message": "Notification sent",
	})
}

func GetNotifications(c *gin.Context) {

	userID := c.GetInt("user_id")

	rows, err := config.DB.Query(`
		SELECT
			id,
			title,
			message,
			is_read,
			created_at
		FROM notifications
		WHERE user_id=$1
		ORDER BY id DESC
	`, userID)

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

	var notifications []Notification

	for rows.Next() {

		var notification Notification

		err := rows.Scan(
			&notification.ID,
			&notification.Title,
			&notification.Message,
			&notification.IsRead,
			&notification.CreatedAt,
		)

		if err != nil {
			continue
		}

		notifications = append(
			notifications,
			notification,
		)
	}

	if notifications == nil {

		notifications = []Notification{}
	}

	c.JSON(
		http.StatusOK,
		notifications,
	)
}

func DeleteNotification(c *gin.Context) {

	id := c.Param("id")

	_, err := config.DB.Exec(`
		DELETE FROM notifications
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
		"message": "Notification deleted",
	})
}
