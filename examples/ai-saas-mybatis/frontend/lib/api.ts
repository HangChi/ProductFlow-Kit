const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const TOKEN_STORAGE_KEY = "productflow-auth-token";
const USER_STORAGE_KEY = "productflow-auth-user";

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message: string | null;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  roleKey: string;
  status: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  expiresAt?: string;
};

type ApiRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
  token?: string | null;
  skipAuth?: boolean;
};

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

export async function apiGet<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, { ...options, method: options.method ?? "GET" });
}

export async function apiPost<T>(path: string, body?: unknown, options: ApiRequestOptions = {}): Promise<T> {
  return apiRequest<T>(path, {
    ...options,
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, skipAuth = false, headers, ...init } = options;
  const requestHeaders = new Headers(headers);
  const bearer = token ?? (skipAuth ? null : getAuthToken());

  if (init.body !== undefined && init.body !== null && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (bearer && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${bearer}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const enabledModules = [
  "auth",
  "rbac",
  "ai",
  "audit-log"
] as const;
