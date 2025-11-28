import Cryptr from "cryptr";

/**
 * Encrypts a given string using a secret key.
 * @param text The string to encrypt.
 * @returns The encrypted string.
 */
export function encrypt(text: string): string {
  if (!process.env.ENCRYPTION_SECRET) {
    throw new Error("ENCRYPTION_SECRET is not defined");
  }
  // It's crucial to use a strong, securely stored secret key.
  // For production, this should come from environment variables (e.g., process.env.ENCRYPTION_SECRET).
  const secretKey = process.env.ENCRYPTION_SECRET;
  const cryptr = new Cryptr(secretKey);
  return cryptr.encrypt(text);
}

/**
 * Decrypts a given string using a secret key.
 * @param text The string to decrypt.
 * @returns The decrypted string.
 */
export function decrypt(text: string): string {
  if (!process.env.ENCRYPTION_SECRET) {
    throw new Error("ENCRYPTION_SECRET is not defined");
  }
  const secretKey = process.env.ENCRYPTION_SECRET;
  const cryptr = new Cryptr(secretKey);
  return cryptr.decrypt(text);
}
