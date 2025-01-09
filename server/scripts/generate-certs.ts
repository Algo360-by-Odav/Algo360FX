import { generateDevCerts } from '../config/ssl';

// Generate development certificates
generateDevCerts()
  .then(() => {
    console.log('Certificate generation complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to generate certificates:', error);
    process.exit(1);
  });
