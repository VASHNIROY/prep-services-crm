export const createCustomerTable = `
  CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) ,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile_number VARCHAR(20),
    data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(20),
    Address VARCHAR(255),
    status BOOLEAN,
    profile VARCHAR(255),
    otp INT(4),
    otp_verfied BOOLEAN,
    admin BOOLEAN,
    email_hash VARCHAR(200)
  );
`;

const table = `
    CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile_number VARCHAR(15),
        data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip VARCHAR(20),
        status BOOLEAN
      );
`;
