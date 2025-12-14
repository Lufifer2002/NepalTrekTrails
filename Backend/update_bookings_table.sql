-- Add payment-related columns to bookings table
ALTER TABLE bookings 
ADD COLUMN transaction_id VARCHAR(255) NULL AFTER status,
ADD COLUMN paid_amount DECIMAL(10, 2) NULL AFTER transaction_id,
ADD COLUMN total_amount DECIMAL(10, 2) NULL AFTER paid_amount;