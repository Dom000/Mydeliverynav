import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserPackagesQuery } from "@/apis/users";

const SUPPORT_PHONE_DISPLAY = "+1 (800) 555-0147";
const SUPPORT_PHONE_SMS = "+18005550147";

function formatDate(value?: string) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
}

function formatDuration(seconds?: number) {
  if (!seconds || seconds <= 0) return "--";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return remMinutes ? `${hours}h ${remMinutes}m` : `${hours}h`;
}

function getDeliveryStatusBadgeClass(status?: string) {
  switch ((status ?? "").toUpperCase()) {
    case "DELIVERED":
      return "bg-green-900/50 text-green-300 border-green-700";
    case "IN_TRANSIT":
      return "bg-blue-900/50 text-blue-300 border-blue-700";
    case "OBSTRUCTED":
    case "INTERRUPTED":
      return "bg-amber-900/50 text-amber-300 border-amber-700";
    case "PENDING":
      return "bg-slate-800 text-slate-200 border-slate-700";
    default:
      return "bg-slate-800 text-slate-200 border-slate-700";
  }
}

function formatStatusLabel(status?: string) {
  if (!status) return "--";
  return status.replaceAll("_", " ");
}

export default function UserPackageDetailsPage() {
  const { packageId = "" } = useParams();
  const { data: myPackages = [], isLoading, isError } = useUserPackagesQuery();
  const packages = Array.isArray(myPackages) ? myPackages : [];

  const userPackage = packages.find((item) => item.id === packageId);
  const timelinePoints = userPackage?.delivery?.route?.points ?? [];
  const messageBody = encodeURIComponent(
    `Hi Support, I need help with package ${userPackage?.id ?? packageId}.`,
  );

  if (isLoading) {
    return <p className="text-slate-400 text-sm">Loading package details...</p>;
  }

  if (isError) {
    return (
      <p className="text-red-400 text-sm">Failed to load package details.</p>
    );
  }

  if (!userPackage) {
    return (
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">Package not found.</p>
        <Button
          asChild
          variant="outline"
          className="border-slate-700 text-slate-300"
        >
          <Link to="/user/packages">Back to My Packages</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Package Details
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {userPackage.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            className="border-slate-700 text-slate-300"
          >
            <Link to="/user/packages">Back to Packages</Link>
          </Button>
          {userPackage.delivery?.status && (
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link
                to={`/tracking?number=${encodeURIComponent(userPackage.id)}`}
              >
                Track Package
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Package Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <Badge
              variant="secondary"
              className="bg-slate-800 text-slate-200 border-slate-700"
            >
              {userPackage.status}
            </Badge>
          </div>
          <p className="text-slate-300">
            <span className="text-slate-400">Name:</span> {userPackage.name}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Content:</span>{" "}
            {userPackage.content}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Weight:</span> {userPackage.weight}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Description:</span>{" "}
            {userPackage.description || "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Created:</span>{" "}
            {formatDate(userPackage.createdAt)}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Updated:</span>{" "}
            {formatDate(userPackage.updatedAt)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Package Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userPackage.images?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {userPackage.images.map((imageUrl, index) => (
                <a
                  key={`${imageUrl}-${index}`}
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg overflow-hidden border border-slate-700"
                >
                  <img
                    src={imageUrl}
                    alt={`Package image ${index + 1}`}
                    className="h-44 w-full object-cover bg-slate-950"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              No package images available.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Delivery Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-slate-300">
            <span className="text-slate-400">Delivery ID:</span>{" "}
            {userPackage.delivery?.id ?? "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Delivery Status:</span>{" "}
            <Badge
              variant="secondary"
              className={getDeliveryStatusBadgeClass(
                userPackage.delivery?.status,
              )}
            >
              {formatStatusLabel(userPackage.delivery?.status)}
            </Badge>
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Origin:</span>{" "}
            {userPackage.delivery?.route?.origin ?? "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Destination:</span>{" "}
            {userPackage.delivery?.route?.destination ?? "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Distance:</span>{" "}
            {userPackage.delivery?.route?.distance ?? "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Driver:</span>{" "}
            {userPackage.delivery?.driver?.name ??
              userPackage.delivery?.driver?.email ??
              "--"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Delivery Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timelinePoints.length ? (
            <div className="space-y-3">
              {timelinePoints.map((point, index) => (
                <div
                  key={`${point.label}-${index}`}
                  className="rounded-lg border border-slate-700 p-3"
                >
                  <p className="text-slate-200 text-sm font-medium">
                    {point.label}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Coordinates: {point.coords.lat}, {point.coords.lng}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Estimated to next stop:{" "}
                    {formatDuration(point.durationToNext)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">
              No delivery timeline available yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-slate-300">
            Need help with this package? Message support at{" "}
            {SUPPORT_PHONE_DISPLAY}.
          </p>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            <a href={`sms:${SUPPORT_PHONE_SMS}?body=${messageBody}`}>
              Message Support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
