import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./instance";

export type ShippingAddress = {
  id: string;
  userId: string;
  label: string;
  address: string;
  default: boolean;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone1: string;
  phone2?: string | null;
};

export type UserProfile = {
  id: string;
  name?: string | null;
  email: string;
  role?: string | null;
  permissions: string[];
  shippingAddresses: ShippingAddress[];
};

export type UpdateUserProfileInput = {
  name?: string;
};

export type SaveShippingAddressInput = {
  id?: string;
  label: string;
  address: string;
  default: boolean;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone1: string;
  phone2?: string | null;
};

export type SaveUserAccountInput = {
  profile: UpdateUserProfileInput;
  shippingAddress: SaveShippingAddressInput;
};

export type UserRoutePoint = {
  label: string;
  coords: { lat: number; lng: number };
  durationToNext?: number;
};

export type UserCurrentPoint = {
  between?: [string, string];
  coords: { lat: number; lng: number };
  indexFrom?: number;
  indexTo?: number;
} | null;

export type UserRoute = {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  points: UserRoutePoint[];
  currentPoint: UserCurrentPoint;
};

export type UserPackageDelivery = {
  id: string;
  status: string;
  route: UserRoute | null;
  driver?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
};

export type UserPackage = {
  id: string;
  name: string;
  content: string;
  weight: number;
  images: string[];
  description: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  delivery?: UserPackageDelivery | null;
};

