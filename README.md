# QueenB X AppsFlyer - BeSafe Hackathon 2025

This project was developed during the QueenB X AppsFlyer BeSafe Hackathon 2025 to promote **internet safety for young girls**. Over the course of a month, our team built a comprehensive web application and browser extension to help young girls validate harmful content they encounter online.

The project leverages **React, Node.js, MongoDB (Cloud), LLM (Large Language Models), Gemini**, and **Axios** to deliver a seamless experience for content validation and professional assistance.

---

## Introduction
Our project includes two main components:

1. **Web Application:**
   - Girls can type in potentially harmful content they encounter online to verify its intent.
   - The input is sent to an LLM to analyze the intent.
   - Based on the analysis, relevant professional help (e.g., mental health, cyberbullying support) is retrieved from the database and           displayed to the user.

2. **Browser Extension:**
   - The extension scans the content of any webpage.
   - Filters out irrelevant words (e.g., hashtags, "login," etc.).
   - Identifies the most harmful word or phrase.
   - Sends it to the backend, where it is processed with the same logic as the web application to return relevant professional help.

This solution empowers young girls to assess online content safely and access support when needed.

---

## Features

### Web Application
- User input field for validating harmful content.
- AI-based content analysis via an LLM.
- Professional help suggestions based on content category (e.g., mental health, cyberbullying).

### Browser Extension
- Reads and filters webpage content in real-time.
- Implements a regex filter to exclude irrelevant words (e.g., hashtags, "login," etc.).
- Identifies harmful keywords or phrases.
- Sends harmful content to the server for validation and professional help retrieval.

### Backend
- Endpoint for processing user input through an LLM.
- Database integration (MongoDB) to categorize content and fetch relevant professional help.
- Integration with Gemini for advanced processing.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en) 
  - Version 20.x or higher required (latest LTS recommended).
- `npm` (typically installed automatically with Node.js).
  - Version 10.x or higher required (update with `npm install -g npm@latest --no-optional`).

---

### Clone the Repository
To get started with this project, clone the repository to your local machine:

```bash
git clone https://github.com/danielush/Hackathon.git
```

---

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
   - By default, the server will run on `http://localhost:5012`.

---

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```

---

## Configuration

### Environment Variables
Environment variables are used to configure the application without exposing sensitive information. For this project, you need to set up `.env` files in both the `server` and `client` directories.

#### Backend `.env` Example:
```bash
PORT=5012
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@your-cluster.mongodb.net/DB_NAME?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

#### Frontend `.env` Example:
```bash
VITE_SERVER_API_URL=http://localhost:5012
```

---

## Usage

### Start the Server
1. Open a terminal in the root folder of the cloned repository and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Start the Express server in development mode:
   ```bash
   node server.js
   ```
   - By default, the server will run on `http://localhost:5012`.

### Run the Client
1. Open a **new** terminal in the root folder of the cloned repository and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Start the React client:
   ```bash
   npm run dev
   ```
   - A new browser window with the client application should open. If not, navigate to `http://localhost:3000` manually.

### Test the Application
- **Web Application:**
  - Enter text into the input field to validate harmful content.
  - View the suggested professional help based on the analysis.
- **Browser Extension:**
  - Activate the extension on any webpage.
  - View the identified harmful content and the corresponding help suggestions.

---

## Troubleshooting

### Common Issues

- **Server Not Starting:**
  - Ensure the `.env` file is correctly configured with valid MongoDB and LLM API credentials.
  - Check for conflicting applications using port `5012`.

- **Client Not Loading:**
  - Ensure the server is running and accessible at the correct `VITE_SERVER_API_URL`.
  - Check the browser console for error messages and inspect network requests.

---

## Project Structure

### Client Directory (`client/`)
Contains the React frontend application.
- `package.json`: Lists client-side dependencies.
- `.env`: Stores environment variables for the client.
- `src/`: Source code for the React application.
   - `components/`: Reusable UI components.
   - `pages/`: Page components for routing.
   - `services/`: Contains Axios configurations for API calls.

### Server Directory (`server/`)
Contains the Node.js backend application.
- `package.json`: Lists server-side dependencies.
- `.env`: Stores environment variables for the server.
- `server.js`: Main entry point for the server.
- `controllers/`: Handles business logic for API requests.
- `routes/`: Defines API endpoints.

### Database Directory (`database/`)
Contains all files related to the database setup and configuration.
- `database.js`: Main database connection logic.
- `delete.js`: Handles database deletion operations.
- `insertToDB.js`: Contains logic for inserting data into the database.
- `models/`: Defines database schemas and models.
- `testDatabase.js`: Includes scripts for testing database functionality.

---

**Happy Coding! :)**
