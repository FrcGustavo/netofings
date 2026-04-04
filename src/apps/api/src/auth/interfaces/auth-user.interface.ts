export interface AuthUser {
  username?: string;
  admin?: boolean;
  permissions?: string[];
  iat?: number;
  [key: string]: unknown;
}
