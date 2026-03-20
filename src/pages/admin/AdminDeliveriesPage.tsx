import { useState } from "react";
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

type PackageStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "OBSTRUCTED";

type Delivery = {
  id: string;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  status: PackageStatus;
  date: string;
};

const PACKAGE_STATUSES: PackageStatus[] = [
  "PENDING",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
  "OBSTRUCTED",
];

const initialDeliveries: Delivery[] = [
  {
    id: "DEL001",
    trackingNumber: "TRK-2024-001",
    customer: "John Doe",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    status: "IN_TRANSIT",
    date: "2024-03-15",
  },
  {
    id: "DEL002",
    trackingNumber: "TRK-2024-002",
    customer: "Jane Smith",
    origin: "London, UK",
    destination: "Paris, FR",
    status: "DELIVERED",
    date: "2024-03-14",
  },
  {
    id: "DEL003",
    trackingNumber: "TRK-2024-003",
    customer: "Carlos Rodriguez",
    origin: "Madrid, ES",
    destination: "Barcelona, ES",
    status: "PENDING",
    date: "2024-03-16",
  },
];

function getStatusClass(status: PackageStatus) {
  if (status === "IN_TRANSIT") return "bg-blue-500/20 text-blue-400";
  if (status === "DELIVERED") return "bg-green-500/20 text-green-400";
  if (status === "CANCELLED") return "bg-red-500/20 text-red-400";
  if (status === "OBSTRUCTED") return "bg-orange-500/20 text-orange-400";
  return "bg-yellow-500/20 text-yellow-400";
}

function formatStatus(status: PackageStatus) {
  return status.replaceAll("_", " ");
}

export default function AdminDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<PackageStatus>("PENDING");

  const startEditing = (delivery: Delivery) => {
    setEditingId(delivery.id);
    setDraftStatus(delivery.status);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveStatus = (deliveryId: string) => {
    setDeliveries((previous) =>
      previous.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              status: draftStatus,
            }
          : delivery,
      ),
    );
    setEditingId(null);
  };

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
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
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
                        {editingId === delivery.id ? (
                          <select
                            value={draftStatus}
                            onChange={(event) =>
                              setDraftStatus(event.target.value as PackageStatus)
                            }
                            className="h-8 rounded-md border border-slate-700 bg-slate-800 px-2 text-xs text-white"
                          >
                            {PACKAGE_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {formatStatus(status)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(delivery.status)}`}
                          >
                            {formatStatus(delivery.status)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {delivery.date}
                      </TableCell>
                      <TableCell>
                        {editingId === delivery.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => saveStatus(delivery.id)}
                              className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-2 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditing(delivery)}
                            className="px-2 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
                          >
                            Edit
                          </button>
                        )}
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
        {deliveries.map((delivery) => (
          <Card key={delivery.id} className="bg-slate-900 border-slate-700">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs">Tracking #</p>
                  <p className="text-white font-medium text-sm">
                    {delivery.trackingNumber}
                  </p>
                </div>
                {editingId === delivery.id ? (
                  <select
                    value={draftStatus}
                    onChange={(event) =>
                      setDraftStatus(event.target.value as PackageStatus)
                    }
                    className="h-8 rounded-md border border-slate-700 bg-slate-800 px-2 text-xs text-white"
                  >
                    {PACKAGE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(delivery.status)}`}
                  >
                    {formatStatus(delivery.status)}
                  </span>
                )}
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
              <div className="pt-1">
                {editingId === delivery.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => saveStatus(delivery.id)}
                      className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-2 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(delivery)}
                    className="px-2 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Edit Status
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
