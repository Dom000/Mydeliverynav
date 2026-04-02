import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserDeliveriesQuery } from "@/apis/users";

function isTrackable(status: string) {
  return ["PENDING", "IN_TRANSIT", "OBSTRUCTED"].includes(status);
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

export default function UserDeliveriesPage() {
  const {
    data: myDeliveries = [],
    isLoading,
    isError,
  } = useUserDeliveriesQuery();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My Deliveries
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Track your deliveries and their current statuses.
        </p>
      </div>

      {isLoading && (
        <p className="text-slate-400 text-sm">Loading deliveries...</p>
      )}
      {isError && (
        <p className="text-red-400 text-sm">Failed to load deliveries.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myDeliveries.map((delivery) => (
          <Card key={delivery.id} className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">
                {delivery.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-400">Origin:</span>{" "}
                {delivery.route?.origin ?? "--"}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Destination:</span>{" "}
                {delivery.route?.destination ?? "--"}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Status:</span>{" "}
                <Badge
                  variant="secondary"
                  className={getDeliveryStatusBadgeClass(delivery.status)}
                >
                  {formatStatusLabel(delivery.status)}
                </Badge>
              </p>

              <div className="flex space-x-5">
                {delivery.package?.id && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <Link
                      to={`/user/packages/${encodeURIComponent(delivery.package.id)}`}
                    >
                      View Details
                    </Link>
                  </Button>
                )}
                {delivery.package?.id && isTrackable(delivery.status) && (
                  <Button
                    asChild
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Link
                      to={`/tracking?number=${encodeURIComponent(delivery.package.id)}`}
                    >
                      Track Delivery
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
