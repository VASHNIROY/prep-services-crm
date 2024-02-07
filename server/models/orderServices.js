export const orderServices = `
CREATE TABLE IF NOT EXISTS orderServices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT,
    services INT,
    quantity INT,
    selected BOOLEAN,
    status BOOLEAN
)
`;
