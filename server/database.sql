CREATE DATABASE navi

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    view_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(510), 
    destination list of destinations(the ones they type)
);


CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    itinerary_id INTEGER NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
    place_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    order_index INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    DATE TIMESTAMP CURRENT_TIMESTAMP,
    cal_time TIMESTAMP

);

CREATE INDEX idx_itinerary_user ON itineraries(user_id);
CREATE INDEX idx_place_itinerary ON places(itinerary_id);
