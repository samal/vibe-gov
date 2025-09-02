-- MySQL Sample Data for LineageNexus
-- This file populates the database with realistic e-commerce sample data

USE sales;

-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, postal_code) VALUES
('John', 'Smith', 'john.smith@email.com', '555-0101', '123 Main St', 'New York', 'NY', '10001'),
('Sarah', 'Johnson', 'sarah.johnson@email.com', '555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90210'),
('Michael', 'Brown', 'michael.brown@email.com', '555-0103', '789 Pine Rd', 'Chicago', 'IL', '60601'),
('Emily', 'Davis', 'emily.davis@email.com', '555-0104', '321 Elm St', 'Houston', 'TX', '77001'),
('David', 'Wilson', 'david.wilson@email.com', '555-0105', '654 Maple Dr', 'Phoenix', 'AZ', '85001'),
('Lisa', 'Anderson', 'lisa.anderson@email.com', '555-0106', '987 Cedar Ln', 'Philadelphia', 'PA', '19101'),
('Robert', 'Taylor', 'robert.taylor@email.com', '555-0107', '147 Birch Way', 'San Antonio', 'TX', '78201'),
('Jennifer', 'Martinez', 'jennifer.martinez@email.com', '555-0108', '258 Spruce Ct', 'San Diego', 'CA', '92101'),
('William', 'Garcia', 'william.garcia@email.com', '555-0109', '369 Willow Pl', 'Dallas', 'TX', '75201'),
('Amanda', 'Rodriguez', 'amanda.rodriguez@email.com', '555-0110', '741 Aspen St', 'San Jose', 'CA', '95101');

-- Insert sample orders
INSERT INTO orders (customer_id, order_date, total_amount, status, payment_method) VALUES
(1, '2025-01-15', 299.99, 'delivered', 'credit_card'),
(2, '2025-01-16', 149.50, 'shipped', 'paypal'),
(3, '2025-01-17', 89.99, 'processing', 'credit_card'),
(4, '2025-01-18', 199.99, 'pending', 'credit_card'),
(5, '2025-01-19', 79.99, 'delivered', 'debit_card'),
(1, '2025-01-20', 129.99, 'shipped', 'credit_card'),
(6, '2025-01-21', 259.99, 'processing', 'credit_card'),
(7, '2025-01-22', 99.99, 'pending', 'paypal'),
(8, '2025-01-23', 179.99, 'delivered', 'credit_card'),
(9, '2025-01-24', 159.99, 'shipped', 'debit_card');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
(1, 1, 2, 149.99, 299.98),
(2, 3, 1, 149.50, 149.50),
(3, 5, 1, 89.99, 89.99),
(4, 2, 1, 199.99, 199.99),
(5, 4, 1, 79.99, 79.99),
(6, 6, 1, 129.99, 129.99),
(7, 7, 1, 259.99, 259.99),
(8, 8, 1, 99.99, 99.99),
(9, 9, 1, 179.99, 179.99),
(10, 10, 1, 159.99, 159.99);

USE inventory;

-- Insert sample suppliers
INSERT INTO suppliers (supplier_name, contact_person, email, phone, address, city, state, rating) VALUES
('TechCorp Electronics', 'Mike Johnson', 'mike@techcorp.com', '555-1001', '100 Tech Blvd', 'San Francisco', 'CA', 4.8),
('Global Gadgets Inc', 'Sarah Chen', 'sarah@gadgets.com', '555-1002', '200 Innovation Dr', 'Austin', 'TX', 4.6),
('Smart Solutions Ltd', 'David Kim', 'david@smart.com', '555-1003', '300 Smart Way', 'Seattle', 'WA', 4.7),
('Digital Dynamics', 'Lisa Wang', 'lisa@digital.com', '555-1004', '400 Digital Ave', 'Boston', 'MA', 4.5),
('Innovation Industries', 'Robert Lee', 'robert@innovation.com', '555-1005', '500 Future St', 'Denver', 'CO', 4.9);

