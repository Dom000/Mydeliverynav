import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const myDeliveries = [
  {
    id: "DEL-001",
    origin: "Book Depot",
    destination: "Customer Home",
    status: "IN_TRANSIT",
  },
  {
    id: "DEL-002",
    origin: "Warehouse A",
    destination: "City Hub",
    status: "DELIVERED",
  },
];

export default function UserDeliveriesPage() {
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
                {delivery.origin}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Destination:</span>{" "}
                {delivery.destination}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Status:</span>{" "}
                {delivery.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
