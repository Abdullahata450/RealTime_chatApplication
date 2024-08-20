
# Real-Time Chat Application (Frontend)

Welcome to the frontend of our **Real-Time Chat Application** built using the MERN stack (MongoDB, ExpressJS, ReactJS, NodeJS) and Socket.io. This project features real-time messaging, user authentication, and multiple chat rooms.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage](#usage)


## Demo

![App Screenshot](path_to_screenshot.png)

Check out a live demo of the app [here](#).

## Features

- **Real-Time Messaging**: Instant communication between users using Socket.io.
- **User Authentication**: Secure login and signup functionality.
- **Multiple Chat Rooms**: Users can join different chat rooms.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **User Presence**: Real-time updates on user presence and online status.

## Tech Stack

- **Frontend**:
  - **ReactJS**: For building the user interface.
  - **Tailwind CSS**: For styling and responsive design.
  - **Shadcn**: For additional UI components and utilities.
  - **Vite**: For fast and efficient build tool.
- **Backend**: NodeJS, ExpressJS
- **Database**: MongoDB
- **Real-Time Communication**: Socket.io

## Project Structure

```bash
├── public
│   ├── index.html
│   └── ...
├── src
│   ├── assets
│   ├── components
│   │   ├── Chat
│   │   │   └── ...
│   │   ├── Auth
│   │   │   └── ...
│   │   ├── UI
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ...
│   ├── pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── ...
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── .env
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** (v14+)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/mern-chat-frontend.git
    cd mern-chat-frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

### Running the App

1. **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

1. **Register** a new account or **login** with an existing one.
2. **Join** a chat room and start messaging in real-time.
3. **Explore** different features including user presence and chat room management.

