import { useMemo, useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Play, Square, Maximize2, Minimize2 } from "lucide-react";

type RoutePoint = {
  label: string;
  coords: LatLngTuple;
  durationToNext?: number;
  nextArrivalAt?: string;
};

type PackagePayload = {
  name: string;
  weight: number;
  content: string;
  images: File[];
  ownerEmail: string;
  description: string;
  status: "PENDING" | "IN_TRANSIT" | "DELIVERED";
  route: {
    origin: string;
    destination: string;
    distance: number;
    points: RoutePoint[];
  };
};

function RoutePointPicker({
  onPick,
}: {
  onPick: (coords: LatLngTuple) => void;
}) {
  useMapEvents({
    click(event) {
      onPick([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

function InvalidateMapSize({ trigger }: { trigger: boolean }) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [map, trigger]);

  return null;
}

function estimateDistanceKm(points: RoutePoint[]) {
  if (points.length < 2) return 0;

  const toRad = (value: number) => (value * Math.PI) / 180;
  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    const [lat1, lon1] = points[index - 1].coords;
    const [lat2, lon2] = points[index].coords;

    const earthRadiusKm = 6371;
    const deltaLat = toRad(lat2 - lat1);
    const deltaLon = toRad(lon2 - lon1);

    const haversine =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const centralAngle =
      2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
    total += earthRadiusKm * centralAngle;
  }

  return Number(total.toFixed(2));
}

function toDateTimeLocalValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function toAmPmLabel(dateTimeValue?: string) {
  if (!dateTimeValue) return "";
  const parsed = new Date(dateTimeValue);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed);
}

function initialRoutePoints(): RoutePoint[] {
  const now = Date.now();
  let cumulativeSeconds = 0;

  const basePoints: RoutePoint[] = [
    { label: "Start", coords: [40.7128, -74.006], durationToNext: 0 },
    { label: "Hub", coords: [40.7167, -74.0036], durationToNext: 300 },
    { label: "Corner", coords: [40.7201, -74.0009], durationToNext: 420 },
    { label: "Door", coords: [40.7237, -73.9982] },
  ];

  return basePoints.map((point, index) => {
    if (index >= basePoints.length - 1) return point;

    cumulativeSeconds += Number(point.durationToNext ?? 0);
    return {
      ...point,
      nextArrivalAt: toDateTimeLocalValue(
        new Date(now + cumulativeSeconds * 1000),
      ),
    };
  });
}

export default function AdminCreatePackageDeliveryPage() {
  const [name, setName] = useState("Books - Order #1234");
  const [weight, setWeight] = useState<number>(1.2);
  const [content, setContent] = useState("Assorted paperback books");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [ownerEmail, setOwnerEmail] = useState("reader@example.com");
  const [description, setDescription] = useState(
    "Leave at doorstep if no answer",
  );
  const [status, setStatus] = useState<PackagePayload["status"]>("PENDING");
  const [origin, setOrigin] = useState("Book Depot");
  const [destination, setDestination] = useState("Customer Home");
  const [points, setPoints] = useState<RoutePoint[]>(() =>
    initialRoutePoints(),
  );

  const [isSimulating, setIsSimulating] = useState(false);
  const [activePointIndex, setActivePointIndex] = useState(0);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const distance = useMemo(() => estimateDistanceKm(points), [points]);
  const polylinePositions = points.map((point) => point.coords);

  const imagePreviewUrls = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles],
  );

  useEffect(
    () => () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    },
    [imagePreviewUrls],
  );

  const payload: PackagePayload = useMemo(
    () => ({
      name,
      weight,
      content,
      images: imageFiles,
      ownerEmail,
      description,
      status,
      route: {
        origin,
        destination,
        distance,
        points: points.map((point, index) => ({
          label: point.label || `Point ${index + 1}`,
          coords: [
            Number(point.coords[0].toFixed(6)),
            Number(point.coords[1].toFixed(6)),
          ] as LatLngTuple,
          ...(index < points.length - 1
            ? { durationToNext: Number(point.durationToNext ?? 0) }
            : {}),
        })),
      },
    }),
    [
      name,
      weight,
      content,
      imageFiles,
      ownerEmail,
      description,
      status,
      origin,
      destination,
      distance,
      points,
    ],
  );

  const payloadPreview = useMemo(
    () => ({
      ...payload,
      images: payload.images.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    }),
    [payload],
  );

  useEffect(() => {
    if (!isSimulating || points.length < 2) return;

    const currentPoint = points[activePointIndex];
    const isLastPoint = activePointIndex >= points.length - 1;
    if (isLastPoint) {
      setIsSimulating(false);
      return;
    }

    const waitSeconds = Math.max(1, Number(currentPoint.durationToNext ?? 1));
    const timer = window.setTimeout(() => {
      setActivePointIndex((previous) =>
        Math.min(previous + 1, points.length - 1),
      );
    }, waitSeconds * 1000);

    return () => window.clearTimeout(timer);
  }, [isSimulating, activePointIndex, points]);

  const handleMapPick = (coords: LatLngTuple) => {
    setPoints((previous) => {
      const nextIndex = previous.length + 1;
      return [
        ...previous,
        {
          label: `Point ${nextIndex}`,
          coords,
          durationToNext: 60,
          nextArrivalAt: toDateTimeLocalValue(new Date(Date.now() + 60 * 1000)),
        },
      ];
    });
  };

  const handlePointChange = (
    index: number,
    key: "label" | "durationToNext" | "nextArrivalAt",
    value: string,
  ) => {
    setPoints((previous) =>
      previous.map((point, pointIndex) => {
        if (pointIndex !== index) return point;
        if (key === "label") {
          return { ...point, label: value };
        }
        if (key === "nextArrivalAt") {
          const selectedTime = new Date(value).getTime();
          const durationToNext = Number.isNaN(selectedTime)
            ? 0
            : Math.max(0, Math.round((selectedTime - Date.now()) / 1000));

          return {
            ...point,
            nextArrivalAt: value,
            durationToNext,
          };
        }
        return {
          ...point,
          durationToNext: Number.isNaN(Number(value)) ? 0 : Number(value),
        };
      }),
    );
  };

  const removePoint = (index: number) => {
    setPoints((previous) =>
      previous.filter((_, pointIndex) => pointIndex !== index),
    );
    setActivePointIndex((previous) =>
      Math.min(previous, Math.max(points.length - 2, 0)),
    );
  };

  const startSimulation = () => {
    if (points.length < 2) return;
    setActivePointIndex(0);
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setImageFiles(files);
  };

  const removeImage = (index: number) => {
    setImageFiles((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index),
    );
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("weight", String(payload.weight));
    formData.append("content", payload.content);
    formData.append("ownerEmail", payload.ownerEmail);
    formData.append("description", payload.description);
    formData.append("status", payload.status);
    formData.append("route", JSON.stringify(payload.route));

    payload.images.forEach((file) => {
      formData.append("images", file);
    });

    console.log("Create package payload", payload);
    console.log("Create package payload preview", payloadPreview);
    console.log("FormData ready with image files", {
      imageCount: payload.images.length,
    });
    alert(
      "Package + delivery route payload ready with image files. Check console output.",
    );
  };

  useEffect(() => {
    if (!isMapFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMapFullscreen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMapFullscreen]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Create Package Delivery
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Build package + delivery routes by selecting map coordinates
          point-by-point.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base sm:text-lg">
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-slate-300">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(event) =>
                    setWeight(Number(event.target.value) || 0)
                  }
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-slate-300">
                Content
              </Label>
              <Input
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail" className="text-slate-300">
                Owner Email
              </Label>
              <Input
                id="ownerEmail"
                type="email"
                value={ownerEmail}
                onChange={(event) => setOwnerEmail(event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images" className="text-slate-300">
                Package Images
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                className="bg-slate-800 border-slate-700 text-white file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-xs sm:file:text-sm file:text-white hover:file:bg-slate-600"
              />
              <p className="text-xs text-slate-400">
                Select one or more image files. These files are sent directly to
                the backend as multipart form data.
              </p>
              {imagePreviewUrls.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {imagePreviewUrls.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="rounded-md border border-slate-700 bg-slate-800 p-2 space-y-2"
                    >
                      <div className="overflow-hidden rounded-md border border-slate-700">
                        <img
                          src={url}
                          alt={imageFiles[index]?.name || `Image ${index + 1}`}
                          className="h-20 sm:h-24 w-full object-cover"
                        />
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                        {imageFiles[index]?.name}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeImage(index)}
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-700 h-8"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  No images selected yet.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="bg-slate-800 border-slate-700 text-white min-h-[90px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-slate-300">
                  Origin
                </Label>
                <Input
                  id="origin"
                  value={origin}
                  onChange={(event) => setOrigin(event.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-slate-300">
                  Destination
                </Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-300">
                  Status
                </Label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as PackagePayload["status"])
                  }
                  className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border border-slate-700 bg-slate-800 p-3">
              <p className="text-xs text-slate-400">Estimated distance</p>
              <p className="text-lg font-semibold text-white">{distance} km</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-white text-base sm:text-lg">
                Route Builder Map
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMapFullscreen((previous) => !previous)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                {isMapFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Close Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Open Fullscreen
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[300px] sm:h-[360px] overflow-hidden rounded-lg border border-slate-700">
              <MapContainer
                center={points[0]?.coords || [40.7128, -74.006]}
                zoom={13}
                className="h-full w-full"
              >
                <InvalidateMapSize trigger={isMapFullscreen} />
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RoutePointPicker onPick={handleMapPick} />
                {polylinePositions.length > 1 && (
                  <Polyline
                    positions={polylinePositions}
                    pathOptions={{ color: "#ef4444", weight: 4 }}
                  />
                )}
                {points.map((point, index) => (
                  <CircleMarker
                    key={`${point.label}-${index}`}
                    center={point.coords}
                    radius={index === activePointIndex ? 8 : 6}
                    pathOptions={{
                      color: index === activePointIndex ? "#10b981" : "#ef4444",
                      fillColor:
                        index === activePointIndex ? "#10b981" : "#ef4444",
                      fillOpacity: 0.9,
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -8]}>
                      {point.label} [{point.coords[0].toFixed(4)},{" "}
                      {point.coords[1].toFixed(4)}]
                    </Tooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            <p className="text-xs text-slate-400">
              Click on the map to add route points. Each point segment duration
              controls how long it takes to move to the next coordinate.
            </p>
          </CardContent>
        </Card>
      </div>

      {isMapFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950 p-3 sm:p-4">
          <div className="h-full rounded-lg border border-slate-700 bg-slate-900 flex flex-col">
            <div className="p-3 sm:p-4 border-b border-slate-700 flex items-center justify-between gap-2">
              <h2 className="text-white font-semibold text-sm sm:text-base">
                Route Builder Map (Fullscreen)
              </h2>
              <Button
                type="button"
                onClick={() => setIsMapFullscreen(false)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Minimize2 className="w-4 h-4 mr-2" />
                Close Fullscreen
              </Button>
            </div>
            <div className="flex-1 p-3 sm:p-4">
              <div className="h-full overflow-hidden rounded-lg border border-slate-700">
                <MapContainer
                  center={points[0]?.coords || [40.7128, -74.006]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <InvalidateMapSize trigger={isMapFullscreen} />
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <RoutePointPicker onPick={handleMapPick} />
                  {polylinePositions.length > 1 && (
                    <Polyline
                      positions={polylinePositions}
                      pathOptions={{ color: "#ef4444", weight: 4 }}
                    />
                  )}
                  {points.map((point, index) => (
                    <CircleMarker
                      key={`fullscreen-${point.label}-${index}`}
                      center={point.coords}
                      radius={index === activePointIndex ? 8 : 6}
                      pathOptions={{
                        color:
                          index === activePointIndex ? "#10b981" : "#ef4444",
                        fillColor:
                          index === activePointIndex ? "#10b981" : "#ef4444",
                        fillOpacity: 0.9,
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -8]}>
                        {point.label} [{point.coords[0].toFixed(4)},{" "}
                        {point.coords[1].toFixed(4)}]
                      </Tooltip>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Route Points & Segment Duration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {points.length === 0 && (
            <p className="text-sm text-slate-400">
              No points selected yet. Click the map to add points.
            </p>
          )}

          {points.map((point, index) => {
            const isLast = index === points.length - 1;
            return (
              <div
                key={`${point.label}-${index}`}
                className="border border-slate-700 rounded-md p-3"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                  <div className="lg:col-span-3 space-y-1">
                    <Label className="text-slate-300">Label</Label>
                    <Input
                      value={point.label}
                      onChange={(event) =>
                        handlePointChange(index, "label", event.target.value)
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="lg:col-span-4 space-y-1">
                    <Label className="text-slate-300">Coordinates</Label>
                    <Input
                      value={`${point.coords[0].toFixed(6)}, ${point.coords[1].toFixed(6)}`}
                      readOnly
                      className="bg-slate-800 border-slate-700 text-slate-300"
                    />
                  </div>

                  <div className="lg:col-span-3 space-y-1">
                    <Label className="text-slate-300">
                      Arrive at Next Point
                    </Label>
                    <Input
                      type="datetime-local"
                      disabled={isLast}
                      value={isLast ? "" : (point.nextArrivalAt ?? "")}
                      onChange={(event) =>
                        handlePointChange(
                          index,
                          "nextArrivalAt",
                          event.target.value,
                        )
                      }
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                      placeholder={isLast ? "Last point" : "Pick date & time"}
                    />
                    {!isLast && (
                      <div className="space-y-0.5">
                        <p className="text-[11px] text-slate-300">
                          {point.nextArrivalAt
                            ? `Selected time: ${toAmPmLabel(point.nextArrivalAt)}`
                            : "Selected time: --"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Auto-converted to {Number(point.durationToNext ?? 0)}{" "}
                          sec for backend processing.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removePoint(index)}
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <Button
              type="button"
              onClick={startSimulation}
              disabled={isSimulating || points.length < 2}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Movement Simulation
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={stopSimulation}
              disabled={!isSimulating}
              className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Simulation
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Create Package Delivery
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Payload Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs sm:text-sm text-slate-200 bg-slate-950 border border-slate-700 rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words">
            {JSON.stringify(payloadPreview, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
