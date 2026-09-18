export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  /** Auth session id (auth_sessions.id); present on access and refresh tokens. */
  sid?: string;
  /** Unique token id; makes every refresh token distinct. */
  jti?: string;
}

export interface AuthTokens {
  accessToken: string;
  /**
   * Omitted when a refresh request lands inside the rotation grace window:
   * only a new access token is issued and the browser keeps the refresh
   * cookie set by the concurrent request that rotated it.
   */
  refreshToken?: string;
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
