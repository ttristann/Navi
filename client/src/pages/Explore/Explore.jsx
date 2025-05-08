import React, {useState} from 'react'
import SearchBar from '../../components/SearchBar/SearchBar'
import PopularTrips from '../../components/TripCards/PopularTrips';
// import { CssBaseline } from '@mui/material';



function Explore() {
    const [coordinates, setCoordinates] = useState({ lat: 34.0522, lng: -118.2437 });
    
    return (
        <div style={{ display: 'flex', flexDirection: 'row'}}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <SearchBar onSearch={setCoordinates} />
                <PopularTrips />
            </div>
        </div>

        //     {/* Main content layout */}
        // <div style={{ display: 'flex', flexDirection: 'row', marginTop: '10vh', height: '90vh' }}>
        //     {/* Left side: List Display */}
        //     <div style={{ flex: 1, overflowY: 'auto' }}>
        //         <SearchBar onSearch={setCoordinates}  />
        //         <PopularTrips />
        //     </div>

        //     {/* Right side: Map Display */}
        //     {/* <div style={{ flex: 2 }}>
        //         <MapComponent coordinates={coordinates} />
        //     </div> */}
        //     </div>
        // </div>
        // {/* </div> */}
    )
}

export default Explore
