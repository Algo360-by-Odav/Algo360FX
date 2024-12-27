export interface UserPayload {
  id: string;
  _id?: string; // For MongoDB compatibility
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  iat?: number;
  exp?: number;
}
