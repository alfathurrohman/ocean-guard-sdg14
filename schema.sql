-- =========================
-- USERS
-- =========================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(120) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    role VARCHAR(30) NOT NULL
        DEFAULT 'fisherman',

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- VESSELS
-- =========================

CREATE TABLE vessels (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    vessel_name VARCHAR(120) NOT NULL,

    vessel_type VARCHAR(100),

    registration_number VARCHAR(120),

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- VESSEL LOCATIONS
-- =========================

CREATE TABLE vessel_locations (
    id SERIAL PRIMARY KEY,

    vessel_id INTEGER NOT NULL
        REFERENCES vessels(id)
        ON DELETE CASCADE,

    latitude DOUBLE PRECISION NOT NULL,

    longitude DOUBLE PRECISION NOT NULL,

    recorded_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATCH REPORTS
-- =========================

CREATE TABLE catch_reports (
    id SERIAL PRIMARY KEY,

    vessel_id INTEGER NOT NULL
        REFERENCES vessels(id)
        ON DELETE CASCADE,

    fish_type VARCHAR(120) NOT NULL,

    catch_weight DOUBLE PRECISION NOT NULL,

    fishing_zone VARCHAR(120) NOT NULL,

    activity_status VARCHAR(120)
        DEFAULT 'SAFE',

    severity VARCHAR(50)
        DEFAULT 'LOW',

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- VIOLATIONS
-- =========================

CREATE TABLE violations (
    id SERIAL PRIMARY KEY,

    vessel_id INTEGER NOT NULL
        REFERENCES vessels(id)
        ON DELETE CASCADE,

    violation_type VARCHAR(120) NOT NULL,

    description TEXT,

    severity VARCHAR(50),

    status VARCHAR(50)
        DEFAULT 'OPEN',

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- NOTIFICATIONS
-- =========================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN
        DEFAULT FALSE,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
);
