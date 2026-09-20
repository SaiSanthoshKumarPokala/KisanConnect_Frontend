import { useMemo, useState } from "react";
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  CalendarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import InputField from "../components/user-info/InputField";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import {
  REGISTRATION_STATES,
  INITIAL_USER_INFO_FORM,
  SERVICE_PROVIDER_FIELDS,
  FARMER_FIELDS,
} from "../constants/userInfoData";

const inputClass =
  "w-full bg-transparent font-normal text-black outline-none placeholder:text-neutral-500";

export default function UserInfo() {
  useDocumentTitle("Profile Setup");

  const { navigate, role, axios } = UseAppContext();
  const normalizedRole = role === "serviceprovider" ? "serviceprovider" : "farmer";

  const [form, setForm] = useState(INITIAL_USER_INFO_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleSpecificFields = useMemo(() => {
    return normalizedRole === "serviceprovider"
      ? SERVICE_PROVIDER_FIELDS
      : FARMER_FIELDS;
  }, [normalizedRole]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitDetails = async () => {
    if (!form.name || !form.email || !form.phonenumber) {
      window.alert("Please complete the required contact details (Name, Email, Phone).");
      return;
    }

    setIsSubmitting(true);
    try {
      const roleData = roleSpecificFields.reduce((acc, field) => {
        acc[field.key] = form[field.key];
        return acc;
      }, {});

      const payload = {
        email: form.email,
        name: form.name,
        dateofbirth: form.dateofbirth,
        phonenumber: form.phonenumber,
        address: form.address,
        pincode: form.pincode,
        state: form.state,
        roleSpecificDetails: roleData,
        ...roleData,
      };

      const response = await axios.post(`/api/${normalizedRole}/submitdetails`, payload);

      if (response.data?.success) {
        localStorage.setItem(`kc-onboarding-${normalizedRole}`, JSON.stringify(payload));
        window.alert(response.data.message || "Profile details saved successfully.");
        navigate(`/${normalizedRole}/`);
      } else {
        window.alert(response.data?.message || "An error occurred while saving your details. Try again.");
      }
    } catch (error) {
      window.alert(error.response?.data?.message || "An error occurred while sending your details. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[url(/background.png)] bg-cover bg-center font-montserrat">
      <main className="flex min-h-dvh items-center justify-center bg-darkgreen/80 px-4 py-8 backdrop-blur-sm">
        <div className="w-full max-w-5xl rounded-[28px] border border-gold/20 bg-black/65 p-6 text-gold shadow-[0_24px_60px_rgba(0,0,0,0.42)] md:p-8">
          
          {/* Header */}
          <div className="mb-8 border-b border-gold/20 pb-5">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-gold/65">
              {normalizedRole === "serviceprovider"
                ? "Service Provider Setup"
                : "Farmer Setup"}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold md:text-4xl text-white">
              Tell us a little about yourself
            </h1>
            <p className="mt-3 max-w-3xl text-sm font-normal leading-7 text-white/75 md:text-base">
              Add the essential profile details for your selected role. We use this information to personalize your dashboard and prepare your account for the right workflows from the start.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
            
            {/* General Information */}
            <section className="rounded-3xl border border-gold/20 bg-[#050505] p-5 md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-amber-200">Basic Details</h2>
                <p className="mt-1 text-sm font-normal text-white/55">
                  These details apply to every Kisan Connect account.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InputField label="Full Name *" icon={UserIcon}>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </InputField>

                <InputField label="Email *" icon={EnvelopeIcon}>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </InputField>

                <InputField label="Phone Number *" icon={PhoneIcon}>
                  <input
                    type="tel"
                    required
                    value={form.phonenumber}
                    onChange={(e) => updateField("phonenumber", e.target.value)}
                    placeholder="Enter your phone number"
                    className={inputClass}
                  />
                </InputField>

                <InputField label="Date of Birth" icon={CalendarIcon}>
                  <input
                    type="date"
                    value={form.dateofbirth}
                    onChange={(e) => updateField("dateofbirth", e.target.value)}
                    className={inputClass}
                  />
                </InputField>

                <div className="md:col-span-2">
                  <InputField label="Address" icon={HomeIcon}>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Enter your address"
                      className={inputClass}
                    />
                  </InputField>
                </div>

                <InputField label="Pin Code" icon={MapPinIcon}>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                    placeholder="Enter your pin code"
                    className={inputClass}
                  />
                </InputField>

                <InputField label="State" icon={MapPinIcon}>
                  <select
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">Select your state</option>
                    {REGISTRATION_STATES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </InputField>
              </div>
            </section>

            {/* Role-Specific Details */}
            <section className="rounded-3xl border border-gold/20 bg-[#050505] p-5 md:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-extrabold text-amber-200">
                  {normalizedRole === "serviceprovider" ? "Service Details" : "Farm Details"}
                </h2>
                <p className="mt-1 text-sm font-normal text-white/55">
                  These details help tailor the experience for your chosen role.
                </p>
              </div>

              <div className="grid gap-4">
                {roleSpecificFields.map((field) => (
                  <InputField key={field.key} label={field.label} icon={field.icon}>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </InputField>
                ))}
              </div>
            </section>
          </div>

          {/* Submit Action */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={submitDetails}
              className="cursor-pointer rounded-xl border border-gold/30 bg-gold px-8 py-3 text-lg font-extrabold text-darkgreen transition-all duration-150 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving Details..." : "Continue to Dashboard"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}