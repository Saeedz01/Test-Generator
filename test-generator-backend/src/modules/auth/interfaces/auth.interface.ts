export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface LoginResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  tokens: AuthTokens;
}

export interface OtpPendingResult {
  requiresOtp: true;
  message: string;
  expiresInMinutes: number;
}

export type LoginResponse = LoginResult | OtpPendingResult;
