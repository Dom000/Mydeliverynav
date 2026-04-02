import { useQuery } from "@tanstack/react-query";
import { instance } from "./instance";

export type TrackingStatusLabel =
  | "Pending"
  | "In Transit"
  | "Delivered"
  | "Cancelled"
  | "Obstructed";

export type TrackingEvent = {
  date: string;
  time: string;
  location: string;
  status: string;
  completed: boolean;
};

export type TrackingRoutePoint = {
  label: string;
  coords: { lat: number; lng: number };
  durationToNext?: number;
};

export type TrackingCurrentPoint = {
  between?: [string, string];
  coords: { lat: number; lng: number };
  indexFrom?: number;
  indexTo?: number;
} | null;

export type TrackingRoute = {
  origin: string;
  destination: string;
  points: TrackingRoutePoint[];
  currentPoint: TrackingCurrentPoint;
};

export type TrackingRecord = {
  status: TrackingStatusLabel;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  weight: string;
  dimensions: string;
  events: TrackingEvent[];
  coordinates: { lat: number; lng: number }[];
  route: TrackingRoute;
};

type BackendStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "OBSTRUCTED";

type BackendRoutePoint = {
  label: string;
  coords: [number, number];
  durationToNext?: number;
};

type BackendTrackingPackage = {
  id: string;
  weight: number;
  content: string;
  status: BackendStatus;
  createdAt?: string;
  updatedAt?: string;
  delivery?: {
    status: BackendStatus;
    remainingSeconds?: number;
    route?: {
      origin: string;
      destination: string;
      points: BackendRoutePoint[];
      currentPoint?: {
        between?: [string, string];
        coords?: [number, number];
        indexFrom?: number;
        indexTo?: number;
      } | null;
    } | null;
  } | null;
};

const trackingPrefix = "/package";

function toStatusLabel(status?: BackendStatus): TrackingStatusLabel {
  if (status === "IN_TRANSIT") return "In Transit";
  if (status === "DELIVERED") return "Delivered";
  if (status === "CANCELLED") return "Cancelled";
  if (status === "OBSTRUCTED") return "Obstructed";
  return "Pending";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatTime(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(value);
}

function mapEvents(input: BackendTrackingPackage): TrackingEvent[] {
  const points = input.delivery?.route?.points ?? [];
  const status = input.delivery?.status ?? input.status;

  if (points.length === 0) {
    const fallbackDate = new Date(
      input.updatedAt || input.createdAt || Date.now(),
    );
    return [
      {
        date: formatDate(fallbackDate),
        time: formatTime(fallbackDate),
        location: input.delivery?.route?.destination || "Unknown",
        status: toStatusLabel(status),
        completed: true,
      },
    ];
  }

  const base = new Date(input.createdAt || Date.now());
  const currentIndex =
    status === "DELIVERED"
      ? points.length - 1
      : Math.max(
          0,
          Number(input.delivery?.route?.currentPoint?.indexFrom ?? 0),
        );

  let elapsedSeconds = 0;
  return points.map((point, index) => {
    if (index > 0) {
      const previousDuration = Number(points[index - 1]?.durationToNext ?? 0);
      elapsedSeconds += Number.isNaN(previousDuration) ? 0 : previousDuration;
    }

    const eventAt = new Date(base.getTime() + elapsedSeconds * 1000);
    const pointLabel = point.label || `Stop ${index + 1}`;

    return {
      date: formatDate(eventAt),
      time: formatTime(eventAt),
      location: pointLabel,
      status: index === 0 ? "Picked up" : `Reached ${pointLabel}`,
      completed: index <= currentIndex,
    };
  });
}

function mapTrackingRecord(input: BackendTrackingPackage): TrackingRecord {
  const route = input.delivery?.route;
  const points = route?.points ?? [];
  const currentStatus = input.delivery?.status ?? input.status;
  const remainingSeconds = Number(input.delivery?.remainingSeconds ?? 0);
  const currentPoint = route?.currentPoint ?? null;

  const mappedRoutePoints: TrackingRoutePoint[] = points.map((point) => ({
    label: point.label,
    coords: {
      lat: Number(point.coords[0]),
      lng: Number(point.coords[1]),
    },
    durationToNext: point.durationToNext,
  }));

  const mappedCurrentPoint: TrackingCurrentPoint = currentPoint?.coords
    ? {
        between: currentPoint.between,
        coords: {
          lat: Number(currentPoint.coords[0]),
          lng: Number(currentPoint.coords[1]),
        },
        indexFrom: currentPoint.indexFrom,
        indexTo: currentPoint.indexTo,
      }
    : null;

  const estimatedDelivery =
    currentStatus === "DELIVERED"
      ? `Delivered on ${formatDate(new Date(input.updatedAt || Date.now()))}`
      : remainingSeconds > 0
        ? formatDate(new Date(Date.now() + remainingSeconds * 1000))
        : "Updating";

  return {
    status: toStatusLabel(currentStatus),
    origin: route?.origin ?? "Unknown",
    destination: route?.destination ?? "Unknown",
    estimatedDelivery,
    weight: `${Number(input.weight || 0)} kg`,
    dimensions: input.content || "Not specified",
    events: mapEvents(input),
    coordinates: mappedRoutePoints.map((point) => point.coords),
    route: {
      origin: route?.origin ?? "Unknown",
      destination: route?.destination ?? "Unknown",
      points: mappedRoutePoints,
      currentPoint: mappedCurrentPoint,
    },
  };
}

export async function getTrackingByNumber(trackingNumber: string) {
  const normalized = trackingNumber.trim();
  const { data } = await instance.get<BackendTrackingPackage | null>(
    `${trackingPrefix}/${normalized}`,
  );

  if (!data) {
    throw new Error("Tracking number not found.");
  }

  return mapTrackingRecord(data);
}

export const trackingQueryKeys = {
  byNumber: (trackingNumber: string) =>
    ["tracking", trackingNumber.toUpperCase()] as const,
};

export function useTrackingQuery(trackingNumber: string, enabled = true) {
  return useQuery({
    queryKey: trackingQueryKeys.byNumber(trackingNumber),
    queryFn: () => getTrackingByNumber(trackingNumber),
    enabled: enabled && Boolean(trackingNumber.trim()),
    retry: false,
    refetchInterval: 10000,
  });
}
