# Online HealthCare Consultation System

## Project Overview
The HealthCare Consultation System is a full-stack web application that enables patients and doctors to connect digitally for online consultations. It provides modules for appointment booking, real-time chat, prescription management, and secure payments. The system is built with React for the frontend, ASP.NET MVC for the backend, and MSSQL for the database, all deployed on Microsoft Azure.

## Objectives
- To develop a centralized healthcare platform for online consultation.
- To automate appointment booking and doctor–patient communication.
- To enable real-time interaction and prescription management.
- To provide admin functionality for managing users and system data.
- To ensure high availability and scalability using Azure cloud services.

## System Architecture
The system follows a three-tier architecture: frontend (presentation), backend (business logic), and database (data layer).

### Frontend
- **Technology:** React JS (Vite) with Bootstrap 5
- **Description:** Provides responsive and interactive UI for patients, doctors, and admins. Uses Context API for state management and Axios for backend communication.

### Backend
- **Technology:** ASP.NET MVC Core using C#
- **Description:** Implements RESTful APIs for authentication, appointment management, chat, and admin operations. Uses Entity Framework (Code-First) for ORM and data handling.

### Database
- **Technology:** MSSQL
- **Description:** Manages relational data for Doctors, Patients, Appointments, Messages, Prescriptions, and Payments. Hosted on Azure Database for MSSQL.

## Features
- Secure authentication with role-based access (Admin, Doctor, Patient)
- Admin dashboard for doctor approval and system monitoring
- Appointment scheduling and time-slot management
- Real-time chat using Pooling
- Prescription generation and management
- Integrated online payment module(Dummy Mode)
- Profile management for doctors and patients
- Fully responsive UI using Bootstrap

## Tech Stack

| Frontend | React JS, Vite, Bootstrap 5 |
| Backend | ASP.NET MVC Core (C#), Entity Framework |
| Database | MSSQL (Azure Database for MySQL) |
| Cloud Platform | Microsoft Azure |
| Version Control | Git, GitHub |
| Deployment | Azure App Service (Frontend, Backend), Azure Database for MSSQL |

## Installation and Setup

### Prerequisites
- Node.js (v16 or later)
- .NET 8 SDK
- MSSQL Server (for local setup)
- Visual Studio
- VS Code



