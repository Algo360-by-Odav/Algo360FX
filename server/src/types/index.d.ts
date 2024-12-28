declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PORT: string
    MONGODB_URI: string
    JWT_SECRET: string
    CLIENT_URL: string
    [key: string]: string | undefined
  }
}

declare module 'express' {
  interface Request {
    user?: any
  }
}
