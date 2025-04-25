/**
 * End-to-End Encryption Utility
 * 
 * This module provides client-side encryption capabilities using the Web Crypto API
 * for protecting sensitive user data before it's stored in Firebase.
 */

// Key derivation parameters
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12; // Recommended for AES-GCM

/**
 * Derives an encryption key from a user's password or authentication token
 * using PBKDF2 with many iterations for security.
 */
export async function deriveEncryptionKey(password: string, salt?: Uint8Array): Promise<{
  key: CryptoKey;
  salt: Uint8Array;
}> {
  // Generate random salt if not provided
  if (!salt) {
    salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  }
  
  // Import the password as raw key material
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  
  // Derive the actual encryption key using PBKDF2
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"]
  );
  
  return { key, salt };
}

/**
 * Encrypts data using AES-GCM with the provided key.
 */
export async function encryptData(data: string, key: CryptoKey): Promise<{
  encryptedData: string; // Base64 encoded
  iv: string; // Base64 encoded
}> {
  // Generate random initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Encrypt the data
  const encodedData = new TextEncoder().encode(data);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encodedData
  );
  
  // Convert to Base64 strings for storage
  const encryptedData = bufferToBase64(encryptedBuffer);
  const ivBase64 = bufferToBase64(iv);
  
  return {
    encryptedData,
    iv: ivBase64
  };
}

/**
 * Decrypts data that was encrypted with AES-GCM.
 */
export async function decryptData(
  encryptedData: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  // Convert Base64 strings back to ArrayBuffers
  const encryptedBuffer = base64ToBuffer(encryptedData);
  const ivBuffer = base64ToBuffer(iv);
  
  // Decrypt the data
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer
    },
    key,
    encryptedBuffer
  );
  
  // Convert the decrypted data back to a string
  return new TextDecoder().decode(decryptedBuffer);
}

/**
 * Implements envelope encryption by encrypting a data key with a master key.
 * This allows for key rotation without re-encrypting all data.
 */
export async function encryptDataKey(
  dataKey: CryptoKey,
  masterKey: CryptoKey
): Promise<{
  encryptedKey: string; // Base64 encoded
  iv: string; // Base64 encoded
}> {
  // Export the data key to raw bytes first
  const exportedKey = await window.crypto.subtle.exportKey("raw", dataKey);
  
  // Generate random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Encrypt the exported key
  const encryptedKeyBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    masterKey,
    exportedKey
  );
  
  return {
    encryptedKey: bufferToBase64(encryptedKeyBuffer),
    iv: bufferToBase64(iv)
  };
}

/**
 * Decrypts a data key that was encrypted with a master key.
 */
export async function decryptDataKey(
  encryptedKey: string,
  iv: string,
  masterKey: CryptoKey
): Promise<CryptoKey> {
  // Convert Base64 strings back to ArrayBuffers
  const encryptedBuffer = base64ToBuffer(encryptedKey);
  const ivBuffer = base64ToBuffer(iv);
  
  // Decrypt the key
  const keyBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer
    },
    masterKey,
    encryptedBuffer
  );
  
  // Import the decrypted key material back as an AES key
  return window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generates a random data encryption key.
 */
export async function generateDataKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

/**
 * Helper function to convert an ArrayBuffer to a Base64 string.
 */
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Helper function to convert a Base64 string to an ArrayBuffer.
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
