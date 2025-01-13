import { readFileSync } from 'fs';
import { resolve } from 'path';
import { SecureContextOptions } from 'tls';

interface SSLConfig {
  enabled: boolean;
  options: SecureContextOptions;
}

const CERT_DIR = resolve(__dirname, '../certs');

/**
 * SSL Configuration for the server
 * In development: Uses self-signed certificates
 * In production: Uses proper SSL certificates from the environment
 */
const sslConfig: SSLConfig = {
  enabled: process.env.NODE_ENV === 'production' || process.env.SSL_ENABLED === 'true',
  options: {
    // Production: Use environment variables for SSL certificates
    key: process.env.SSL_KEY || readFileSync(resolve(CERT_DIR, 'server.key')),
    cert: process.env.SSL_CERT || readFileSync(resolve(CERT_DIR, 'server.crt')),
    ca: process.env.SSL_CA ? [process.env.SSL_CA] : undefined,

    // Modern SSL configuration
    minVersion: 'TLSv1.2',
    ciphers: [
      'ECDHE-ECDSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-ECDSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-ECDSA-CHACHA20-POLY1305',
      'ECDHE-RSA-CHACHA20-POLY1305',
      'DHE-RSA-AES128-GCM-SHA256',
      'DHE-RSA-AES256-GCM-SHA384'
    ].join(':'),

    // Security options
    honorCipherOrder: true,
    rejectUnauthorized: process.env.NODE_ENV === 'production',
    
    // HSTS options (for production)
    ...(process.env.NODE_ENV === 'production' && {
      maxVersion: 'TLSv1.3',
      sessionTimeout: 3600,
      ticketKeys: process.env.SSL_TICKET_KEY ? Buffer.from(process.env.SSL_TICKET_KEY, 'hex') : undefined,
    })
  }
};

/**
 * Generate self-signed certificates for development
 */
const generateDevCerts = async () => {
  if (process.env.NODE_ENV === 'production') return;

  const { generateKeyPairSync } = await import('crypto');
  const { writeFileSync, mkdirSync, existsSync } = await import('fs');
  const forge = await import('node-forge');

  // Create certs directory if it doesn't exist
  if (!existsSync(CERT_DIR)) {
    mkdirSync(CERT_DIR, { recursive: true });
  }

  // Check if certificates already exist
  const keyPath = resolve(CERT_DIR, 'server.key');
  const certPath = resolve(CERT_DIR, 'server.crt');
  
  if (existsSync(keyPath) && existsSync(certPath)) {
    console.log('Development certificates already exist');
    return;
  }

  console.log('Generating development SSL certificates...');

  // Generate key pair
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  // Create certificate
  const cert = forge.pki.createCertificate();
  const attrs = [{
    name: 'commonName',
    value: 'localhost'
  }, {
    name: 'organizationName',
    value: 'Algo360FX Development'
  }];

  cert.publicKey = forge.pki.publicKeyFromPem(publicKey);
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  
  // Self-sign the certificate
  cert.sign(forge.pki.privateKeyFromPem(privateKey), forge.md.sha256.create());

  // Save the private key and certificate
  writeFileSync(keyPath, privateKey);
  writeFileSync(certPath, forge.pki.certificateToPem(cert));

  console.log('Development SSL certificates generated successfully');
};

export { sslConfig, generateDevCerts };