-- Insert sample products
INSERT INTO products (product_name, description, category, price, cost, stock_quantity, reorder_level, supplier_id, sku) VALUES
('Laptop Pro X1', 'High-performance laptop with 16GB RAM and 512GB SSD', 'Electronics', 1499.99, 899.99, 25, 10, 1, 'LAP-001'),
('Smartphone Galaxy S25', 'Latest smartphone with 128GB storage and 5G capability', 'Electronics', 199.99, 119.99, 50, 15, 2, 'PHN-001'),
('Wireless Headphones', 'Noise-cancelling wireless headphones with 30-hour battery', 'Audio', 89.99, 49.99, 75, 20, 3, 'AUD-001'),
('Tablet Air 2', '10-inch tablet with 64GB storage and retina display', 'Electronics', 79.99, 39.99, 40, 12, 1, 'TAB-001'),
('Gaming Console Pro', 'Next-gen gaming console with 1TB storage', 'Gaming', 89.99, 59.99, 30, 8, 4, 'GAM-001'),
('Smart Watch Series 5', 'Fitness tracking smartwatch with heart rate monitor', 'Wearables', 129.99, 79.99, 60, 18, 2, 'WAT-001'),
('4K Smart TV', '55-inch 4K Ultra HD Smart TV with HDR', 'Electronics', 259.99, 159.99, 20, 5, 3, 'TV-001'),
('Bluetooth Speaker', 'Portable Bluetooth speaker with 20W output', 'Audio', 99.99, 59.99, 45, 12, 4, 'SPK-001'),
('Gaming Laptop', 'Gaming laptop with RTX graphics and 32GB RAM', 'Gaming', 179.99, 119.99, 15, 5, 5, 'GAM-002'),
('Wireless Earbuds', 'True wireless earbuds with active noise cancellation', 'Audio', 159.99, 89.99, 35, 10, 1, 'EAR-001');

USE finance;

-- Insert sample transactions
INSERT INTO transactions (order_id, customer_id, amount, transaction_type, payment_method, status, reference_number, description) VALUES
(1, 1, 299.99, 'sale', 'credit_card', 'completed', 'TXN-001', 'Payment for Laptop Pro X1'),
(2, 2, 149.50, 'sale', 'paypal', 'completed', 'TXN-002', 'Payment for Smartphone Galaxy S25'),
(3, 3, 89.99, 'sale', 'credit_card', 'pending', 'TXN-003', 'Payment for Wireless Headphones'),
(4, 4, 199.99, 'sale', 'credit_card', 'pending', 'TXN-004', 'Payment for Tablet Air 2'),
(5, 5, 79.99, 'sale', 'debit_card', 'completed', 'TXN-005', 'Payment for Gaming Console Pro'),
(6, 1, 129.99, 'sale', 'credit_card', 'completed', 'TXN-006', 'Payment for Smart Watch Series 5'),
(7, 6, 259.99, 'sale', 'credit_card', 'pending', 'TXN-007', 'Payment for 4K Smart TV'),
(8, 7, 99.99, 'sale', 'paypal', 'pending', 'TXN-008', 'Payment for Bluetooth Speaker'),
(9, 8, 179.99, 'sale', 'credit_card', 'completed', 'TXN-009', 'Payment for Gaming Laptop'),
(10, 9, 159.99, 'sale', 'debit_card', 'completed', 'TXN-010', 'Payment for Wireless Earbuds');

-- Add some refund transactions
INSERT INTO transactions (order_id, customer_id, amount, transaction_type, payment_method, status, reference_number, description) VALUES
(NULL, 2, -25.00, 'refund', 'paypal', 'completed', 'TXN-011', 'Partial refund for damaged packaging'),
(NULL, 5, -79.99, 'refund', 'debit_card', 'completed', 'TXN-012', 'Full refund - product returned');

-- Add some fee transactions
INSERT INTO transactions (order_id, customer_id, amount, transaction_type, payment_method, status, reference_number, description) VALUES
(NULL, 1, 5.99, 'fee', 'credit_card', 'completed', 'TXN-013', 'Shipping fee for express delivery'),
(NULL, 6, 3.99, 'fee', 'credit_card', 'completed', 'TXN-014', 'Processing fee for international order');
