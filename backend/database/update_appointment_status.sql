-- Modify the appointments table to update the status enum
ALTER TABLE appointments 
MODIFY COLUMN status ENUM('pending', 'scheduled', 'completed', 'cancelled', 'rejected', 'elapsed') NOT NULL DEFAULT 'pending'; 