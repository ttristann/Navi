import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Navbar.css'; 
import { FaUserCircle } from 'react-icons/fa';

function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const toggleMenu = () => setOpenMenu(!openMenu);
    const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

    return (
        <div className="navbar">
            <div className="leftSide">
                <NavLink to='/' className='logo-link'>Navi</NavLink>
            </div>

            <div className={`rightSide ${openMenu ? 'open' : ''}`}>
                <NavLink 
                    to="/" 
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    onClick={() => setOpenMenu(false)}
                >
                    Explore
                </NavLink>
                <NavLink 
                    to="/trips" 
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    onClick={() => setOpenMenu(false)}
                >
                    Trips
                </NavLink>

                <div className="profile-container">
                    <FaUserCircle className="profile-icon" onClick={toggleProfileMenu} />
                    {showProfileMenu && (
                        <div className="dropdown-menu">
                        <NavLink to="/Login" className="dropdown-item">Login</NavLink>
                        <NavLink to="/SignUp" className="dropdown-item">Sign Up</NavLink>
                        </div>
                    )}
                    </div>
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                <span>&#9776;</span>
            </div>
        </div>
    );
}

export default Navbar;
