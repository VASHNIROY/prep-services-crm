export const productAndServicetable = `
    CREATE TABLE IF NOT EXISTS productservice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(30),
    price DECIMAL(10,2),
    status BOOLEAN,
    selected BOOLEAN,
    data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
