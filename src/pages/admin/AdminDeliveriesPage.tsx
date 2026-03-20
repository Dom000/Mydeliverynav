import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck } from "lucide-react";

const sampleDeliveries = [
  {
    id: "DEL001",
    trackingNumber: "TRK-2024-001",
    customer: "John Doe",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    status: "In Transit",
    date: "2024-03-15",
  },
  {
    id: "DEL002",
    trackingNumber: "TRK-2024-002",
    customer: "Jane Smith",
    origin: "London, UK",
    destination: "Paris, FR",
    status: "Delivered",
    date: "2024-03-14",
  },
  {
    id: "DEL003",
    trackingNumber: "TRK-2024-003",
    customer: "Carlos Rodriguez",
    origin: "Madrid, ES",
    destination: "Barcelona, ES",
    status: "Pending",
    date: "2024-03-16",
  },
];

export default function AdminDeliveriesPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Deliveries Management
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Track and manage all shipments
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Active Deliveries
            </CardTitle>
            <CardDescription>All current and past deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Tracking #
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Customer
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Origin
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Destination
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleDeliveries.map((delivery) => (
                    <TableRow
                      key={delivery.id}
                      className="border-slate-700 hover:bg-slate-800/50"
                    >
                      <TableCell className="text-white font-medium text-xs sm:text-sm">
                        {delivery.trackingNumber}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {delivery.customer}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {delivery.origin}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {delivery.destination}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            delivery.status === "In Transit"
                              ? "bg-blue-500/20 text-blue-400"
                              : delivery.status === "Delivered"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {delivery.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        <h3 className="text-white font-semibold text-sm px-2">
          Active Deliveries
        </h3>
        {sampleDeliveries.map((delivery) => (
          <Card key={delivery.id} className="bg-slate-900 border-slate-700">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs">Tracking #</p>
                  <p className="text-white font-medium text-sm">
                    {delivery.trackingNumber}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    delivery.status === "In Transit"
                      ? "bg-blue-500/20 text-blue-400"
                      : delivery.status === "Delivered"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {delivery.status}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Customer</p>
                <p className="text-slate-300 text-xs">{delivery.customer}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-400 text-xs">Origin</p>
                  <p className="text-slate-300 text-xs">{delivery.origin}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Destination</p>
                  <p className="text-slate-300 text-xs">
                    {delivery.destination}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Date</p>
                <p className="text-slate-300 text-xs">{delivery.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
