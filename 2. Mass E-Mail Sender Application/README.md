# Mass Mail Sender

A beautiful, sleek, and simple UI for sending mass emails via your SMTP provider, designed to be run locally using Docker.

## Features

- **Premium UI**: Glassmorphism aesthetic with a dark mode base.
- **Multiple Senders**: Easily switch between multiple sender emails.
- **Mass Email Support**: Paste a list of emails (comma or newline separated).
- **Rich Text Support**: Enter HTML or plain text.
- **Dockerized**: Simple deployment using `docker-compose`.

## Prerequisites

- [Docker](https://www.docker.com/) installed on your machine.

## Setup Instructions

1. **Configure Passwords**
   Create a `.env` file in the root of the project with your actual email passwords. You can copy it from `backend/.env.example`:
   ```bash
   cp backend/.env.example .env
   ```
   Then open `.env` and fill in `EMAIL_1_PASS`, `EMAIL_2_PASS`, and `EMAIL_3_PASS`.

2. **Run the Application**
   Run the following command in the terminal to build and start the Docker container:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the Application**
   Open your browser and navigate to:
   [http://localhost:3001](http://localhost:3001)

## Development

If you want to run the app without Docker for development:

1. **Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file locally with the passwords
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Note: Ensure the backend is running so the frontend can communicate with `localhost:3001`.*
