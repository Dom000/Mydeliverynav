import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeliveriesQuery, usePackageQuery } from "@/apis/packages";

function formatDate(value?: string) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
}

function formatStatusLabel(status?: string) {
  if (!status) return "--";
  return status.replaceAll("_", " ");
}

function getStatusClass(status?: string) {
  switch ((status ?? "").toUpperCase()) {
    case "DELIVERED":
      return "bg-green-900/50 text-green-300 border-green-700";
    case "IN_TRANSIT":
      return "bg-blue-900/50 text-blue-300 border-blue-700";
    case "OBSTRUCTED":
      return "bg-amber-900/50 text-amber-300 border-amber-700";
    case "CANCELLED":
      return "bg-red-900/50 text-red-300 border-red-700";
    default:
      return "bg-slate-800 text-slate-200 border-slate-700";
  }
}

export default function AdminPackageDetailsPage() {
  const { packageId = "" } = useParams();

  const {
    data: pkg,
    isLoading: packageLoading,
    isError: packageError,
  } = usePackageQuery(packageId, Boolean(packageId));

  const { data: deliveries = [] } = useDeliveriesQuery(Boolean(packageId));

  const linkedDelivery = deliveries.find(
    (item) => item.package?.id === packageId,
  );

  if (packageLoading) {
    return <p className="text-slate-400 text-sm">Loading package details...</p>;
  }

  if (packageError) {
    return (
      <p className="text-red-400 text-sm">Failed to load package details.</p>
    );
  }

  if (!pkg) {
    return (
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">Package not found.</p>
        <Button
          asChild
          variant="outline"
          className="border-slate-700 text-slate-300"
        >
          <Link to="/admin/packages">Back to Packages</Link>
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
          <p className="text-slate-400 mt-2 text-sm sm:text-base">{pkg.id}</p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-slate-700 text-slate-300"
        >
          <Link to="/admin/packages">Back to Packages</Link>
        </Button>
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
            <Badge variant="secondary" className={getStatusClass(pkg.status)}>
              {formatStatusLabel(pkg.status)}
            </Badge>
          </div>
          <p className="text-slate-300">
            <span className="text-slate-400">Name:</span> {pkg.name}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Content:</span> {pkg.content}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Weight:</span> {pkg.weight}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Description:</span>{" "}
            {pkg.description || "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Created:</span>{" "}
            {formatDate(pkg.createdAt)}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Updated:</span>{" "}
            {formatDate(pkg.updatedAt)}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-slate-300">
            <span className="text-slate-400">Delivery ID:</span>{" "}
            {linkedDelivery?.id ?? "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Delivery Status:</span>{" "}
            <Badge
              variant="secondary"
              className={getStatusClass(linkedDelivery?.status)}
            >
              {formatStatusLabel(linkedDelivery?.status)}
            </Badge>
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Customer:</span>{" "}
            {linkedDelivery?.package?.owner?.name ||
              linkedDelivery?.package?.owner?.email ||
              "--"}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-400">Destination:</span>{" "}
            {linkedDelivery?.package?.destination ?? "--"}
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
          {pkg.images?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pkg.images.map((imageUrl, index) => (
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
    </div>
  );
}
