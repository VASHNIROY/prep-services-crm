export const InvoiceTable = `
    CREATE TABLE IF NOT EXISTS invoiceTable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        orders TEXT,
        discount FLOAT,
        totalamount FLOAT,
        discounted_amount FLOAT,
        data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        invoice_status VARCHAR(2)
    );
`;
