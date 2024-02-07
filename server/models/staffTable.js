export const staffTable = `CREATE TABLE IF NOT EXISTS staff_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(20),
    mobile_number VARCHAR(20),
    profile VARCHAR(255),
    otp INT(4),
    status BOOLEAN,
    Address VARCHAR(255),
    role VARCHAR(20) NOT NULL
  );
`;
