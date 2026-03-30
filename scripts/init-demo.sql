DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  country VARCHAR(50),
  signup_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  sale_date DATE NOT NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL
);


INSERT INTO customers (full_name, email, country, signup_date) VALUES
('Elena Torres', 'elena.torres@fake.com', 'España', '2025-06-10'),
('Liam O''Connor', 'liam.oc@fake.com', 'Irlanda', '2025-07-22'),
('Sophia Chen', 'schen@fake.com', 'Canadá', '2025-08-05'),
('Mateo Rossi', 'mrossi@fake.com', 'Italia', '2025-09-12'),
('Aisha Patel', 'apatel@fake.com', 'Reino Unido', '2025-10-30'),
('Lucas Silva', 'lsilva@fake.com', 'Brasil', '2025-11-05'),
('Emma Mueller', 'emueller@fake.com', 'Alemania', '2025-12-01'),
('Oliver Smith', 'osmith@fake.com', 'Estados Unidos', '2026-01-14'),
('Mia Gonzalez', 'miag@fake.com', 'México', '2026-02-02'),
('Noah Kim', 'nkim@fake.com', 'Corea del Sur', '2026-02-28');

INSERT INTO products (name, category, price) VALUES
('SaaS Starter', 'Software', 19.99),
('SaaS Professional', 'Software', 79.99),
('SaaS Enterprise', 'Software', 249.99),
('Consultoría Técnica (1h)', 'Servicios', 120.00),
('Auditoría de Seguridad', 'Servicios', 500.00),
('Integración API', 'Servicios', 350.00),
('Soporte Premium (Mensual)', 'Soporte', 100.00),
('Migración de Datos', 'Servicios', 800.00);

INSERT INTO sales (customer_id, product_id, sale_date, quantity, total_amount) VALUES
(1, 1, '2025-06-15', 1, 19.99),
(1, 4, '2025-06-20', 2, 240.00),
(2, 2, '2025-07-25', 1, 79.99),
(3, 3, '2025-08-10', 1, 249.99),
(3, 8, '2025-08-15', 1, 800.00),
(4, 1, '2025-09-15', 3, 59.97),
(5, 5, '2025-11-02', 1, 500.00),
(6, 2, '2025-11-10', 1, 79.99),
(6, 6, '2025-11-20', 1, 350.00),
(7, 3, '2025-12-05', 1, 249.99),
(7, 7, '2025-12-05', 1, 100.00),
(1, 7, '2025-12-15', 1, 100.00),
(2, 7, '2025-12-25', 1, 100.00),
(8, 2, '2026-01-15', 1, 79.99),
(8, 4, '2026-01-20', 5, 600.00),
(1, 2, '2026-01-25', 1, 79.99),
(9, 1, '2026-02-05', 1, 19.99),
(9, 7, '2026-02-05', 1, 100.00),
(3, 7, '2026-02-10', 1, 100.00),
(4, 4, '2026-02-14', 1, 120.00),
(10, 3, '2026-03-01', 1, 249.99),
(10, 8, '2026-03-02', 1, 800.00),
(5, 2, '2026-03-05', 1, 79.99),
(6, 7, '2026-03-10', 1, 100.00),
(7, 7, '2026-03-12', 1, 100.00),
(8, 7, '2026-03-15', 1, 100.00),
(2, 4, '2026-03-18', 2, 240.00),
(9, 6, '2026-03-20', 1, 350.00),
(1, 7, '2026-03-25', 1, 100.00),
(10, 7, '2026-03-28', 1, 100.00);