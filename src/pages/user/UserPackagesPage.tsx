import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserPackagesQuery } from "@/apis/users";

function isTrackable(status: string) {
  return ["PENDING", "IN_TRANSIT"].includes(status);
}

export default function UserPackagesPage() {
  const { data: myPackages, isLoading, isError } = useUserPackagesQuery();
  const packages = Array.isArray(myPackages) ? myPackages : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          My Packages
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          View all packages linked to your account.
        </p>
      </div>

      {isLoading && (
        <p className="text-slate-400 text-sm">Loading packages...</p>
      )}
      {isError && (
        <p className="text-red-400 text-sm">Failed to load packages.</p>
      )}

      {!isLoading && !isError && !Array.isArray(myPackages) && myPackages && (
        <p className="text-amber-400 text-sm">
          Package data was received in an unexpected format.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">{pkg.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-400">Content:</span> {pkg.content}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Weight:</span> {pkg.weight} kg
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Status:</span> {pkg.status}
              </p>
              <div className="flex space-x-5">
                {" "}
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Link to={`/user/packages/${encodeURIComponent(pkg.id)}`}>
                    View Details
                  </Link>
                </Button>
                {isTrackable(pkg.status) && (
                  <Button
                    asChild
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Link to={`/tracking?number=${encodeURIComponent(pkg.id)}`}>
                      Track Package
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
