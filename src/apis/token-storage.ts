import { BASE_URL } from "./constant";

type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

type TokenPayload = {
  exp?: number;
  roles?: string[];
  [key: string]: unknown;
};

const TOKEN_NAMESPACE = "mydelivery.auth.token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return (
    import.meta.env.VITE_AUTH_STORAGE_SECRET ||
    `${window.location.origin}|${BASE_URL}`
  );
}

function toBase64(value: string) {
  return window.btoa(unescape(encodeURIComponent(value)));
}

function fromBase64(value: string) {
  return decodeURIComponent(escape(window.atob(value)));
}

function xorCipher(value: string, secret: string) {
  if (!secret) return value;

  let result = "";
  for (let index = 0; index < value.length; index += 1) {
    const valueCode = value.charCodeAt(index);
    const secretCode = secret.charCodeAt(index % secret.length);
    result += String.fromCharCode(valueCode ^ secretCode);
  }

  return result;
}

function encrypt(value: string) {
  const secret = getSecret();
  return toBase64(xorCipher(value, secret));
}

function decrypt(value: string) {
  const secret = getSecret();
  return xorCipher(fromBase64(value), secret);
}

function getEncryptedStorageKey() {
  const keySeed = `${TOKEN_NAMESPACE}:${getSecret()}`;
  return `__md_${toBase64(keySeed).replace(/=/g, "")}`;
}

function writeCookie(name: string, value: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function readCookie(name: string) {
  const parts = document.cookie.split(";").map((item) => item.trim());
  const found = parts.find((item) => item.startsWith(`${name}=`));
  if (!found) return null;
  return decodeURIComponent(found.split("=").slice(1).join("="));
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function persistValue(rawValue: string) {
  const key = getEncryptedStorageKey();
  const encrypted = encrypt(rawValue);

  try {
    localStorage.setItem(key, encrypted);
  } catch {
    writeCookie(key, encrypted);
  }
}

function getPersistedValue() {
  const key = getEncryptedStorageKey();

  let encrypted: string | null = null;
  try {
    encrypted = localStorage.getItem(key);
  } catch {
    encrypted = null;
  }

  if (!encrypted) {
    encrypted = readCookie(key);
  }

  if (!encrypted) return null;

  try {
    return decrypt(encrypted);
  } catch {
    return null;
  }
}

export function setAuthTokens(tokens: AuthTokens) {
  persistValue(JSON.stringify(tokens));
}

export function getAuthTokens(): AuthTokens | null {
  const raw = getPersistedValue();
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthTokens>;
    if (!parsed.accessToken) return null;

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    };
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return getAuthTokens()?.accessToken ?? null;
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return decodeURIComponent(escape(window.atob(padded)));
}

export function getAccessTokenPayload(): TokenPayload | null {
  const token = getAccessToken();
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as TokenPayload;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = getAccessToken();
  if (!token) return false;

  const payload = getAccessTokenPayload();
  if (!payload?.exp) return true;

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowSeconds;
}

export function isAdminAuthenticated() {
  if (!isAuthenticated()) return false;
  const roles = getAccessTokenPayload()?.roles ?? [];
  return roles.includes("ADMIN");
}

export function getPostAuthRedirectPath() {
  return isAdminAuthenticated() ? "/admin/dashboard" : "/user/packages";
}

export function clearAuthTokens() {
  const key = getEncryptedStorageKey();

  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }

  clearCookie(key);
}
