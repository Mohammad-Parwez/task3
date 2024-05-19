const crypto = require('crypto');

function encryptData(data) {
  const algorithm = 'aes-256-cbc';

  // Ensure key is retrieved from environment variable
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('Missing environment variable ENCRYPTION_KEY. Please set the key before using this function.');
  }

  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

  // Validate key length
  if (encryptionKey.length !== 32) {
    throw new Error('Invalid encryption key length. The key should be 32 bytes (or 64 hexadecimal characters) long.');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

  // Encrypt data in one call with final encoding
  const encryptedData = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

  return {
    iv: iv.toString('hex'),
    encryptedData,
  };
}

module.exports = {
  encryptData,
};
