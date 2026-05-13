# Chessalx Client

**Play. Learn. Compete.**

Chessalx is a full-featured online chess platform built with React, TypeScript, and Vite. Whether you're a beginner learning the rules or a seasoned player looking to sharpen your skills, Chessalx provides multiple ways to enjoy the game.

## Features

- **Pass & Play** – Two players share the same device and take turns making moves on a single board.
- **Online Play** – Challenge other registered users in real-time via WebSocket-powered matchmaking (Pusher).
- **Play vs Computer** – Test your skills against an AI opponent.
- **User Accounts** – Register and log in to save your profile and access online play.
- **Live Demo Board** – The home page shows a random-vs-random game to give visitors an immediate feel for the app.

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS + Material UI (MUI) |
| Chess logic | chess.js |
| Chess board | chessboardjsx |
| Real-time comms | Pusher.js |
| State management | Recoil |
| Routing | React Router v6 |
| Forms & validation | Formik + Yup |
| HTTP client | Axios |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Yarn (recommended) or npm

### Install dependencies

```bash
yarn install
```

### Run in development mode

```bash
yarn dev
```

The app will be available at `http://localhost:5173` by default.

### Build for production

```bash
yarn build
```

### Preview the production build

```bash
yarn preview
```

### Lint

```bash
yarn lint
```

## Project Structure

```
src/
├── components/
│   ├── board/        # Chess board variants (PassNPlay, Online, Computer, RandomVsRandom)
│   ├── layout/       # App shell / navigation layout
│   ├── modal/        # Game-start and other modals
│   ├── navigation/   # Top navigation bar
│   ├── sidebar/      # Side panel components
│   ├── store/        # Recoil atoms (user, modal state)
│   ├── unit/         # Reusable UI units
│   ├── constants.ts
│   ├── interfaces.ts
│   ├── types.ts
│   └── utils.ts
└── pages/
    ├── Home.tsx
    ├── Login.tsx
    └── Signup.tsx
```
