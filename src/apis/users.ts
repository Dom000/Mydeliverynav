import { useQuery } from "@tanstack/react-query";
import { instance } from "./instance";

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
};

export function useUsersDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: usersQueryKeys.dashboard,
    queryFn: getUsersDashboardData,
    enabled,
    refetchInterval: 15000,
  });
}
