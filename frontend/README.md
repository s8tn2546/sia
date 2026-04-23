# SIA - Frontend

A modern, Google-style supply chain management dashboard built with React, Vite, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

The app opens at http://localhost:3000

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── Cards.jsx
│   └── Charts.jsx
├── pages/          # Page components
│   ├── Landing.jsx
│   ├── Dashboard.jsx
│   ├── Supply.jsx
│   ├── Inventory.jsx
│   ├── Tracking.jsx
│   └── Profile.jsx
├── data/           # Mock data
│   └── mockData.js
├── styles/         # Global styles
│   └── main.css
├── App.jsx
└── index.jsx
```

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Charts

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Routes

- `/` - Landing page
- `/dashboard` - Main dashboard
- `/supply` - Supply management
- `/inventory` - Inventory tracking
- `/tracking` - Shipment tracking
- `/profile` - User profile
