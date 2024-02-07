export const orderTable = `CREATE TABLE IF NOT EXISTS order_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    byid VARCHAR(15),
    status VARCHAR(1),
    customer_name VARCHAR(40),
    name VARCHAR(30),
    date VARCHAR(15),
    service VARCHAR(15),
    quantity_received INT,
    product VARCHAR(35),
    unit INT,
    tracking_url VARCHAR(70),
    recived BOOLEAN,
    length VARCHAR(10),
    width VARCHAR(10),
    height VARCHAR(10),
    weight VARCHAR(50),
    fnsku VARCHAR(50),
    fnsku_status BOOLEAN,
    label VARCHAR(50),
    label_status BOOLEAN,
    fnsku_label_printed BOOLEAN,
    customer_id INT,
    invoice BOOLEAN,
    amount FLOAT,
    drop_off BOOLEAN,
    payment_status BOOLEAN,
    instructions VARCHAR(100)
  );
`;
export const filesTable = `
CREATE TABLE IF NOT EXISTS filesTable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    type VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
  );
`;