export type UserDelivery = {
  id: string;
  status: string;
  package: {
    id: string;
    name: string;
    weight: number;
    content?: string;
    destination?: string | null;
    owner?: {
      id: string;
      name?: string | null;
      email?: string | null;
    } | null;
  } | null;
  route: UserRoute | null;
  driver?: {
    id: string;
    name?: string | null;
    email?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
};

type DashboardUsersData = {
  users: AdminUser[];
  totalUsers: number;
  totalDeliveries: number;
  totalPackages: number;
};

type PackageOwner = {
  id?: string;
  name?: string | null;
  email?: string | null;
};

type DeliveryResponse = {
  id: string;
  package: {
    owner?: PackageOwner | null;
  } | null;
};

type PackageResponse = {
  id: string;
};

function toNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCoords(input: unknown): { lat: number; lng: number } | null {
  if (Array.isArray(input) && input.length >= 2) {
    const lat = toNumber(input[0]);
    const lng = toNumber(input[1]);
    if (lat === null || lng === null) return null;
    return { lat, lng };
  }

  if (input && typeof input === "object") {
    const value = input as {
      lat?: unknown;
      lng?: unknown;
      latitude?: unknown;
      longitude?: unknown;
    };

    const lat = toNumber(value.lat ?? value.latitude);
    const lng = toNumber(value.lng ?? value.longitude);
    if (lat === null || lng === null) return null;
    return { lat, lng };
  }

  return null;
}

function normalizeRoute(route: UserRoute | null | undefined): UserRoute | null {
  if (!route) return null;

  const normalizedPoints = Array.isArray(
    (route as { points?: unknown[] }).points,
  )
    ? ((route as { points: unknown[] }).points
        .map((point) => {
          if (!point || typeof point !== "object") return null;

          const value = point as {
            label?: unknown;
            coords?: unknown;
            durationToNext?: unknown;
          };

          const coords = normalizeCoords(value.coords);
          if (!coords) return null;

          return {
            label: String(value.label ?? ""),
            coords,
            durationToNext: toNumber(value.durationToNext) ?? undefined,
          };
        })
        .filter(Boolean) as UserRoutePoint[])
    : [];

  const currentPointRaw = (route as { currentPoint?: unknown }).currentPoint;
  let normalizedCurrentPoint: UserCurrentPoint = null;

  if (currentPointRaw && typeof currentPointRaw === "object") {
    const value = currentPointRaw as {
      between?: unknown;
      coords?: unknown;
      indexFrom?: unknown;
      indexTo?: unknown;
    };

    const coords = normalizeCoords(value.coords);
    if (coords) {
      normalizedCurrentPoint = {
        between: Array.isArray(value.between)
          ? ([
              String(value.between[0] ?? ""),
              String(value.between[1] ?? ""),
            ] as [string, string])
          : undefined,
        coords,
        indexFrom: toNumber(value.indexFrom) ?? undefined,
        indexTo: toNumber(value.indexTo) ?? undefined,
      };
    }
  }

  return {
    ...route,
    points: normalizedPoints,
    currentPoint: normalizedCurrentPoint,
  };
}

function normalizeOwner(owner: PackageOwner): AdminUser | null {
  const email = owner.email?.trim();
  const id = owner.id?.trim() || email;

  if (!id || !email) return null;

  return {
    id,
    name: owner.name?.trim() || email.split("@")[0],
    email,
    phone: "--",
    address: "--",
    country: "--",
  };
}

export async function getUsersDashboardData(): Promise<DashboardUsersData> {
  const [packagesResponse, deliveriesResponse] = await Promise.all([
    instance.get<PackageResponse[]>("/package"),
    instance.get<DeliveryResponse[]>("/package/deliveries"),
  ]);

  const deliveries = deliveriesResponse.data ?? [];
  const packages = packagesResponse.data ?? [];

  const usersById = new Map<string, AdminUser>();

  deliveries.forEach((delivery) => {
    const owner = delivery.package?.owner;
    if (!owner) return;

    const normalizedOwner = normalizeOwner(owner);
    if (!normalizedOwner) return;

    usersById.set(normalizedOwner.id, normalizedOwner);
  });

  const users = Array.from(usersById.values()).sort((first, second) =>
    first.name.localeCompare(second.name),
  );

  return {
    users,
    totalUsers: users.length,
    totalDeliveries: deliveries.length,
    totalPackages: packages.length,
  };
}

export const usersQueryKeys = {
  dashboard: ["users", "dashboard"] as const,
  profile: ["users", "profile"] as const,
  packages: ["users", "packages"] as const,
  deliveries: ["users", "deliveries"] as const,
  shippingAddresses: ["users", "shipping-addresses"] as const,
};

export async function getUserProfile() {
  const { data } = await instance.get<UserProfile>("/user/me");
  return data;
}

export async function getUserPackages() {
  const { data } = await instance.get<UserPackage[]>("/user/packages");
  const wrapped = data as unknown as {
    packages?: UserPackage[];
    data?: UserPackage[];
  };

  const rawPackages = Array.isArray(data)
    ? data
    : (wrapped.packages ?? wrapped.data ?? []);

  return rawPackages.map((pkg) => ({
    ...pkg,
    delivery: pkg.delivery
      ? {
          ...pkg.delivery,
          route: normalizeRoute(pkg.delivery.route),
        }
      : null,
  }));
}

export async function getUserDeliveries() {
  const { data } = await instance.get<UserDelivery[]>("/user/deliveries");
  const wrapped = data as unknown as {
    deliveries?: UserDelivery[];
    data?: UserDelivery[];
  };

  const rawDeliveries = Array.isArray(data)
    ? data
    : (wrapped.deliveries ?? wrapped.data ?? []);

  return rawDeliveries.map((delivery) => ({
    ...delivery,
    route: normalizeRoute(delivery.route),
  }));
}

export async function getUserShippingAddresses() {
  const { data } = await instance.get<ShippingAddress[]>(
    "/user/shipping-addresses",
  );
  if (Array.isArray(data)) {
    return data;
  }
  const wrapped = data as unknown as {
    shippingAddresses?: ShippingAddress[];
    data?: ShippingAddress[];
  };
  return wrapped.shippingAddresses ?? wrapped.data ?? [];
}

export async function updateUserProfile(input: UpdateUserProfileInput) {
  const { data } = await instance.patch<UserProfile>("/user/me", input);
  return data;
}

export async function saveShippingAddress(input: SaveShippingAddressInput) {
  const endpoint = input.id
    ? `/user/shipping-addresses/${input.id}`
    : "/user/shipping-addresses";
  const method = input.id ? instance.patch : instance.post;
  const { data } = await method<ShippingAddress>(endpoint, input);
  return data;
}

export async function saveUserAccount(input: SaveUserAccountInput) {
  const [profile, shippingAddress] = await Promise.all([
    updateUserProfile(input.profile),
    saveShippingAddress(input.shippingAddress),
  ]);

  return { profile, shippingAddress };
}

export function useUsersDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: usersQueryKeys.dashboard,
    queryFn: getUsersDashboardData,
    enabled,
    refetchInterval: 15000,
  });
}

export function useUserProfileQuery(enabled = true) {
  return useQuery({
    queryKey: usersQueryKeys.profile,
    queryFn: getUserProfile,
    enabled,
    refetchInterval: 15000,
  });
}

export function useUserPackagesQuery(enabled = true) {
  return useQuery({
    queryKey: usersQueryKeys.packages,
    queryFn: getUserPackages,
    enabled,
    refetchInterval: 15000,
  });
}

export function useUserDeliveriesQuery(enabled = true) {
  return useQuery({
    queryKey: usersQueryKeys.deliveries,
    queryFn: getUserDeliveries,
    enabled,
    refetchInterval: 15000,
  });
}

export function useUserShippingAddressesQuery(enabled = true) {
  return useQuery({
    queryKey: usersQueryKeys.shippingAddresses,
    queryFn: getUserShippingAddresses,
    enabled,
    refetchInterval: 15000,
  });
}

export function useSaveUserAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveUserAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.profile });
      void queryClient.invalidateQueries({
        queryKey: usersQueryKeys.shippingAddresses,
      });
      void queryClient.invalidateQueries({ queryKey: usersQueryKeys.packages });
      void queryClient.invalidateQueries({
        queryKey: usersQueryKeys.deliveries,
      });
    },
  });
}
