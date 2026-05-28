# Ocean Guard SDG 14

Ocean Guard SDG 14 is a cloud-native fisheries monitoring platform designed to support Sustainable Development Goal 14: Life Below Water.

The system helps monitor fishing vessel activities, detect violations, manage catch reports, and provide real-time notifications for marine authorities and fishermen.

---

# Features

## Fisherman Features

* User authentication
* Vessel registration
* Vessel location tracking
* Catch report submission
* Notification system

## Officer Features

* National monitoring dashboard
* Violation management
* Vessel tracking
* Notification management
* Violation status updates

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS

## Backend

* Golang
* Gin Framework
* JWT Authentication

## Database

* PostgreSQL

## DevOps & Cloud

* Docker
* Docker Compose
* Kubernetes (K3s)
* AWS EC2
* NGINX Ingress
* Horizontal Pod Autoscaler (HPA)

---

# System Architecture

User
↓
AWS EC2
↓
K3s Kubernetes Cluster
├── Frontend Pod
├── Backend Pod
└── PostgreSQL Pod

---

# Docker Deployment

## Build and Run

```bash
docker compose up --build
```

## Stop Containers

```bash
docker compose down
```

---

# Kubernetes Deployment

## Apply Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

## Deploy PostgreSQL

```bash
kubectl apply -f k8s/postgres/
```

## Deploy Backend

```bash
kubectl apply -f k8s/backend/
```

## Deploy Frontend

```bash
kubectl apply -f k8s/frontend/
```

## Deploy Ingress

```bash
kubectl apply -f k8s/ingress/
```

## Deploy HPA

```bash
kubectl apply -f k8s/hpa/
```

---

# Kubernetes Verification

## Check Nodes

```bash
kubectl get nodes
```

## Check Pods

```bash
kubectl get pods -n ocean-guard
```

## Check Services

```bash
kubectl get svc -n ocean-guard
```

## Check Ingress

```bash
kubectl get ingress -n ocean-guard
```

## Check HPA

```bash
kubectl get hpa -n ocean-guard
```

---

# Environment Variables

Example configuration:

```env
APP_ENV=development

APP_PORT=8080

DB_HOST=postgres-service
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=CHANGE_ME
DB_NAME=ocean_guard
DB_SSLMODE=disable

JWT_SECRET=CHANGE_THIS_SECRET

NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

# Cloud Deployment

The application is deployed on AWS EC2 using:

* K3s Kubernetes
* Docker containers
* NGINX Ingress Controller
* Kubernetes Services
* Kubernetes Secrets
* Horizontal Pod Autoscaler

---

# SDG 14 Contribution

Ocean Guard supports SDG 14 by:

* Monitoring fishing activities
* Preventing illegal fishing
* Improving marine resource management
* Supporting sustainable fisheries
* Enhancing maritime law enforcement

---

# Project Status

Deployment Status:

* Frontend: Running
* Backend: Running
* PostgreSQL: Running
* Kubernetes: Running
* AWS Deployment: Running
* HPA: Active

---

# Author

Alif Fathurrohman
