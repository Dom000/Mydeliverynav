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
import { usePackagesQuery, type PackageStatus } from "@/apis/packages";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

function formatStatus(status: PackageStatus) {
  return status.replaceAll("_", " ");
}

function getStatusClass(status: PackageStatus) {
  if (status === "IN_TRANSIT") return "bg-blue-500/20 text-blue-400";
  if (status === "DELIVERED") return "bg-green-500/20 text-green-400";
  if (status === "CANCELLED") return "bg-red-500/20 text-red-400";
  if (status === "OBSTRUCTED") return "bg-orange-500/20 text-orange-400";
  return "bg-yellow-500/20 text-yellow-400";
}

function formatDate(value?: string) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString();
}

export default function AdminPackagesPage() {
  const { data: packages = [], isLoading, isError } = usePackagesQuery();

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
            {isLoading && (
              <p className="text-slate-300 text-sm">Loading packages...</p>
            )}
            {isError && (
              <p className="text-red-400 text-sm">Failed to load packages.</p>
            )}
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
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow
                      key={pkg.id}
                      className="border-slate-700 hover:bg-slate-800/50"
                    >
                      <TableCell className="text-white font-medium text-xs sm:text-sm">
                        {pkg.id}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {pkg.weight} kg
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        --
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {pkg.content}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {formatDate(pkg.createdAt)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(pkg.status)}`}
                        >
                          {formatStatus(pkg.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/packages/${encodeURIComponent(pkg.id)}`}
                          className="inline-flex px-2 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && !isError && packages.length === 0 && (
                    <TableRow className="border-slate-700">
                      <TableCell
                        colSpan={7}
                        className="text-slate-400 text-sm text-center py-6"
                      >
                        No packages yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        <h3 className="text-white font-semibold text-sm px-2">All Packages</h3>
        {isLoading && (
          <p className="text-slate-300 text-sm px-2">Loading packages...</p>
        )}
        {isError && (
          <p className="text-red-400 text-sm px-2">Failed to load packages.</p>
        )}
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-slate-900 border-slate-700">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs">Tracking #</p>
                  <p className="text-white font-medium text-sm">{pkg.id}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(pkg.status)}`}
                >
                  {formatStatus(pkg.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-slate-400 text-xs">Weight</p>
                  <p className="text-slate-300 text-xs">{pkg.weight} kg</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Dimensions</p>
                  <p className="text-slate-300 text-xs">--</p>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Contents</p>
                <p className="text-slate-300 text-xs">{pkg.content}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Created</p>
                <p className="text-slate-300 text-xs">
                  {formatDate(pkg.createdAt)}
                </p>
              </div>
              <div className="pt-1 space-y-1">
                <p className="text-slate-400 text-xs">Actions</p>
                <Link
                  to={`/admin/packages/${encodeURIComponent(pkg.id)}`}
                  className="inline-flex w-full justify-center px-3 py-2 text-xs rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && !isError && packages.length === 0 && (
          <p className="text-slate-400 text-sm px-2">No packages yet.</p>
        )}
      </div>
    </div>
  );
}
