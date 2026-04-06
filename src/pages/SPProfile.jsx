import {
  CalendarIcon,
  EnvelopeIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";

function Field({ icon: Icon, label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-sm font-semibold text-gold/85">
        <Icon className="size-4 text-gold" />
        {label}
      </span>
      {children}
    </label>
  );
}

export default function SPProfile() {
  const { navigate, role, axios, isOpen } = UseAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setstate] = useState("");

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
          setName(user.name || "");
          setEmail(user.email || "");
          setAddress(user.address || "");
          setPhonenumber(user.phonenumber || "");
          setDateofbirth(user.dateofbirth || "");
          setPincode(user.pincode || "");
          setstate((user.state || "").toLowerCase());
        } else {
          window.alert("Unable to load service provider details.");
        }
      } catch (error) {
        console.log(error.message);
        window.alert("Unable to load service provider details.");
      }
    }

    fetchSPData();
  }, [axios]);

  const SubmitDetails = async () => {
    try {
      const response = await axios.post(`/api/${role}/submitdetails`, {
        email,
        name,
        dateofbirth,
        phonenumber,
        address,
        pincode,
        state,
      });
      if (response.data.success) {
        window.alert(response.data.message);
        navigate(`/${role}/`);
      } else {
        window.alert("An error occurred in response. Try again.");
      }
    } catch (error) {
      console.log(error.message);
      window.alert("An error occurred in request. Try again.");
    }
  };

  return (
    <>
      <SideNav />
      <div className={`min-h-dvh bg-darkgreen ${isOpen ? "md:ml-52" : "md:ml-16"}`}>
        <div className="mx-2 my-4 overflow-hidden rounded-[28px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          <div className="border-b border-gold/15 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent px-6 py-8 md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold/60">
              Service Provider Profile
            </p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-gold md:text-4xl">
                  Manage Your Details
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
                  Keep your contact and business information updated so farmers can
                  trust the services you publish across rentals, transport, shop,
                  and cold storage.
                </p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-gold/10 px-5 py-4 text-sm text-gold/90">
                <div className="font-semibold">Provider Mode</div>
                <div className="mt-1 text-white/75">Editable profile access</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="mx-auto max-w-4xl rounded-[26px] border border-gold/20 bg-darkgreen/40 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.25)] md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <Field icon={UserIcon} label="Full Name">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="rounded-2xl border border-gold/20 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-gold"
                  />
                </Field>

                <Field icon={CalendarIcon} label="Date of Birth">
                  <input
                    type="date"
                    value={dateofbirth}
                    onChange={(e) => setDateofbirth(e.target.value)}
                    className="rounded-2xl border border-gold/20 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-gold"
                  />
                </Field>

                <Field icon={PhoneIcon} label="Phone Number">
                  <input
                    type="tel"
                    value={phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="rounded-2xl border border-gold/20 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-gold"
                  />
                </Field>

                <Field icon={EnvelopeIcon} label="Email">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="rounded-2xl border border-gold/20 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-gold"
                  />
                </Field>

                <Field icon={HomeIcon} label="Address">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                    className="rounded-2xl border border-gold/20 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-gold"
                  />
                </Field>

                <Field icon={MapPinIcon} label="Pin Code">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter your pin code"
                    className="rounded-2xl border border-gold/20 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-gold"
                  />
                </Field>

                <Field icon={MapPinIcon} label="State">
                  <select
                    value={state}
                    onChange={(e) => setstate(e.target.value)}
                    className="rounded-2xl border border-gold/20 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-gold"
                  >
                    <option value="select">Select</option>
                    <option value="telangana">Telangana</option>
                    <option value="andhra pradesh">Andhra Pradesh</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="kerala">Kerala</option>
                  </select>
                </Field>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={SubmitDetails}
                  className="rounded-2xl bg-[#FFF085] px-6 py-3 text-sm font-extrabold text-black transition hover:brightness-95"
                >
                  Save Provider Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
