import React, { useState } from 'react';
import {NavLink} from 'react-router-dom';
import '../../styles/Navbar.css';

function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);

    const toggleMenu = () => {
        setOpenMenu(!openMenu);
    }

    return (
        <div className="navbar">
            <div className="leftSide">
               <NavLink to='/' className='logo-link'>Navi</NavLink> 
            </div>
            <div className={`rightSide ${openMenu ? 'open' : ''}`}>
                <NavLink 
                    to="/" 
                    className={ ({ isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                    onClick={() => setOpenMenu(false)}
                >
                    Explore
                </NavLink>
                <NavLink 
                to="/trips" 
                className={ ({ isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                onClick={() => setOpenMenu(false)}
                >
                    Trips
                </NavLink>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span>&#9776;</span> {/* ☰ */}
            </div>
        </div>
    )
}

export default Navbar

