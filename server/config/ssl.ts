import { readFileSync } from 'fs';
import { resolve } from 'path';
import { CertificateConfig } from '../types/server';

const getCertificates = (): CertificateConfig => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use Let's Encrypt certificates from Render
    return {
      cert: process.env.SSL_CERT || '',
      key: process.env.SSL_KEY || '',
      ca: process.env.SSL_CA || ''
    };
  } else {
    // In development, use self-signed certificates
    try {
      return {
        cert: readFileSync(resolve(__dirname, '../certs/localhost.crt'), 'utf8'),
        key: readFileSync(resolve(__dirname, '../certs/localhost.key'), 'utf8'),
        ca: readFileSync(resolve(__dirname, '../certs/localhost.ca'), 'utf8')
      };
    } catch (_error) {
      console.warn('SSL certificates not found for development. Running without SSL.');
      return {
        cert: '',
        key: '',
        ca: ''
      };
    }
  }
};

export const sslConfig = {
  enabled: process.env.SSL_ENABLED === 'true',
  certificates: getCertificates(),
  options: {
    minVersion: 'TLSv1.2',
    ciphers: [
      'ECDHE-ECDSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-ECDSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES256-GCM-SHA384',
    ].join(':'),
    honorCipherOrder: true,
    preferServerCipherOrder: true
  }
};
