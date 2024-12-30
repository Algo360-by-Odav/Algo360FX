export interface CertificateConfig {
  cert: string;
  key: string;
  ca: string;
}

export interface SSLConfig {
  enabled: boolean;
  certificates: CertificateConfig;
  options: {
    minVersion: string;
    ciphers: string;
    honorCipherOrder: boolean;
    preferServerCipherOrder: boolean;
  };
}

export interface ServerConfig {
  port: number;
  host: string;
  ssl: SSLConfig;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimiting: {
    windowMs: number;
    max: number;
  };
}
