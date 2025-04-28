import React, { useState } from 'react';
import { Typography, FormControl, Select, MenuItem } from '@mui/material';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

import useStyles from './styles';

const List = () => {
    const classes = useStyles();
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');

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
            <Typography variant="h4" gutterBottom>
                Cool spots around you
            </Typography>

            {/* Type and Rating side by side */}
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
                        <Select value={rating} onChange={(e) => setRating(e.target.value)} displayEmpty>
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

            {/* Places Scrollable List */}
            <div className={classes.list}>
                {places?.map((place, i) => (
                    <PlaceDetails key={i} place={place} />
                ))}
            </div>
        </div>
    );
};

export default List;
