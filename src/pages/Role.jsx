import { useState } from "react";
import { UseAppContext } from "../context/AppContext";

const ROLE_OPTIONS = [
    {
        id: 1,
        label: "Farmer",
        value: "farmer",
        desc: "Use Kisan Connect to access rentals, transport, storage, contract farming, and marketplace support.",
        image: "/farmericon.png",
    },
    {
        id: 2,
        label: "Service Provider",
        value: "serviceprovider",
        desc: "Use Kisan Connect to manage services, listings, requests, and the support tools built for providers.",
        image: "/serviceprovider.png",
    },
];

export default function Role() {
    const { navigate, setRole, axios } = UseAppContext();
    const [active, setActive] = useState("");
    const [selectedRoleLabel, setSelectedRoleLabel] = useState("");

    const submit = async () => {
        try {
            if (!active) {
                window.alert("Select a role to proceed.");
                return;
            }

            setRole(active);
            localStorage.setItem("role", active);

            try {
                await axios.post("/api/user/role", { role: active });
            } catch (error) {
                // Keep the frontend flow usable even when backend role persistence is not ready.
            }

            navigate("/userinfo");
        } catch (error) {
            window.alert(error.message);
        }
    };

    return (
        <div className="min-h-dvh bg-darkgreen font-montserrat">
            <div className="mx-auto flex min-h-dvh w-11/12 max-w-6xl flex-col items-center justify-around gap-8 py-10 text-gold">
                <div className="flex max-w-3xl flex-col items-center gap-3 text-center">
                    <h1 className="text-3xl font-extrabold md:text-4xl">How do you want to use Kisan Connect?</h1>
                    <p className="text-lg font-normal text-white/80">
                        Choose the role you want to start with. You can switch roles later inside the app whenever needed.
                    </p>
                </div>

                <div className="flex w-full flex-col items-stretch justify-center gap-5 md:flex-row">
                    {ROLE_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            className={`flex w-full cursor-pointer flex-col items-center justify-between rounded-3xl border p-6 text-center transition-all duration-200 md:min-h-90 md:w-90 ${
                                active === option.value
                                    ? "border-gold bg-black shadow-[0_16px_38px_rgba(212,175,55,0.18)]"
                                    : "border-white/20 bg-black/45 hover:border-gold/40 hover:bg-black/55"
                            }`}
                            onClick={() => {
                                setActive(option.value);
                                setSelectedRoleLabel(option.label);
                                setRole(option.value);
                                localStorage.setItem("role", option.value);
                            }}
                        >
                            <img src={option.image} alt={option.label} className="h-36 w-auto object-contain" />
                            <div className="mt-6 flex flex-col items-center gap-3">
                                <h2 className="text-2xl font-extrabold text-gold">{option.label}</h2>
                                <p className="text-sm font-normal leading-7 text-white/75">{option.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-lg text-gold">
                        Selected Role:
                        <span className="ml-2 font-extrabold">{selectedRoleLabel || "None"}</span>
                    </p>
                    <button
                        type="button"
                        onClick={submit}
                        className="rounded-xl border border-gold/30 bg-gold px-6 py-3 text-lg font-extrabold text-darkgreen transition-all duration-150 hover:bg-white"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
