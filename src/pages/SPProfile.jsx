import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ArrowLeftEndOnRectangleIcon,
  CalendarIcon,
  EnvelopeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import SideNav from "../components/SideNav";
import ProfileStat from "../components/spprofile/ProfileStat";
import InfoRow from "../components/spprofile/InfoRow";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

function formatDate(raw) {
  if (!raw) return null;
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

export default function SPProfile() {
  const { axios, isOpen, logout } = UseAppContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const displayName = profile?.businessName || profile?.name || "Service Provider";
  useDocumentTitle(profile ? `${displayName}'s Profile` : "Service Provider Profile");

  const fetchSPData = useCallback(
    async (signal) => {
      try {
        const { data } = await axios.get("/api/serviceprovider/data", { signal });
        if (data.success && data.user) {
          setProfile(data.user);
        }
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [axios]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchSPData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchSPData]);

  const detailRows = useMemo(() => {
    if (!profile) return [];
    return [
      { icon: UserIcon, label: "Business Name", value: profile.businessName },
      { icon: UserIcon, label: "Full Name", value: profile.name },
      { icon: UserIcon, label: "Service Type", value: profile.serviceType },
      { icon: MapPinIcon, label: "Service Area", value: profile.serviceArea },
      { icon: EnvelopeIcon, label: "Email", value: profile.email },
      { icon: PhoneIcon, label: "Phone Number", value: String(profile.phonenumber || "") },
      { icon: PhoneIcon, label: "Alternate Phone", value: profile.alternatePhone },
      { icon: CalendarIcon, label: "Date of Birth", value: formatDate(profile.dateofbirth) },
      { icon: HomeIcon, label: "Address", value: profile.address },
      { icon: MapPinIcon, label: "Pin Code", value: String(profile.pincode || "") },
      { icon: MapPinIcon, label: "State", value: profile.state },
    ];
  }, [profile]);

  const providerInitials = useMemo(() => {
    return displayName
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-black font-montserrat">
        <SideNav />
        <p className="animate-pulse text-lg font-bold text-white">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black font-montserrat">
      <SideNav />

      <div
        className={`flex min-h-dvh flex-col transition-[margin] duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <main className="border-b border-gold/15 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_32%),linear-gradient(135deg,#0d1a0f_0%,#070707_58%,#050505_100%)] px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

              {/* Provider Identity Column */}
              <div className="flex flex-col justify-between rounded-3xl border border-gold/20 bg-linear-to-b from-[#102415] via-[#09110b] to-[#050505] p-5 shadow-[0_22px_40px_rgba(0,0,0,0.3)]">
                <div>
                  <div className="mx-auto flex size-36 items-center justify-center overflow-hidden rounded-full border-4 border-gold/35 bg-linear-to-br from-[#f7de72] via-[#d4af37] to-[#7a5f12] shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                    <span className="text-4xl font-extrabold tracking-[0.08em] text-black">
                      {providerInitials}
                    </span>
                  </div>

                  <div className="mt-5 text-center">
                    <h1 className="text-2xl font-extrabold text-gold drop-shadow-[0_0_16px_rgba(212,175,55,0.2)]">
                      {displayName}
                    </h1>
                    <p className="mt-2 text-sm font-medium text-[#f5efc3]">
                      {profile?.serviceType || "Service Provider"}
                    </p>
                  </div>

                  {profile?.bio && (
                    <p className="mt-5 rounded-2xl border border-gold/15 bg-[#040704] px-4 py-4 text-sm leading-7 text-white/80">
                      {profile.bio}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-[#140707] px-4 py-3 text-sm font-bold text-red-400 transition-all duration-150 hover:-translate-y-0.5 hover:border-red-400/55 hover:bg-red-500/15 hover:text-red-300"
                >
                  <ArrowLeftEndOnRectangleIcon className="size-5" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>

              {/* Service & Operational Details */}
              <div className="flex flex-col gap-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <ProfileStat label="Profile Type" value="Service Provider" />
                  <ProfileStat label="Primary Region" value={profile?.state} />
                  <ProfileStat label="Status" value="Verified Listing Owner" />
                </div>

                <div className="rounded-3xl border border-gold/20 bg-linear-to-br from-[#0f1c10] via-[#090909] to-[#050505] p-5 shadow-[0_22px_40px_rgba(0,0,0,0.28)] md:p-6">
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold/55">
                      Business Details
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold text-white">
                      Service Overview
                    </h2>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {detailRows.map((row) => (
                      <InfoRow
                        key={row.label}
                        icon={row.icon}
                        label={row.label}
                        value={row.value}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}