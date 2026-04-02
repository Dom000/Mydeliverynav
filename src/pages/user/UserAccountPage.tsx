import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useUserProfileQuery,
  useUserShippingAddressesQuery,
  useSaveUserAccountMutation,
} from "@/apis/users";

type ShippingAddressForm = {
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
  const { data: profile, isLoading: isProfileLoading } =
    useUserProfileQuery(true);
  const { data: shippingAddressesData, isLoading: isAddressesLoading } =
    useUserShippingAddressesQuery(true);
  const saveUserAccountMutation = useSaveUserAccountMutation();

  const shippingAddresses = useMemo(
    () => (Array.isArray(shippingAddressesData) ? shippingAddressesData : []),
    [shippingAddressesData],
  );

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressForm>({
    id: "",
    userId: "",
    label: "",
    address: "",
    default: false,
    city: "",
    state: "",
    zip: "",
    country: "",
    phone1: "",
    phone2: "",
  });

  useEffect(() => {
    if (!profile) return;

    const fallbackEmail = profile.email || email || "user@example.com";
    setName(profile.name || fallbackEmail.split("@")[0]);
    const primaryAddress =
      shippingAddresses.find((address) => address.default) ??
      shippingAddresses[0];

    if (primaryAddress) {
      setShippingAddress({
        id: primaryAddress.id,
        userId: primaryAddress.userId,
        label: primaryAddress.label,
        address: primaryAddress.address,
        default: primaryAddress.default,
        city: primaryAddress.city,
        state: primaryAddress.state,
        zip: primaryAddress.zip,
        country: primaryAddress.country,
        phone1: primaryAddress.phone1,
        phone2: primaryAddress.phone2 ?? "",
      });
      setPhoneNumber(primaryAddress.phone1 || "");
    }
  }, [profile, shippingAddresses]);

  const updateAddress = (
    key: keyof ShippingAddressForm,
    value: string | boolean,
  ) => {
    setShippingAddress((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await saveUserAccountMutation.mutateAsync({
        profile: { name },
        shippingAddress: {
          id: shippingAddress.id?.startsWith("demo-")
            ? undefined
            : shippingAddress.id,
          label: shippingAddress.label,
          address: shippingAddress.address,
          default: shippingAddress.default,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zip,
          country: shippingAddress.country,
          phone1: phoneNumber,
          phone2: shippingAddress.phone2 ?? null,
        },
      });

      toast.success("Account details saved.");
    } catch {
      toast.error("Failed to save account details.");
    }
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
          {(isProfileLoading || isAddressesLoading) && (
            <p className="text-slate-400 text-sm">Loading account data...</p>
          )}
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
                value={profile?.email ?? email}
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
                value={shippingAddress.label || ""}
                onChange={(event) => updateAddress("label", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Primary Phone (phone1)</Label>
              <Input
                value={shippingAddress.phone1 || ""}
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
              value={shippingAddress.address || ""}
              onChange={(event) => updateAddress("address", event.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">City</Label>
              <Input
                value={shippingAddress.city || ""}
                onChange={(event) => updateAddress("city", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">State</Label>
              <Input
                value={shippingAddress.state || ""}
                onChange={(event) => updateAddress("state", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">ZIP</Label>
              <Input
                value={shippingAddress.zip || ""}
                onChange={(event) => updateAddress("zip", event.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Country</Label>
              <Input
                value={shippingAddress.country || ""}
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
            disabled={saveUserAccountMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            {saveUserAccountMutation.isPending ? "Saving..." : "Save Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
