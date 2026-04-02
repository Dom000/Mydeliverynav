import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "./instance";
import { clearAuthTokens, setAuthTokens } from "./token-storage";

const prefix = "/auth";

export type AuthTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  refresh_expires_in: string;
};

export type SendOtpInput = {
  email: string;
};

export type VerifyOtpInput = {
  email: string;
  code: string;
};

export type LoginAdminInput = {
  email: string;
  password: string;
};

export type CreateAdminInput = {
  email: string;
  password: string;
};

export type AuthProfile = {
  id: string;
  sub: string;
  roles?: string[];
  permissions?: string[];
  [key: string]: unknown;
};

function persistTokens(response: AuthTokenResponse) {
  setAuthTokens({
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  });
}

export async function sendOtp(input: SendOtpInput) {
  const { data } = await instance.post(`${prefix}/send-otp`, input);
  return data as { message?: string; ok?: boolean };
}

export async function resendOtp(input: SendOtpInput) {
  const { data } = await instance.post(`${prefix}/resend-otp`, input);
  return data as { message?: string; ok?: boolean };
}

export async function verifyOtp(input: VerifyOtpInput) {
  const { data } = await instance.post<AuthTokenResponse>(
    `${prefix}/verify-otp`,
    input,
  );

  persistTokens(data);
  return data;
}

export async function loginAdmin(input: LoginAdminInput) {
  const { data } = await instance.post<AuthTokenResponse>(
    `${prefix}/login`,
    input,
  );

  persistTokens(data);
  return data;
}

export async function createAdmin(input: CreateAdminInput) {
  const { data } = await instance.post(`${prefix}/create-admin`, input);
  return data as { id: string; email: string; role: string };
}

export async function bootstrapAdmin(input: CreateAdminInput) {
  const { data } = await instance.post(`${prefix}/bootstrap-admin`, input);
  return data as { id: string; email: string; role: string };
}

export async function getProfile() {
  const { data } = await instance.get<AuthProfile>(`${prefix}/profile`);
  return data;
}

export function logoutAuth() {
  clearAuthTokens();
  localStorage.removeItem("adminToken");
  localStorage.removeItem("userToken");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("pendingOtpEmail");
}

export const authQueryKeys = {
  profile: ["auth", "profile"] as const,
};

export function useSendOtpMutation() {
  return useMutation({ mutationFn: sendOtp });
}

export function useResendOtpMutation() {
  return useMutation({ mutationFn: resendOtp });
}

export function useVerifyOtpMutation() {
  return useMutation({ mutationFn: verifyOtp });
}

export function useAdminLoginMutation() {
  return useMutation({ mutationFn: loginAdmin });
}

export function useCreateAdminMutation() {
  return useMutation({ mutationFn: createAdmin });
}

export function useBootstrapAdminMutation() {
  return useMutation({ mutationFn: bootstrapAdmin });
}

export function useAuthProfileQuery(enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.profile,
    queryFn: getProfile,
    enabled,
  });
}
