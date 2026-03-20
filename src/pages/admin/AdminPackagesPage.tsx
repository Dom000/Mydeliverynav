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
import { Package } from "lucide-react";

const samplePackages = [
  {
    id: "PKG001",
    trackingNumber: "TRK-2024-001",
    weight: "2.5 kg",
    dimensions: "30x20x15 cm",
    contents: "Electronics",
    createdDate: "2024-03-15",
    status: "In Transit",
  },
  {
    id: "PKG002",
    trackingNumber: "TRK-2024-002",
    weight: "1.2 kg",
    dimensions: "25x15x10 cm",
    contents: "Clothing",
    createdDate: "2024-03-14",
    status: "Delivered",
  },
  {
    id: "PKG003",
    trackingNumber: "TRK-2024-003",
    weight: "5.0 kg",
    dimensions: "40x30x25 cm",
    contents: "Books",
    createdDate: "2024-03-16",
    status: "Pending",
  },
  {
    id: "PKG004",
    trackingNumber: "TRK-2024-004",
    weight: "0.8 kg",
    dimensions: "20x15x10 cm",
    contents: "Documents",
    createdDate: "2024-03-16",
    status: "Pending",
  },
];

export default function AdminPackagesPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Packages Management
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          View and manage all packages
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="w-5 h-5" />
              All Packages
            </CardTitle>
            <CardDescription>
              Complete inventory of packages in the system
            </CardDescription>
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
                      Weight
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Dimensions
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Contents
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Created
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samplePackages.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      className="border-slate-700 hover:bg-slate-800/50"
                    >
                      <TableCell className="text-white font-medium text-xs sm:text-sm">
                        {pkg.trackingNumber}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {pkg.weight}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {pkg.dimensions}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {pkg.contents}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {pkg.createdDate}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            pkg.status === "In Transit"
                              ? "bg-blue-500/20 text-blue-400"
                              : pkg.status === "Delivered"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {pkg.status}
                        </span>
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
        <h3 className="text-white font-semibold text-sm px-2">All Packages</h3>
        {samplePackages.map((pkg) => (
          <Card key={pkg.id} className="bg-slate-900 border-slate-700">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs">Tracking #</p>
                  <p className="text-white font-medium text-sm">
                    {pkg.trackingNumber}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    pkg.status === "In Transit"
                      ? "bg-blue-500/20 text-blue-400"
                      : pkg.status === "Delivered"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {pkg.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-400 text-xs">Weight</p>
                  <p className="text-slate-300 text-xs">{pkg.weight}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Dimensions</p>
                  <p className="text-slate-300 text-xs">{pkg.dimensions}</p>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Contents</p>
                <p className="text-slate-300 text-xs">{pkg.contents}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Created</p>
                <p className="text-slate-300 text-xs">{pkg.createdDate}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
