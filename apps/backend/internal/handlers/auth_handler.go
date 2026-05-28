package handlers

import (
	"net/http"
	"time"

	"ocean-guard/backend/internal/config"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("ocean-guard-secret")

type RegisterInput struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID           int
	Name         string
	Email        string
	PasswordHash string
	Role         string
}

func Register(c *gin.Context) {
	var input RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	// CHECK EMAIL EXISTS
	var existingUser int

	err := config.DB.QueryRow(
		"SELECT id FROM users WHERE email=$1",
		input.Email,
	).Scan(&existingUser)

	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email already registered",
		})

		return
	}

	// HASH PASSWORD
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(input.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})

		return
	}

	// INSERT USER
	query := `
		INSERT INTO users (
			name,
			email,
			password_hash,
			role
		)
		VALUES ($1, $2, $3, $4)
	`

	_, err = config.DB.Exec(
		query,
		input.Name,
		input.Email,
		string(hashedPassword),
		"fisherman",
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration successful",
	})
}

func Login(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})

		return
	}

	var user User

	query := `
		SELECT
			id,
			name,
			email,
			password_hash,
			role
		FROM users
		WHERE email=$1
	`

	err := config.DB.QueryRow(
		query,
		input.Email,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.PasswordHash,
		&user.Role,
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})

		return
	}

	// CHECK PASSWORD
	err = bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(input.Password),
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid email or password",
		})

		return
	}

	// CREATE JWT TOKEN
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"user_id": user.ID,
			"role":    user.Role,
			"exp": time.Now().
				Add(time.Hour * 24).
				Unix(),
		},
	)

	tokenString, err := token.SignedString(jwtSecret)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate token",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"role":  user.Role,
	})
}
