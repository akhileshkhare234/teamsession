// JwtUtility.ts

import { jwtDecode } from "jwt-decode";
// Function to decode the JWT payload
export const decodeToken = (token: string): any => {
  return jwtDecode(token);
};

// Function to decode the JWT header
export const decodeHeader = (token: string): any => {
  return jwtDecode(token, { header: true });
};
