-- Migration: init
-- Created at: 2026-02-01T14:03:49.756Z

-- Write your SQL migration commands below

CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
