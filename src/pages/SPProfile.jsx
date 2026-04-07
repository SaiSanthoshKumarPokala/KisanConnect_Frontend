import {
  ArrowLeftEndOnRectangleIcon,
  CalendarIcon,
  EnvelopeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";

const previewProfile = {
  name: "Sai Teja",
  email: "saiteja.services@kisanconnect.in",
  address: "Plot 44, Agri Logistics Hub, Kompally",
  phonenumber: "+91 99887 77665",
  dateofbirth: "1999-03-11",
  pincode: "500014",
  state: "telangana",
  businessName: "Teja Agro Services",
  serviceType: "Rentals, Transport, Cold Storage",
  serviceArea: "Hyderabad, Medchal, Warangal, Guntur",
  alternatePhone: "+91 91234 56789",
  bio: "Multi-service rural operations provider helping farmers with machinery, transport support, and storage access across nearby agricultural clusters.",
  profileImage: "/logo.svg",
};

function ProfileStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-[#111d11] via-[#0b120b] to-[#070707] px-4 py-4 shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/55">
        {label}
      </div>
      <div className="mt-2 text-base font-bold text-[#fff7be]">{value || "Not added yet"}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold/15 bg-gradient-to-r from-[#0a160d] via-[#060806] to-[#050505] px-4 py-4 shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
      <div className="rounded-xl border border-gold/15 bg-gradient-to-br from-gold/25 to-gold/10 p-2">
        <Icon className="size-5 text-gold" />
      </div>
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/55">
          {label}
        </div>
        <div className="mt-1 text-sm font-semibold text-white/90">{value || "Not added yet"}</div>
      </div>
    </div>
  );
}

export default function SPProfile() {
  const { axios, isOpen, logout } = UseAppContext();
  const [profile, setProfile] = useState(previewProfile);

  useEffect(() => {
    async function fetchSPData() {
      try {
        const sp = await axios.get("/api/serviceprovider/data", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        if (sp.data.success) {
          const user = sp.data.user;
          setProfile((prev) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            address: user.address || prev.address,
            phonenumber: user.phonenumber || prev.phonenumber,
            dateofbirth: user.dateofbirth || prev.dateofbirth,
            pincode: user.pincode || prev.pincode,
            state: user.state || prev.state,
            businessName: user.businessName || user.company || prev.businessName,
            serviceType: user.serviceType || prev.serviceType,
            serviceArea: user.serviceArea || prev.serviceArea,
            alternatePhone: user.alternatePhone || prev.alternatePhone,
          }));
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchSPData();
  }, [axios]);

  const detailRows = useMemo(
    () => [
      { icon: UserIcon, label: "Business Name", value: profile.businessName },
      { icon: UserIcon, label: "Full Name", value: profile.name },
      { icon: UserIcon, label: "Service Type", value: profile.serviceType },
      { icon: MapPinIcon, label: "Service Area", value: profile.serviceArea },
      { icon: EnvelopeIcon, label: "Email", value: profile.email },
      { icon: PhoneIcon, label: "Phone Number", value: profile.phonenumber },
      { icon: PhoneIcon, label: "Alternate Phone", value: profile.alternatePhone },
      { icon: CalendarIcon, label: "Date of Birth", value: profile.dateofbirth },
      { icon: HomeIcon, label: "Address", value: profile.address },
      { icon: MapPinIcon, label: "Pin Code", value: profile.pincode },
      { icon: MapPinIcon, label: "State", value: profile.state },
    ],
    [profile]
  );

  const providerInitials = (profile.businessName || profile.name || "SP")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <SideNav />
      <div className="min-h-dvh bg-black">
        <div
          className={`flex min-h-dvh flex-col transition-all duration-300 ${
            isOpen ? "md:ml-[250px]" : "md:ml-[80px]"
          }`}
        >
          <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
            <div className="border-b border-gold/15 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_32%),linear-gradient(135deg,#0d1a0f_0%,#070707_58%,#050505_100%)] px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <div className="rounded-[24px] border border-gold/20 bg-gradient-to-b from-[#102415] via-[#09110b] to-[#050505] p-5 shadow-[0_22px_40px_rgba(0,0,0,0.3)]">
                  <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-gold/35 bg-gradient-to-br from-[#f7de72] via-[#d4af37] to-[#7a5f12] shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    <span className="text-4xl font-extrabold tracking-[0.08em] text-black">
                      {providerInitials}
                    </span>
                  </div>
                  <div className="mt-5 text-center">
                    <div className="text-2xl font-extrabold text-gold drop-shadow-[0_0_16px_rgba(212,175,55,0.2)]">{profile.businessName}</div>
                    <div className="mt-2 text-sm font-medium text-[#f5efc3]">{profile.serviceType}</div>
                  </div>
                  <div className="mt-5 rounded-2xl border border-gold/15 bg-[#040704] px-4 py-4 text-sm leading-7 text-white/78">
                    {profile.bio}
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-[#140707] px-4 py-3 text-sm font-bold text-red-400 transition-all duration-150 hover:-translate-y-[1px] hover:border-red-400/55 hover:bg-red-500/12 hover:text-red-300"
                  >
                    <ArrowLeftEndOnRectangleIcon className="size-5" />
                    Logout
                  </button>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <ProfileStat label="Profile Type" value="Service Provider" />
                    <ProfileStat label="Primary Region" value={profile.state} />
                    <ProfileStat label="Status" value="Verified Listing Owner" />
                  </div>

                  <div className="rounded-[24px] border border-gold/20 bg-gradient-to-br from-[#0f1c10] via-[#090909] to-[#050505] p-5 shadow-[0_22px_40px_rgba(0,0,0,0.28)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/55">
                          Business Details
                        </div>
                        <div className="mt-2 text-2xl font-extrabold text-white">
                          Service Overview
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {detailRows.map((row) => (
                        <InfoRow key={row.label} icon={row.icon} label={row.label} value={row.value} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
