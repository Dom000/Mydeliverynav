import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ShippingAddress = {
  id: string;
  userId: string;
  label: string;
  address: string;
  default: boolean;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone1: string;
  phone2?: string;
};

export default function UserAccountPage() {
  const email = useMemo(() => localStorage.getItem("userEmail") ?? "", []);
  const [name, setName] = useState("Reader User");
  const [phoneNumber, setPhoneNumber] = useState("+1 555 100 1000");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    id: "demo-address-1",
    userId: "demo-user-1",
    label: "Home",
    address: "123 Reader Street",
    default: true,
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    phone1: "+1 555 100 1000",
    phone2: "",
  });

  const updateAddress = (
    key: keyof ShippingAddress,
    value: string | boolean,
  ) => {
    setShippingAddress((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const payload = {
      name,
      email,
      phoneNumber,
      shippingAddress,
    };

    console.log("User account payload", payload);
    toast.success("Account details saved (demo). Check console for payload.");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Account
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Manage your profile and shipping address details.
        </p>
      </div>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">User Name</Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Email</Label>
              <Input
                value={email}
                readOnly
                className="bg-slate-800 border-slate-700 text-slate-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Phone Number</Label>
            <Input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base sm:text-lg">
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">Label</Label>
              <Input
                value={shippingAddress.label}
                onChange={(event) => updateAddress("label", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Primary Phone (phone1)</Label>
              <Input
                value={shippingAddress.phone1}
                onChange={(event) =>
                  updateAddress("phone1", event.target.value)
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Address</Label>
            <Input
              value={shippingAddress.address}
              onChange={(event) => updateAddress("address", event.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">City</Label>
              <Input
                value={shippingAddress.city}
                onChange={(event) => updateAddress("city", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">State</Label>
              <Input
                value={shippingAddress.state}
                onChange={(event) => updateAddress("state", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">ZIP</Label>
              <Input
                value={shippingAddress.zip}
                onChange={(event) => updateAddress("zip", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Country</Label>
              <Input
                value={shippingAddress.country}
                onChange={(event) =>
                  updateAddress("country", event.target.value)
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">Secondary Phone (phone2)</Label>
              <Input
                value={shippingAddress.phone2 ?? ""}
                onChange={(event) =>
                  updateAddress("phone2", event.target.value)
                }
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300 mt-8 sm:mt-0">
              <input
                type="checkbox"
                checked={shippingAddress.default}
                onChange={(event) =>
                  updateAddress("default", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-600 bg-slate-800"
              />
              Set as default
            </label>
          </div>

          <Button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            Save Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
