export const DimensionTable = `
    CREATE TABLE IF NOT EXISTS dimension (
        id INT AUTO_INCREMENT PRIMARY KEY,
        orderId INTEGER,
        length VARCHAR(10),
        width VARCHAR(10),
        height VARCHAR(10),
        weight VARCHAR(50),
        itemNo INTEGER,
        boxBy VARCHAR(20),
        status BOOLEAN
      );
`;
