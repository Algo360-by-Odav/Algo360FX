import CryptoJS from 'crypto-js';

export function calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
  const message = CryptoJS.enc.Utf8.parse(username + clientId);
  const key = CryptoJS.enc.Utf8.parse(clientSecret);
  const hash = CryptoJS.HmacSHA256(message, key);
  return CryptoJS.enc.Base64.stringify(hash);
}