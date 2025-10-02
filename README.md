# Javascript--SMTPMailerConnectionExample

## 🌟 Features

This project serves as a practical example for setting up a **SMTP mailer connection with containerized Node.js web application** using **Express** and **Docker Compose**.

-   The core application is a simple Express server defined in **`server.js`**.
-   **Dependencies** and project metadata are managed in **`package.json`**.
-   **Configuration** (e.g., ports, API keys) is cleanly separated using the **`.env`** file.

### Docker & Containerization

-   The **`Dockerfile`** provides the blueprint to build a lightweight, production-ready container image using the `node:18-alpine` base.
-   **`docker-compose.yml`** orchestrates the entire application, defining the `web` service and enabling:
    -   **Port Mapping** (`3000:3000`) for easy access.
    -   Loading environment variables from **`.env`**.
    -   **Volume Mounting** for hot-reloading code changes during development.

## 🛠️ Technologies Used

-   **HTML - Css**: The contact page construction.
-   **Node.js**: The JavaScript runtime environment.
-   **Express**: Minimalist web application framework for Node.js.
-   **Docker**: Used for building the application image.
-   **Docker Compose**: Used for defining and running the multi-container application.

## 🚀 Getting Started

To run this project locally, you need to have **Docker** and **Docker Compose** installed.

1.  **Clone the Repository:**
    ```bash
    git clone [Your Repository URL]
    cd [Your Project Directory]
    ```

2.  **Create Environment File:**
    Create a copy of a sample environment file (if provided) or create your own **`.env`** file:
    ```
    PORT=3000
    NODE_ENV=development
    # Add any necessary secrets here
    ```

3.  **Run the Application:**
    Start the containerized application using Docker Compose:
    ```bash
    docker-compose up --build
    ```

4.  **Access the Server:**
    The application will be running and accessible at:
    [http://localhost:3000](http://localhost:3000)


## 📝 References

- All the references used in the projecs are given in pdf files under Documentation folders.
  

## 📞 Contact

Serhat Kumas
- Email: serhatkumas@outlook.com
- LinkedIn: [linkedin.com/in/serhatkumas](https://www.linkedin.com/in/serhatkumas/)
- GitHub: [github.com/SerhatKumas](https://github.com/SerhatKumas)