# Task Management System

A full-stack application for managing tasks with user authentication and role-based access.

---

## Table of Contents

- [Prerequisites](#prerequisites)   
- [Backend Setup](#backend-setup)  
  - [1. Configure](#1-configure)  
  - [2. Migrations & Database](#2-migrations--database)  
  - [3. Run API](#3-run-api)  
  - [4. Run Unit Tests](#4-run-tests)  
- [Frontend Setup](#frontend-setup)  
- [Tech Stack](#tech-stack)  
- [Seed Data](#seed-data)  
- [SonarQube Code Quality](#sonarqube-code-quality)  
  - [A. Install & Start SonarQube](#a-install--start-sonarqube)  
  - [B. Install Scanner Tools](#b-install-scanner-tools)  
  - [C. Analyze Backend](#c-analyze-backend)  
  - [D. Analyze Frontend](#d-analyze-frontend)  
- [Additional Notes](#additional-notes)  

---

## Prerequisites

- **.NET SDK 8.0** (or later)  
- **Node.js ≥ 14** and **npm**  
- **SQL Server** (or another ADO-NET-compatible database)  
- **dotnet-ef** tool:  
  ```bash
  dotnet tool install --global dotnet-ef
---  

## Backend setup 

### 1. Configure:
- **clone repo**:
  ```bash 
  git clone [repo-url]
  
- **navigate to backend folder**:
  ```bash
  cd backend/TaskManagementSystem_AL_Backend_10Pearls

---


- **Update appsettings file**:
Update the appsettings.json file with your database connection string.


  - **Copy appsettings.example.json → appsettings.Development.json**
    ```bash
    cp appsettings.Template.json appsettings.Development.json
---
- **Edit appsettings.Development.json with your values**:
  ```bash
  {
  "ConnectionStrings": {
    "DefaultConnection": "Server=[Server_Name];Database=[DB_Name];Trusted_Connection=True;Encrypt=False"
  },
  "JwtSettings": {
    "SecretKey": "[YourSuperLongJWTSecretKeyHereAtLeastSixtyFourCharacters!]",
    "Issuer": "TaskMgmtAPI",
    "Audience": "TaskMgmtClient"
  },
  "Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" } },
  "AllowedHosts": "*"
  }


---


## 2. Migrations and Database
    
    dotnet restore
    dotnet ef migrations add seeddata
    dotnet ef database update


## Run Api
    dotnet run


## Run Unit Test
    cd ../tests/TaskManagementSystem.Tests
    dotnet test



---

## Frontend Setup

- **navigate to frontend folder and run**:

      npm install
      npm start

Frontend runs on localhost:3000

---

## 🛠️ Tech Stack
    
- **Frontend**: React + TypeScript
- **Backend**: ASP.NET Core Web API (.NET 8.0)
- **Database**: SQL Server
- **Authentication**: JWT Token-based Authentication
- **Logging**: Serilog (planned)
- **Unit Testing**: xUnit + Moq (some coverage, expanding)
- **Code Quality**: SonarQube (fully integrated)

---

## Seed Data

- **Admin details**: admin@example.com  password = admin



---
## SonarQube Code Quality Analysis

We use SonarQube for static code analysis of both the backend and frontend.

---

### Step 1: Install and start SonarQube manually

1. Download SonarQube from: [https://www.sonarqube.org/downloads/](https://www.sonarqube.org/downloads/)
2. Unzip the folder.
3. Start the server:
   - **Windows**:
     ```powershell
     cd C:\path\to\sonarqube\bin\windows-x86-64
     .\StartSonar.bat
     ```
   - **Linux/macOS**:
     ```bash
     cd /path/to/sonarqube/bin/linux-x86-64
     ./sonar.sh start
     ```
4. Access SonarQube at:  
   `http://localhost:9000`  
   (Default login: `admin` / `admin`, then generate your token from My Account ➔ Security ➔ Generate Token.)

---

### Step 2: Install Sonar Scanner tools

- **Backend (.NET)**:
  ```bash
  dotnet tool install --global dotnet-sonarscanner

### Frontend
    npm install --save-dev sonar-scanner

---

### Step 3: Analyze the Backend : In the backend folder TaskManagementSystem_AL_Backend_10Pearls, run:

    dotnet sonarscanner begin 
    /k:"TaskManagementSystem_Backend" 
    /d:sonar.host.url="http://localhost:9000" 
    /d:sonar.login="YOUR_GENERATED_TOKEN"

    dotnet build

    dotnet sonarscanner end 
    /d:sonar.login="YOUR_GENERATED_TOKEN"


---

### Step 4: Step 4: Analyze the Frontend 
- **Create a file frontend/sonar-project.properties**:

      sonar.projectKey=TaskManagementSystem_Frontend
      sonar.projectName=TaskManagementSystem Frontend
      sonar.projectVersion=1.0
      sonar.sources=src
      sonar.tests=src
      sonar.test.inclusions=**/*.test.ts,**/*.spec.ts,**/*.test.tsx,**/*.spec.tsx
      sonar.language=ts
      sonar.sourceEncoding=UTF-8
      sonar.host.url=http://localhost:9000
      sonar.login=YOUR_GENERATED_TOKEN
      sonar.javascript.lcov.reportPaths=coverage/lcov.info

---
### run 
    cd frontend
    npx sonar-scanner


You can now see detailed code quality results inside your SonarQube dashboard at http://localhost:9000.



