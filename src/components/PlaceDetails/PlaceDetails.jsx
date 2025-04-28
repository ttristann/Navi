import React from 'react';

/**
 * PlaceDetails component
 * Displays the details of a single place (currently only the place name)
 * 
 * Props:
 * - place: an object containing information about a place (e.g., { name: "Cool Place" })
 */
const PlaceDetails = ({ place }) => {
    return (
        // Render the place's name inside an <h1> heading
        <h1>
            {place.name}
        </h1>
    );
}

export default PlaceDetails;
