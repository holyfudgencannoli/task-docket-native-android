import { jwtDecode } from "jwt-decode";

type JWTPayload = {
  exp?: number;
  [key: string]: any;
};

export function isJwtExpired(token: string): boolean {
  try {
    const decoded: JWTPayload = jwtDecode(token);
    if (!decoded.exp) return true; // no expiration = treat as expired
    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp < now;
  } catch {
    return true; // invalid token = expired
  }
}
