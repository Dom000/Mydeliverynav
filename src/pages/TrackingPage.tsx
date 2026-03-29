import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L, { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  Calendar,
  Weight,
  Box,
  ArrowLeft,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Link } from "react-router-dom";

const trackingAnimationStyles = `
  @keyframes ping-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(213, 61, 61, 0.7);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(213, 61, 61, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(213, 61, 61, 0);
    }
  }

  @keyframes flowing-route {
    0% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -18;
    }
  }

  .animated-route-line {
    animation: flowing-route 2s linear infinite;
    stroke-dasharray: 10 8;
  }

  .ping-marker {
    animation: ping-pulse 2s infinite;
  }
`;

type TrackingRecord = {
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  weight: string;
  dimensions: string;
  events: {
    date: string;
    time: string;
    location: string;
    status: string;
    completed: boolean;
  }[];
  coordinates: { lat: number; lng: number }[];
};

const FitMapToRoute = ({ points }: { points: LatLngTuple[] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 8, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 9, animate: true });
  }, [map, points]);

  return null;
};

const InvalidateMapSize = ({ active }: { active: boolean }) => {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [map, active]);

  return null;
};

// Mock tracking data
const mockTrackingData: Record<string, TrackingRecord> = {
  EW123456789: {
    status: "In Transit",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    estimatedDelivery: "Mar 20, 2026",
    weight: "2.5 lbs",
    dimensions: "12 x 8 x 6 in",
    events: [
      {
        date: "Mar 18, 2026",
        time: "08:30 AM",
        location: "Chicago, IL",
        status: "Arrived at sorting facility",
        completed: true,
      },
      {
        date: "Mar 17, 2026",
        time: "11:45 PM",
        location: "Indianapolis, IN",
        status: "Departed facility",
        completed: true,
      },
      {
        date: "Mar 17, 2026",
        time: "04:20 PM",
        location: "Indianapolis, IN",
        status: "Arrived at facility",
        completed: true,
      },
      {
        date: "Mar 16, 2026",
        time: "09:15 AM",
        location: "New York, NY",
        status: "Picked up",
        completed: true,
      },
    ],
    coordinates: [
      { lat: 40.7128, lng: -74.006 },
      { lat: 39.7684, lng: -86.1581 },
      { lat: 41.8781, lng: -87.6298 },
      { lat: 34.0522, lng: -118.2437 },
    ],
  },
  EW987654321: {
    status: "Delivered",
    origin: "Miami, FL",
    destination: "Seattle, WA",
    estimatedDelivery: "Delivered on Mar 15, 2026",
    weight: "5.0 lbs",
    dimensions: "15 x 10 x 8 in",
    events: [
      {
        date: "Mar 15, 2026",
        time: "02:30 PM",
        location: "Seattle, WA",
        status: "Delivered",
        completed: true,
      },
      {
        date: "Mar 15, 2026",
        time: "08:00 AM",
        location: "Seattle, WA",
        status: "Out for delivery",
        completed: true,
      },
      {
        date: "Mar 14, 2026",
        time: "06:45 PM",
        location: "Seattle, WA",
        status: "Arrived at facility",
        completed: true,
      },
      {
        date: "Mar 12, 2026",
        time: "10:30 AM",
        location: "Miami, FL",
        status: "Picked up",
        completed: true,
      },
    ],
    coordinates: [
      { lat: 25.7617, lng: -80.1918 },
      { lat: 47.6062, lng: -122.3321 },
    ],
  },
};

const TrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(
    searchParams.get("number") || "",
  );
  const [trackingData, setTrackingData] = useState<TrackingRecord | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLngTuple[]>([]);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isFullscreenPanelCollapsed, setIsFullscreenPanelCollapsed] =
    useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate page entrance
    gsap.fromTo(
      ".tracking-content",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    );

    // Add tracking animation styles
    const styleTag = document.createElement("style");
    styleTag.innerHTML = trackingAnimationStyles;
    document.head.appendChild(styleTag);

    // If tracking number in URL, search automatically
    const urlNumber = searchParams.get("number");
    if (urlNumber) {
      handleTrack(urlNumber);
    }
  }, []);

  useEffect(() => {
    if (!trackingData) {
      setRouteCoordinates([]);
      setCurrentPointIndex(0);
      return;
    }

    setCurrentPointIndex(0);
    setIsRouteLoading(true);

    const fallbackRoute = trackingData.coordinates.map(
      (point): LatLngTuple => [point.lat, point.lng],
    );

    if (trackingData.coordinates.length < 2) {
      setRouteCoordinates(fallbackRoute);
      setIsRouteLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchRoute = async () => {
      try {
        const coordinatesParam = trackingData.coordinates
          .map((point) => `${point.lng},${point.lat}`)
          .join(";");

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinatesParam}?overview=full&geometries=geojson&steps=false`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch route");
        }

        const data = (await response.json()) as {
          routes?: { geometry?: { coordinates?: [number, number][] } }[];
        };

        const route = data.routes?.[0]?.geometry?.coordinates;
        if (route && route.length > 0) {
          setRouteCoordinates(route.map(([lng, lat]) => [lat, lng]));
        } else {
          setRouteCoordinates(fallbackRoute);
        }
      } catch {
        setRouteCoordinates(fallbackRoute);
      } finally {
        setIsRouteLoading(false);
      }
    };

    fetchRoute();

    return () => {
      controller.abort();
    };
  }, [trackingData]);

  useEffect(() => {
    if (!trackingData || trackingData.status !== "In Transit") return;
    if (trackingData.coordinates.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentPointIndex((prev) => {
        const lastIndex = trackingData.coordinates.length - 1;
        return prev >= lastIndex ? lastIndex : prev + 1;
      });
    }, 2800);

    return () => {
      window.clearInterval(timer);
    };
  }, [trackingData]);

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

  useEffect(() => {
    if (!isMapFullscreen) return;
    const isMobileViewport = window.innerWidth < 640;
    setIsFullscreenPanelCollapsed(isMobileViewport);
  }, [isMapFullscreen]);

  const handleTrack = (number: string = trackingNumber) => {
    if (!number.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setIsSearching(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const data = mockTrackingData[number.toUpperCase()];
      if (data) {
        setTrackingData(data);
        setSearchParams({ number: number.toUpperCase() });
      } else {
        setError("Tracking number not found. Try EW123456789 or EW987654321");
        setTrackingData(null);
      }
      setIsSearching(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack();
  };

  const stopPoints = trackingData?.coordinates ?? [];
  const currentCoordinate =
    stopPoints.length > 0
      ? stopPoints[Math.min(currentPointIndex, stopPoints.length - 1)]
      : null;
  const mapPoints =
    routeCoordinates.length > 0
      ? routeCoordinates
      : stopPoints.map((point): LatLngTuple => [point.lat, point.lng]);
  const mapCenter: LatLngTuple = mapPoints[0] ?? [39.5, -98.35];

  return (
    <div className="min-h-screen bg-[#F6F6F2] pt-20">
      <div className="tracking-content">
        {/* Header */}
        <div className="bg-[#111111] text-[#F6F6F2] py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-[#F6F6F2]/60 hover:text-[#D53D3D] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="font-['Sora'] font-bold text-[clamp(32px,4vw,56px)] leading-[1.05] mb-4">
              Track Your Shipment
            </h1>
            <p className="text-[#F6F6F2]/70 max-w-xl">
              Enter your tracking number to get real-time updates on your
              package location and estimated delivery time.
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="py-12 px-8">
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-4 max-w-2xl">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., EW123456789)"
                  className="w-full px-5 py-4 bg-white border border-foreground/10 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D53D3D]/30"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary px-8 disabled:opacity-50"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Track
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Results */}
            {trackingData && (
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-foreground/8 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          trackingData.status === "Delivered"
                            ? "bg-green-100"
                            : "bg-[#D53D3D]/10"
                        }`}
                      >
                        {trackingData.status === "Delivered" ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Truck className="w-6 h-6 text-[#D53D3D]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p
                          className={`font-['Sora'] font-semibold ${
                            trackingData.status === "Delivered"
                              ? "text-green-600"
                              : "text-[#D53D3D]"
                          }`}
                        >
                          {trackingData.status}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-foreground/8">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-medium">{trackingData.origin}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#D53D3D] mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">To</p>
                          <p className="font-medium">
                            {trackingData.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Estimated Delivery
                          </p>
                          <p className="font-medium">
                            {trackingData.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Weight className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Weight
                          </p>
                          <p className="font-medium">{trackingData.weight}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Box className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Dimensions
                          </p>
                          <p className="font-medium">
                            {trackingData.dimensions}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Map */}
                  <div
                    ref={mapRef}
                    className={`${
                      isMapFullscreen
                        ? "fixed inset-0 z-[100] bg-[#111111] border-0 shadow-none"
                        : "bg-white border border-foreground/8 overflow-hidden shadow-sm"
                    }`}
                  >
                    <div
                      className={`p-4 border-b flex items-center justify-between ${
                        isMapFullscreen
                          ? "border-white/10 text-white bg-[#111111]"
                          : "border-foreground/8"
                      }`}
                    >
                      <h3 className="font-['Sora'] font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#D53D3D]" />
                        Shipment Route
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsMapFullscreen((prev) => !prev)}
                        className={`inline-flex items-center gap-2 text-sm px-3 py-2 border transition-colors ${
                          isMapFullscreen
                            ? "border-white/20 text-white hover:bg-white/10"
                            : "border-foreground/15 text-foreground hover:bg-foreground/5"
                        }`}
                      >
                        {isMapFullscreen ? (
                          <>
                            <Minimize2 className="w-4 h-4" />
                            Exit Fullscreen
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-4 h-4" />
                            Fullscreen
                          </>
                        )}
                      </button>
                    </div>
                    <div
                      className={`relative ${
                        isMapFullscreen ? "h-[calc(100vh-73px)]" : "h-[360px]"
                      }`}
                    >
                      <MapContainer
                        center={mapCenter}
                        zoom={5}
                        scrollWheelZoom={false}
                        className="w-full h-full"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap contributors"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {mapPoints.length > 1 && (
                          <Polyline
                            positions={mapPoints}
                            eventHandlers={{
                              add: (event: any) => {
                                const path = event.target._path;
                                if (path) {
                                  setTimeout(() => {
                                    path.classList.add("animated-route-line");
                                  }, 50);
                                }
                              },
                            }}
                            pathOptions={{
                              color: "#D53D3D",
                              weight: 4,
                              opacity: 0.9,
                              dashArray: "10 8",
                              lineCap: "round" as const,
                              lineJoin: "round" as const,
                            }}
                          />
                        )}

                        {stopPoints.map((point, index) => (
                          <CircleMarker
                            key={`${point.lat}-${point.lng}-${index}`}
                            center={[point.lat, point.lng]}
                            radius={index === stopPoints.length - 1 ? 7 : 6}
                            pathOptions={{
                              color: "#D53D3D",
                              fillColor:
                                index === stopPoints.length - 1
                                  ? "#D53D3D"
                                  : "#FFFFFF",
                              fillOpacity: 1,
                              weight: 2,
                            }}
                          >
                            <Tooltip direction="top" offset={[0, -8]}>
                              Stop {index + 1}
                            </Tooltip>
                          </CircleMarker>
                        ))}

                        {currentCoordinate &&
                          trackingData.status === "In Transit" && (
                            <>
                              <CircleMarker
                                center={[
                                  currentCoordinate.lat,
                                  currentCoordinate.lng,
                                ]}
                                radius={10}
                                pathOptions={{
                                  color: "#D53D3D",
                                  fillColor: "#D53D3D",
                                  fillOpacity: 0.4,
                                  weight: 0,
                                }}
                                eventHandlers={{
                                  add: (event: any) => {
                                    const circle = event.target._path;
                                    if (circle) {
                                      circle.classList.add("ping-marker");
                                    }
                                  },
                                }}
                              />
                              <CircleMarker
                                center={[
                                  currentCoordinate.lat,
                                  currentCoordinate.lng,
                                ]}
                                radius={10}
                                pathOptions={{
                                  color: "#D53D3D",
                                  fillColor: "#D53D3D",
                                  fillOpacity: 0.8,
                                  weight: 2,
                                }}
                              >
                                <Tooltip
                                  direction="top"
                                  offset={[0, -8]}
                                  permanent
                                >
                                  Live position
                                </Tooltip>
                              </CircleMarker>
                            </>
                          )}

                        <FitMapToRoute points={mapPoints} />
                        <InvalidateMapSize active={isMapFullscreen} />
                      </MapContainer>

                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 text-xs z-[500]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-3 h-3 rounded-full bg-[#D53D3D]" />
                          <span>
                            {isRouteLoading
                              ? "Loading route..."
                              : "Live route active"}
                          </span>
                        </div>
                        {currentCoordinate && (
                          <p>
                            {currentCoordinate.lat.toFixed(4)},{" "}
                            {currentCoordinate.lng.toFixed(4)}
                          </p>
                        )}
                        {!currentCoordinate && mapPoints[0] && (
                          <p>
                            {mapPoints[0][0].toFixed(4)},{" "}
                            {mapPoints[0][1].toFixed(4)}
                          </p>
                        )}
                        {!currentCoordinate && !mapPoints[0] && (
                          <p>No coordinates available</p>
                        )}
                      </div>
                      {isRouteLoading && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 text-xs text-muted-foreground z-[500]">
                          Calculating road route...
                        </div>
                      )}

                      {isMapFullscreen && trackingData && (
                        <div className="absolute bottom-3 left-3 right-3 sm:top-4 sm:right-4 sm:left-auto sm:bottom-auto sm:w-[min(92vw,380px)] bg-white/95 backdrop-blur border border-foreground/10 shadow-xl z-[500]">
                          <div className="p-3 sm:p-4 border-b border-foreground/10">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-['Sora'] font-semibold text-sm sm:text-base mb-2">
                                  Shipment Status
                                </h4>
                                <div className="flex items-center gap-2">
                                  {trackingData.status === "Delivered" ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <Truck className="w-5 h-5 text-[#D53D3D]" />
                                  )}
                                  <p
                                    className={`font-medium text-sm sm:text-base ${
                                      trackingData.status === "Delivered"
                                        ? "text-green-600"
                                        : "text-[#D53D3D]"
                                    }`}
                                  >
                                    {trackingData.status}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 pr-2">
                                  {trackingData.origin} →{" "}
                                  {trackingData.destination}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setIsFullscreenPanelCollapsed(
                                    (previous) => !previous,
                                  )
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs border border-foreground/15 hover:bg-foreground/5 transition-colors"
                              >
                                {isFullscreenPanelCollapsed ? (
                                  <>
                                    <Maximize2 className="w-3.5 h-3.5" />
                                    Expand
                                  </>
                                ) : (
                                  <>
                                    <Minimize2 className="w-3.5 h-3.5" />
                                    Collapse
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {!isFullscreenPanelCollapsed && (
                            <div className="p-3 sm:p-4 max-h-[36vh] sm:max-h-[calc(100vh-13rem)] overflow-y-auto">
                              <h4 className="font-['Sora'] font-semibold text-sm sm:text-base mb-3">
                                Shipment History
                              </h4>
                              <div className="space-y-3 sm:space-y-4">
                                {trackingData.events.map((event, index) => (
                                  <div key={index} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                          event.completed
                                            ? "bg-[#D53D3D]"
                                            : "bg-foreground/10"
                                        }`}
                                      >
                                        {event.completed ? (
                                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                                        ) : (
                                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                        )}
                                      </div>
                                      {index <
                                        trackingData.events.length - 1 && (
                                        <div className="w-0.5 h-full bg-foreground/10 mt-1" />
                                      )}
                                    </div>
                                    <div className="flex-1 pb-3 sm:pb-4">
                                      <p className="text-sm font-medium">
                                        {event.status}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {event.location}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {event.date} at {event.time}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white border border-foreground/8 p-6 shadow-sm">
                    <h3 className="font-['Sora'] font-semibold mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#D53D3D]" />
                      Shipment History
                    </h3>
                    <div className="space-y-6">
                      {trackingData.events.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                event.completed
                                  ? "bg-[#D53D3D]"
                                  : "bg-foreground/10"
                              }`}
                            >
                              {event.completed ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            {index < trackingData.events.length - 1 && (
                              <div className="w-0.5 h-full bg-foreground/10 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className="font-medium">{event.status}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.location}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.date} at {event.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Demo hint */}
            {!trackingData && !error && (
              <div className="mt-12 p-6 bg-white border border-foreground/8">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Demo:</strong> Try
                  tracking numbers{" "}
                  <code className="bg-foreground/5 px-2 py-1 rounded">
                    EW123456789
                  </code>{" "}
                  or{" "}
                  <code className="bg-foreground/5 px-2 py-1 rounded">
                    EW987654321
                  </code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
