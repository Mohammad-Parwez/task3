const crypto = require('crypto')



// Define the encryption function
function encryptData(data) {
  
  const algorithm = 'aes-256-cbc';
  const encryptionKey = '12345678901234567890123456789012'; 
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

  // Encrypt the data
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');


  return {
    iv: iv.toString('hex'),
    encryptedData,
  };
}

// Export the encryption function
module.exports = {
  encryptData,
};