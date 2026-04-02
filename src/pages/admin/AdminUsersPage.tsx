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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Users, Package, Truck } from "lucide-react";
import { useUsersDashboardQuery } from "@/apis/users";

const chartConfig = {
  users: {
    label: "Total Users",
    color: "#ef4444",
  },
  deliveries: {
    label: "Deliveries",
    color: "#3b82f6",
  },
  packages: {
    label: "Packages",
    color: "#10b981",
  },
};

export default function AdminUsersPage() {
  const { data, isLoading, isError } = useUsersDashboardQuery();

  const users = data?.users ?? [];
  const totalUsers = data?.totalUsers ?? 0;
  const totalDeliveries = data?.totalDeliveries ?? 0;
  const totalPackages = data?.totalPackages ?? 0;

  const statsData = [
    { name: "Users", value: totalUsers, fill: "#ef4444" },
    { name: "Deliveries", value: totalDeliveries, fill: "#3b82f6" },
    { name: "Packages", value: totalPackages, fill: "#10b981" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Users Management
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Manage and view all registered users
        </p>
      </div>

      {/* Stats Section with Chart */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2 space-y-1">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1 sm:gap-2">
                <Users className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Total Users</span>
                <span className="sm:hidden">Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {totalUsers}
              </div>
              <p className="text-xs text-slate-500 mt-1">Active</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2 space-y-1">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1 sm:gap-2">
                <Truck className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Deliveries</span>
                <span className="sm:hidden">Del.</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {totalDeliveries}
              </div>
              <p className="text-xs text-slate-500 mt-1">Month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2 space-y-1">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1 sm:gap-2">
                <Package className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Packages</span>
                <span className="sm:hidden">Pkg.</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {totalPackages}
              </div>
              <p className="text-xs text-slate-500 mt-1">Created</p>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-white">
              Statistics Overview
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Distribution of users, deliveries, and packages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="h-56 sm:h-64 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={statsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            {isLoading && (
              <p className="mt-2 text-xs text-slate-400">Loading stats...</p>
            )}
            {isError && (
              <p className="mt-2 text-xs text-red-400">
                Failed to load live statistics.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden sm:block">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Users List</CardTitle>
            <CardDescription>
              All registered users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <p className="text-slate-300 text-sm">Loading users...</p>
            )}
            {isError && (
              <p className="text-red-400 text-sm">Failed to load users.</p>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Name
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Email
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Phone
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Address
                    </TableHead>
                    <TableHead className="text-slate-400 text-xs sm:text-sm">
                      Country
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-slate-700 hover:bg-slate-800/50"
                    >
                      <TableCell className="text-white font-medium text-xs sm:text-sm">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {user.phone}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm max-w-xs truncate">
                        {user.address}
                      </TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm">
                        {user.country}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && !isError && users.length === 0 && (
                    <TableRow className="border-slate-700">
                      <TableCell className="text-slate-400 text-sm" colSpan={5}>
                        No users available yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Cards - Mobile */}
      <div className="sm:hidden space-y-3">
        <h3 className="text-white font-semibold text-sm px-2">Users List</h3>
        {isLoading && (
          <p className="text-slate-300 text-sm px-2">Loading users...</p>
        )}
        {isError && (
          <p className="text-red-400 text-sm px-2">Failed to load users.</p>
        )}
        {users.map((user) => (
          <Card key={user.id} className="bg-slate-900 border-slate-700">
            <CardContent className="pt-4 space-y-2">
              <div>
                <p className="text-slate-400 text-xs">Name</p>
                <p className="text-white font-medium text-sm">{user.name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Email</p>
                <p className="text-slate-300 text-xs break-all">{user.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Phone</p>
                <p className="text-slate-300 text-xs">{user.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Address</p>
                <p className="text-slate-300 text-xs">{user.address}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Country</p>
                <p className="text-slate-300 text-xs">{user.country}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {!isLoading && !isError && users.length === 0 && (
          <p className="text-slate-400 text-sm px-2">No users available yet.</p>
        )}
      </div>
    </div>
  );
}
