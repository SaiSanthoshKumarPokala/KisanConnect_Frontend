import {
  CalendarIcon,
  EnvelopeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { UseAppContext } from "../context/AppContext";

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-black/30 p-4 shadow-lg shadow-black/20">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold/60">
        <Icon className="size-4 text-gold" />
        <span>{label}</span>
      </div>
      <div className="text-base font-semibold text-white">
        {value || "Not added yet"}
      </div>
    </div>
  );
}

export default function FProfile() {
  const { axios } = UseAppContext();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    phonenumber: "",
    dateofbirth: "",
    pincode: "",
    state: "",
  });

  useEffect(() => {
    async function fetchFData() {
      try {
        const farmer = await axios.get("/api/farmer/data", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (farmer.data.success) {
          const user = farmer.data.user;
          setProfile({
            name: user.name || "",
            email: user.email || "",
            address: user.address || "",
            phonenumber: user.phonenumber || "",
            dateofbirth: user.dateofbirth || "",
            pincode: user.pincode || "",
            state: user.state || "",
          });
        } else {
          window.alert("Unable to load farmer profile.");
        }
      } catch (error) {
        console.log(error.message);
        window.alert("Unable to load farmer profile.");
      }
    }

    fetchFData();
  }, [axios]);

  return (
    <div className="min-h-dvh bg-[url(/background.png)] bg-cover bg-center bg-darkgreen font-montserrat">
      <div className="flex min-h-dvh items-center justify-center bg-darkgreen/75 p-6 backdrop-blur-sm backdrop-brightness-75">
        <div className="w-full max-w-5xl overflow-hidden rounded-[30px] border border-gold/25 bg-black/55 shadow-[0_26px_60px_rgba(0,0,0,0.45)]">
          <div className="border-b border-gold/20 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent px-6 py-8 md:px-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold/65">
                  Farmer Profile
                </p>
                <h1 className="mt-2 text-3xl font-extrabold text-gold md:text-4xl">
                  View Your Details
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
                  This profile is kept in view mode for farmers, so you can quickly
                  check your registered details without editing them here.
                </p>
              </div>

              <div className="rounded-2xl border border-gold/25 bg-gold/10 px-5 py-4 text-sm text-gold/90">
                <div className="font-semibold">Profile Status</div>
                <div className="mt-1 text-white/75">Read-only access</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2 md:gap-5 md:p-10">
            <ProfileField icon={UserIcon} label="Full Name" value={profile.name} />
            <ProfileField icon={EnvelopeIcon} label="Email" value={profile.email} />
            <ProfileField
              icon={PhoneIcon}
              label="Phone Number"
              value={profile.phonenumber}
            />
            <ProfileField
              icon={CalendarIcon}
              label="Date of Birth"
              value={profile.dateofbirth}
            />
            <ProfileField icon={HomeIcon} label="Address" value={profile.address} />
            <ProfileField icon={MapPinIcon} label="Pin Code" value={profile.pincode} />
            <ProfileField icon={MapPinIcon} label="State" value={profile.state} />
          </div>
        </div>
      </div>
    </div>
  );
}
