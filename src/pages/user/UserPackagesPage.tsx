import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const myPackages = [
  {
    id: "PKG-001",
    content: "Assorted paperback books",
    weight: "1.2 kg",
    status: "PENDING",
  },
  {
    id: "PKG-002",
    content: "Electronics accessories",
    weight: "2.1 kg",
    status: "IN_TRANSIT",
  },
];

export default function UserPackagesPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myPackages.map((pkg) => (
          <Card key={pkg.id} className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">{pkg.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-400">Content:</span> {pkg.content}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Weight:</span> {pkg.weight}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-400">Status:</span> {pkg.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
