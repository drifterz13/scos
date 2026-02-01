-- Migration: CreateOrdersTable
-- Created at: 2026-02-01T14:37:21.569Z

-- Write your SQL migration commands below

CREATE TYPE order_status AS ENUM ('PENDING', 'SUBMITTED', 'CANCELLED', 'SHIPPED', 'DELIVERED');

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number SERIAL UNIQUE,
    shipping_latitude DECIMAL(10, 8) NOT NULL,
    shipping_longitude DECIMAL(11, 8) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_at_time DECIMAL(12, 2) NOT NULL DEFAULT 150.00,
    discount_percentage INTEGER NOT NULL DEFAULT 0,
    total_discount_amount DECIMAL(12, 2) NOT NULL,
    total_shipping_cost DECIMAL(12, 2) NOT NULL,
    total_price_final DECIMAL(12, 2) NOT NULL,
    status order_status NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
