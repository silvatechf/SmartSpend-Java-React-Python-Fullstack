


````markdown
# SETUP.md: Local Installation Guide for SmartSpend

This guide provides step-by-step instructions for running the SmartSpend full-stack application locally.

## Prerequisites

Ensure you have the following installed on your machine:

* **JDK 21** or newer
* **Maven** (version 3.x)
* **Node.js (LTS)** & **npm**
* **PostgreSQL** (Server running on the standard port 5432)

## 1. Database Setup (PostgreSQL)

You must create a PostgreSQL database instance that matches the credentials specified in the Backend configuration (`backend/src/main/resources/application.yml`).

Create a database with the following details:

* **Database Name:** `smartspend_db`
* **Username:** `postgres`
* **Password:** `mypassword`

## 2. Backend Setup (Java Spring Boot)

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend/
    ```

2.  **Install Dependencies and Compile:**
    This command cleans the project, downloads dependencies, and builds the executable JAR file.
    ```bash
    mvn clean package
    ```

3.  **Configure Hibernate for Initial Run:**
    * To ensure the database tables are created with the correct types (resolving potential conflicts), temporarily verify the database migration property in `backend/src/main/resources/application.yml`:
        ```yaml
        spring:
         
          jpa:
            hibernate:
              ddl-auto: create-drop 
        ```
    * **After the first successful start, it is recommended to change it back to `update` or `validate`.**

4.  **Start the Backend Server:**
    The API server will run on `http://localhost:8080`.
    ```bash
    java -jar target/smartspend-backend-0.0.1-SNAPSHOT.jar
    ```

## 3. Frontend Setup (React & TypeScript)

1.  **Navigate to the Frontend Directory:**
    *(Assuming your frontend code is in a folder named `frontend/`)*
    ```bash
    cd ../frontend/
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Frontend Development Server:**
    The application will be accessible at `http://localhost:5173`.
    ```bash
    npm run dev
    ```

## Testing the Full Stack

1.  With both the Backend (port 8080) and Frontend (port 5173) running, open your browser to `http://localhost:5173`.
2.  Navigate to the **Sign Up** page.
3.  Create a new user. A successful sign-up validates that your **CORS configuration**, **JWT generation**, and **Database persistence** are all correctly configured and functional.
````