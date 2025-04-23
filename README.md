# Navi – Smart Travel Planning Redefined

**Navi** is a collaborative travel planning web app that helps you find exciting stops *along your route*, not just at your destination. It’s like **Pinterest meets Google Docs** for travel—visual, interactive, and socia

## Features

- **Trip Boards** – Plan, edit, and organize trips visually
- **Stop Suggestions** – Smart detours, landmarks, and food recs en route
- **Embedded Travel Info** – Maps, weather, restaurants, stays, and notes
- **Budget Planner & Expense Splitter**
- **Offline Itinerary Access** – View plans even without internet
- **Push Notifications** – Stay in the loop on flights or trip changes

## Tech Stack

### Frontend
- **React.js** – Component-based UI
- **Tailwind CSS** – Utility-first styling
- **React Router** – Page routing
- **Framer Motion** – Animations
- **Axios** – API calls
- **PWA Support** – Offline-first experience

### Backend
- **Node.js + Express.js** – RESTful API server
- **Socket.io** – Real-time chat and board updates
- **JWT / OAuth 2.0** – Authentication

### Database
- **MongoDB** (via Mongoose) or **PostgreSQL** (via Sequelize)

### APIs & Integrations
- **Google Maps API** – Routes and location pins
- **OpenWeatherMap API** – Forecasts per stop
- **Airbnb/Booking API (or mock)** – Accommodation listings
- **Currency Exchange API** – Budget conversion

### Dev Tools
- **Vercel / Netlify** – Frontend deployment
- **Render / Railway / Heroku** – Backend deployment
- **Firebase / OneSignal** – Push notifications & chat (optional)
- **Postman** – API testing
- **Figma** – Design & mockups


## Getting Started

### Clone the repo

git clone https://github.com/ttristann/navi.git
cd navi

### Setup (Frontend & Backend)
- MUST HAVE THE LATEST VERSION OF NODE, and must be on react 18
- install these dependencies: 
 - npm install @mui/material @mui/icons-material @mui/lab axios @react-google-maps/api google-map-react
 - npm install @emotion/react @emotion/styled
 - npm install @mui/styles

 
1. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd ../server
   npm install
   ```

3. **Create `.env` files in both folders:**

- `client/.env`:
  ```
  VITE_MAPS_API_KEY=your_google_maps_key
  ```

- `server/.env`:
  ```
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  ```

4. **Run development servers:**

- Frontend: `npm run dev` in `/client`
- Backend: `npm run dev` in `/server`


## Contributing

Main contributions are made by:

- Tristan Galang
- Julie Huynh
- Christine Duong