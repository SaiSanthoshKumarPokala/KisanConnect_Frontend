import { useMemo, useState } from "react";
import {
    UserIcon,
    PhoneIcon,
    MapPinIcon,
    HomeIcon,
    CalendarIcon,
    EnvelopeIcon,
    BuildingStorefrontIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/solid";
import { UseAppContext } from "../context/AppContext";

const states = ["Telangana", "Andhra Pradesh", "Maharashtra", "Karnataka", "Kerala"];

const inputWrapClass = "flex flex-col items-start gap-1.5";
const inputShellClass = "flex w-full items-center gap-2 rounded-[14px] border border-gold/20 bg-white px-4 py-3";
const inputClass = "w-full bg-transparent font-normal text-black outline-none";

function Field({ label, icon, children }) {
    const Icon = icon;
    return (
        <label className={inputWrapClass}>
            <span className="text-base font-bold text-gold">{label}</span>
            <div className={inputShellClass}>
                <Icon className="size-5 shrink-0 fill-gold" />
                {children}
            </div>
        </label>
    );
}

export default function UserInfo() {
    const { navigate, role, axios } = UseAppContext();
    const normalizedRole = role === "serviceprovider" ? "serviceprovider" : "farmer";

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        phonenumber: "",
        dateofbirth: "",
        pincode: "",
        state: "",
        farmName: "",
        farmSize: "",
        primaryCrop: "",
        farmingExperience: "",
        irrigationType: "",
        businessName: "",
        serviceType: "",
        serviceArea: "",
        alternatePhone: "",
        gstNumber: "",
    });

    const roleSpecificFields = useMemo(() => {
        if (normalizedRole === "serviceprovider") {
            return [
                { key: "businessName", label: "Business Name", icon: BuildingStorefrontIcon, type: "text", placeholder: "Enter your business name" },
                { key: "serviceType", label: "Service Type", icon: BriefcaseIcon, type: "text", placeholder: "E.g. Transport, Cold Storage, Rentals" },
                { key: "serviceArea", label: "Service Area", icon: MapPinIcon, type: "text", placeholder: "Cities or districts you cover" },
                { key: "alternatePhone", label: "Alternate Phone", icon: PhoneIcon, type: "tel", placeholder: "Secondary contact number" },
                { key: "gstNumber", label: "GST / Business ID", icon: BuildingStorefrontIcon, type: "text", placeholder: "Optional business registration number" },
            ];
        }

        return [
            { key: "farmName", label: "Farm Name", icon: BuildingStorefrontIcon, type: "text", placeholder: "Enter your farm name" },
            { key: "farmSize", label: "Farm Size", icon: BriefcaseIcon, type: "text", placeholder: "E.g. 8 acres" },
            { key: "primaryCrop", label: "Primary Crop", icon: BuildingStorefrontIcon, type: "text", placeholder: "E.g. Paddy, Cotton" },
            { key: "farmingExperience", label: "Farming Experience", icon: CalendarIcon, type: "text", placeholder: "E.g. 12 years" },
            { key: "irrigationType", label: "Irrigation Type", icon: HomeIcon, type: "text", placeholder: "E.g. Drip, Borewell, Canal" },
        ];
    }, [normalizedRole]);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const submitDetails = async () => {
        try {
            const payload = {
                email: form.email,
                name: form.name,
                dateofbirth: form.dateofbirth,
                phonenumber: form.phonenumber,
                address: form.address,
                pincode: form.pincode,
                state: form.state,
                roleSpecificDetails: roleSpecificFields.reduce((acc, field) => {
                    acc[field.key] = form[field.key];
                    return acc;
                }, {}),
                ...roleSpecificFields.reduce((acc, field) => {
                    acc[field.key] = form[field.key];
                    return acc;
                }, {}),
            };

            const response = await axios.post(`/api/${normalizedRole}/submitdetails`, payload);

            if (response.data.success) {
                localStorage.setItem(`kc-onboarding-${normalizedRole}`, JSON.stringify(payload));
                window.alert(response.data.message);
                navigate(`/${normalizedRole}/`);
            } else {
                window.alert("An error occurred while saving your details. Try again.");
            }
        } catch (error) {
            console.log(error.message);
            window.alert("An error occurred while sending your details. Try again.");
        }
    };

    return (
        <div className="min-h-dvh bg-[url(/background.png)] bg-cover bg-center font-montserrat">
            <div className="flex min-h-dvh items-center justify-center bg-darkgreen/80 px-4 py-8 backdrop-blur-sm">
                <div className="w-full max-w-5xl rounded-[28px] border border-gold/20 bg-black/65 p-6 text-gold shadow-[0_24px_60px_rgba(0,0,0,0.42)] md:p-8">
                    <div className="mb-8 border-b border-gold/20 pb-5">
                        <p className="text-xs font-black uppercase tracking-[0.35em] text-gold/65">
                            {normalizedRole === "serviceprovider" ? "Service Provider Setup" : "Farmer Setup"}
                        </p>
                        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Tell us a little about yourself</h1>
                        <p className="mt-3 max-w-3xl text-sm font-normal leading-7 text-white/75 md:text-base">
                            Add the essential profile details for your selected role. We use this information to personalize your dashboard and prepare your account for the right workflows from the start.
                        </p>
                    </div>

                    <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
                        <div className="rounded-[24px] border border-gold/18 bg-[#050505] p-5 md:p-6">
                            <div className="mb-5">
                                <h2 className="text-xl font-extrabold text-[#FFF085]">Basic Details</h2>
                                <p className="mt-1 text-sm font-normal text-white/55">
                                    These details apply to every Kisan Connect account.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Full Name" icon={UserIcon}>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        placeholder="Enter your full name"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Email" icon={EnvelopeIcon}>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        placeholder="Enter your email"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Phone Number" icon={PhoneIcon}>
                                    <input
                                        type="tel"
                                        value={form.phonenumber}
                                        onChange={(e) => updateField("phonenumber", e.target.value)}
                                        placeholder="Enter your phone number"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="Date of Birth" icon={CalendarIcon}>
                                    <input
                                        type="date"
                                        value={form.dateofbirth}
                                        onChange={(e) => updateField("dateofbirth", e.target.value)}
                                        className={inputClass}
                                    />
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Address" icon={HomeIcon}>
                                        <input
                                            type="text"
                                            value={form.address}
                                            onChange={(e) => updateField("address", e.target.value)}
                                            placeholder="Enter your address"
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>
                                <Field label="Pin Code" icon={MapPinIcon}>
                                    <input
                                        type="text"
                                        value={form.pincode}
                                        onChange={(e) => updateField("pincode", e.target.value)}
                                        placeholder="Enter your pin code"
                                        className={inputClass}
                                    />
                                </Field>
                                <Field label="State" icon={MapPinIcon}>
                                    <select
                                        value={form.state}
                                        onChange={(e) => updateField("state", e.target.value)}
                                        className={`${inputClass} cursor-pointer`}
                                    >
                                        <option value="">Select your state</option>
                                        {states.map((item) => (
                                            <option key={item} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-gold/18 bg-[#050505] p-5 md:p-6">
                            <div className="mb-5">
                                <h2 className="text-xl font-extrabold text-[#FFF085]">
                                    {normalizedRole === "serviceprovider" ? "Service Details" : "Farm Details"}
                                </h2>
                                <p className="mt-1 text-sm font-normal text-white/55">
                                    These details help tailor the experience for your chosen role.
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {roleSpecificFields.map((field) => (
                                    <Field key={field.key} label={field.label} icon={field.icon}>
                                        <input
                                            type={field.type}
                                            value={form[field.key]}
                                            onChange={(e) => updateField(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className={inputClass}
                                        />
                                    </Field>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="button"
                            onClick={submitDetails}
                            className="rounded-xl border border-gold/30 bg-gold px-6 py-3 text-lg font-extrabold text-darkgreen transition-all duration-150 hover:bg-white"
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
