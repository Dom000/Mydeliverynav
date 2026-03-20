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
};

type PackagePayload = {
  name: string;
  weight: number;
  content: string;
  images: string[];
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

export default function AdminCreatePackageDeliveryPage() {
  const [name, setName] = useState("Books - Order #1234");
  const [weight, setWeight] = useState<number>(1.2);
  const [content, setContent] = useState("Assorted paperback books");
  const [imagesText, setImagesText] = useState(
    "https://cdn.example.com/imgs/books1.jpg",
  );
  const [ownerEmail, setOwnerEmail] = useState("reader@example.com");
  const [description, setDescription] = useState(
    "Leave at doorstep if no answer",
  );
  const [status, setStatus] = useState<PackagePayload["status"]>("PENDING");
  const [origin, setOrigin] = useState("Book Depot");
  const [destination, setDestination] = useState("Customer Home");
  const [points, setPoints] = useState<RoutePoint[]>([
    { label: "Start", coords: [40.7128, -74.006], durationToNext: 0 },
    { label: "Hub", coords: [40.7167, -74.0036], durationToNext: 300 },
    { label: "Corner", coords: [40.7201, -74.0009], durationToNext: 420 },
    { label: "Door", coords: [40.7237, -73.9982] },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [activePointIndex, setActivePointIndex] = useState(0);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const distance = useMemo(() => estimateDistanceKm(points), [points]);
  const polylinePositions = points.map((point) => point.coords);

  const payload: PackagePayload = useMemo(
    () => ({
      name,
      weight,
      content,
      images: imagesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
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
      imagesText,
      ownerEmail,
      description,
      status,
      origin,
      destination,
      distance,
      points,
    ],
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
        },
      ];
    });
  };

  const handlePointChange = (
    index: number,
    key: "label" | "durationToNext",
    value: string,
  ) => {
    setPoints((previous) =>
      previous.map((point, pointIndex) => {
        if (pointIndex !== index) return point;
        if (key === "label") {
          return { ...point, label: value };
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

  const handleSubmit = () => {
    console.log("Create package payload", payload);
    alert(
      "Package + delivery route payload ready. Check console for JSON output.",
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
                Image URLs (one per line)
              </Label>
              <Textarea
                id="images"
                value={imagesText}
                onChange={(event) => setImagesText(event.target.value)}
                className="bg-slate-800 border-slate-700 text-white min-h-[90px]"
              />
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
                      Duration to Next (sec)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      disabled={isLast}
                      value={isLast ? "" : Number(point.durationToNext ?? 0)}
                      onChange={(event) =>
                        handlePointChange(
                          index,
                          "durationToNext",
                          event.target.value,
                        )
                      }
                      className="bg-slate-800 border-slate-700 text-white disabled:opacity-50"
                      placeholder={isLast ? "Last point" : "e.g. 300"}
                    />
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
            {JSON.stringify(payload, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
