import React, { useState } from 'react';
import { Typography, FormControl, Select, MenuItem } from '@mui/material'; // MUI components for UI building
import PlaceDetails from '../PlaceDetails/PlaceDetails'; // Custom component to display each place

import useStyles from './styles';

/**
 * List component
 * Displays a searchable/filterable list of places (restaurants, hotels, attractions)
 */
const List = () => {
    const classes = useStyles(); // Access custom styles
    const [type, setType] = useState('restaurants'); // State for selected type filter
    const [rating, setRating] = useState(''); // State for selected rating filter

    // Sample data
    const places = [ 
        { name: "Cool Place" },
        { name: "Best Drinks" },
        { name: "Best Food" },
        { name: "Cool Place" },
        { name: "Best Drinks" },
        { name: "Best Food" },
        { name: "Cool Place" },
        { name: "Best Drinks" },
        { name: "Best Food" },
    ];

    return (
        <div className={classes.container}>
            {/* Title of the list */}
            <Typography variant="h4" gutterBottom>
                Cool spots around you
            </Typography>

            {/* Dropdown menus for filtering by Type and Rating */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                
                {/* Type Dropdown */}
                <div style={{ flex: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Type</Typography>
                    <FormControl fullWidth className={classes.formControl}>
                        <Select value={type} onChange={(e) => setType(e.target.value)}>
                            <MenuItem value="restaurants">Restaurants</MenuItem>
                            <MenuItem value="hotels">Hotels</MenuItem>
                            <MenuItem value="attractions">Attractions</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Rating Dropdown */}
                <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>Rating</Typography>
                    <FormControl fullWidth className={classes.formControl}>
                        <Select 
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)} 
                            displayEmpty // Shows placeholder when no rating is selected
                        >
                            <MenuItem value="">
                                <em>Select Rating</em>
                            </MenuItem>
                            <MenuItem value={0}>All</MenuItem>
                            <MenuItem value={3}>Above 3.0</MenuItem>
                            <MenuItem value={4}>Above 4.0</MenuItem>
                            <MenuItem value={4.5}>Above 4.5</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            {/* Scrollable list of places rendered by mapping over 'places' array */}
            <div className={classes.list}>
                {places?.map((place, i) => (
                    <PlaceDetails key={i} place={place} />
                ))}
            </div>
        </div>
    );
};

export default List;
