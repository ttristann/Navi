import React, {useState} from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'
import PopularTrips from '../../components/TripCards/PopularTrips';
// import { CssBaseline } from '@mui/material';



function Explore() {
    const [coordinates, setCoordinates] = useState({ lat: 34.0522, lng: -118.2437 });
    
    return (
        <div style={{ display: 'flex', flexDirection: 'row'}}>
            <div style={{ flex: 1 }}>
                <SearchBar onSearch={setCoordinates} />
                <PopularTrips />
            </div>
        </div>
    )
}

export default Explore
