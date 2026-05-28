package main

import (
	"log"
	"os"

	"ocean-guard/backend/internal/config"
	"ocean-guard/backend/internal/handlers"
	"ocean-guard/backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// =========================
	// LOAD ENV
	// =========================

	err := godotenv.Load()

	if err != nil {

		log.Println(
			"No .env file found",
		)
	}

	// =========================
	// DATABASE
	// =========================

	config.ConnectDatabase()

	// =========================
	// GIN
	// =========================

	r := gin.Default()

	// =========================
	// CORS
	// =========================

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
		},

		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"OPTIONS",
		},

		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},

		ExposeHeaders: []string{
			"Content-Length",
		},

		AllowCredentials: true,
	}))

	// =========================
	// HEALTH
	// =========================

	r.GET("/health", func(c *gin.Context) {

		c.JSON(200, gin.H{
			"message": "Ocean Guard API Running",
		})
	})

	// =========================
	// AUTH
	// =========================

	r.POST(
		"/api/auth/register",
		handlers.Register,
	)

	r.POST(
		"/api/auth/login",
		handlers.Login,
	)

	// =========================
	// PROTECTED
	// =========================

	protected := r.Group("/api")

	protected.Use(
		middleware.AuthMiddleware(),
	)

	{
		// =========================
		// DASHBOARD
		// =========================

		protected.GET(
			"/dashboard/stats",
			handlers.GetDashboardStats,
		)

		// =========================
		// VESSELS
		// =========================

		protected.POST(
			"/vessels",
			handlers.CreateVessel,
		)

		protected.GET(
			"/vessels",
			handlers.GetUserVessels,
		)

		// =========================
		// GPS TRACKING
		// =========================

		protected.POST(
			"/vessel-locations",
			handlers.CreateVesselLocation,
		)

		protected.GET(
			"/vessel-locations",
			handlers.GetVesselLocations,
		)

		// =========================
		// CATCH REPORTS
		// =========================

		protected.POST(
			"/catch-reports",
			handlers.CreateCatchReport,
		)

		protected.GET(
			"/catch-reports",
			handlers.GetCatchReports,
		)

		// =========================
		// VIOLATIONS
		// =========================

		protected.GET(
			"/violations",
			handlers.GetViolations,
		)

		protected.PUT(
			"/violations/:id/status",
			handlers.UpdateViolationStatus,
		)

		protected.DELETE(
	"/violations/:id",
	handlers.DeleteViolation,
)

// =========================
// NOTIFICATIONS
// =========================

protected.POST(
	"/notifications",
	handlers.SendNotification,
)

protected.GET(
	"/notifications",
	handlers.GetNotifications,
)

protected.GET(
	"/fishermen",
	handlers.GetFishermen,
)

protected.DELETE(
	"/notifications/:id",
	handlers.DeleteNotification,
)

	}

	// =========================
	// SERVER
	// =========================

	port := os.Getenv("PORT")

	if port == "" {

		port = "8080"
	}

	log.Println(
		"Server running on port:",
		port,
	)

	err = r.Run(":" + port)

	if err != nil {

		log.Fatal(err)
	}
}
