
const crypto = require('crypto');


function decryptData(encryptedData, iv) {
 
    
  const algorithm = 'aes-256-cbc';
  const encryptionKey = '12345678901234567890123456789012'; 
 
  const ivBuffer = Buffer.from(iv, 'hex');

  
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, ivBuffer);

  
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  
  return decryptedData;
}


module.exports = {
  decryptData,
};
