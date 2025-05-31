import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import Navbar from './components/Navbar/Navbar';
import Explore from './pages/Explore/Explore';
import Trips from './pages/Trips/Trips';
import ExploreTo from './pages/Explore/ExploreTo';
import Login from './pages/Login&SignUp/Login';
import SignUp from './pages/Login&SignUp/SignUp';
import './App.css';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <div className="App">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={['places']}
      >
        <UserProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/ExploreTo" element={<ExploreTo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </Router>
        </UserProvider>
      </LoadScript>
    </div>
  );
}

export default App;
