# Navi – Smart Travel Planning Redefined

**Navi** is a collaborative travel planning web app that helps you find exciting stops *along your route*, not just at your destination. It’s like **Pinterest meets Google Docs** for travel—visual, interactive, and socia

## Features

- **Trip Boards** – Plan, edit, and organize trips visually
- **Stop Suggestions** – Smart detours, landmarks, and food recs
- **Embedded Travel Info** – Maps, restaurants, stays, and notes

## Tech Stack

### Frontend
- **React.js** – Component-based UI
- **Tailwind CSS** – Utility-first styling
- **React Router** – Page routing

### Backend
- **Node.js + Express.js** – RESTful API server

### Database
- **MongoDB** (via Mongoose) or **PostgreSQL** (via Sequelize)

### APIs & Integrations
- **Google Maps API** – Routes and location pins
- **Google Places API** - Place and location details

### Dev Tools
- **Supabase** - Database
- **Postman** – API testing
- **Figma** – Design & mockups


## Getting Started

### Clone the repo

git clone https://github.com/ttristann/navi.git
cd navi

### Setup
- Ensure you have the **latest version of Node.js** and are using **React 18**.
- ensure .env is in your client and server directory with proper information

### Run the App
 ## PROJECT IS IN PROGRESS, SECTION BELOW CAN BE IGNORED
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
  REACT_APP_GOOGLE_MAPS_API_KEY=
  REACT_APP_GOOGLE_MAP_ID=
  REACT_APP_SUPABASE_URL=
  REACT_APP_SUPABASE_ANON_KEY=
  REACT_APP_API_BASE_URL=
  ```

- `server/.env`:
  ```
  SUPABASE_URL=
  SUPABASE_KEY=
  PORT=
  ```

4. **Run development servers:**

- Frontend: `npm start` in `/client`
- Backend: `npm run dev` in `/server`


## Contributing

Main contributions are made by:

- Tristan Galang
- Julie Huynh
- Christine L Duong 