# Navi – Smart Travel Planning, Redefined

**Navi** is your intelligent, collaborative travel planner that goes *beyond the destination*. It helps you discover hidden gems, food spots, and must-see detours **along your route**, not just where you're going.

Think **Pinterest meets Google Docs** for trip planning—visual, social, and interactive.

---

## Features

- **Trip Boards** – Visually organize and plan trips with drag-and-drop ease  
- **Smart Stop Suggestions** – Auto-recommendations for attractions, restaurants, and nature spots en route  
- **Embedded Travel Info** – Built-in weather, maps, lodging, and more—no need to switch tabs  
- **Offline Access** – Full itinerary available, even without Wi-Fi  
- **Real-Time Collaboration** – Edit trips and chat with friends live  

---

## Tech Stack

### Frontend
- **React.js** – UI components  
- **Tailwind CSS** – Utility-first styling  
- **React Router** – Page navigation  
- **Framer Motion** – Smooth animations  
- **Axios** – API requests  
- **PWA Support** – Works offline  

### ⚙️ Backend
- **Node.js + Express.js** – RESTful API  
- **Socket.io** – Live chat and trip updates  
- **JWT / OAuth 2.0** – Secure auth  

### Database
- **MongoDB** (via Mongoose) or **PostgreSQL** (via Sequelize)

### APIs & Integrations
- **Google Maps API** – Route plotting, pins, and geolocation  
- **OpenWeatherMap API** – Forecasts by stop  
- **Airbnb/Booking API** (mock or real) – Lodging listings  
- **Currency Exchange API** – Budget calculations  

### Dev Tools
- **Vercel / Netlify** – Frontend hosting  
- **Render / Railway / Heroku** – Backend hosting  
- **Firebase / OneSignal** – Push alerts & messaging (optional)  
- **Postman** – API testing  
- **Figma** – Design mockups  


## Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/ttristann/navi.git
cd navi

---
### 2. Install Dependencies
```bash
npm install @mui/material @mui/icons-material @mui/lab axios \
@emotion/react @emotion/styled @mui/styles \
@react-google-maps/api google-map-react \
@vis.gl/react-google-maps

---
### 3. Run the App
```bash
npm start

