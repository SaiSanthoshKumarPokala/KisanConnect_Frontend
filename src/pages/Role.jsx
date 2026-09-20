import { useState } from "react";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import RoleOptionCard from "../components/role/RoleOptionCard";
import { ROLE_OPTIONS } from "../constants/roleData";

export default function Role() {
  useDocumentTitle("Select Your Role");

  const { navigate, setRole, axios } = UseAppContext();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRole = (option) => {
    setSelectedRole(option);
    setRole(option.value);
    localStorage.setItem("role", option.value);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      window.alert("Select a role to proceed.");
      return;
    }

    setIsSubmitting(true);
    try {
      try {
        await axios.post("/api/user/role", { role: selectedRole.value });
      } catch (error) {
        // Retain flow usability if backend role endpoint is not provisioned
      }
      navigate("/userinfo");
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || "Failed to proceed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-darkgreen font-montserrat">
      <main className="mx-auto flex min-h-dvh w-11/12 max-w-6xl flex-col items-center justify-around gap-8 py-10 text-gold">
        {/* Header Introduction */}
        <div className="flex max-w-3xl flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-extrabold text-gold md:text-4xl">
            How do you want to use Kisan Connect?
          </h1>
          <p className="text-lg font-normal text-white/80">
            Choose the role you want to start with. You can switch roles later inside the app whenever needed.
          </p>
        </div>

        {/* Role Options */}
        <div
          role="radiogroup"
          aria-label="Account role selection"
          className="flex w-full flex-col items-stretch justify-center gap-5 md:flex-row"
        >
          {ROLE_OPTIONS.map((option) => (
            <RoleOptionCard
              key={option.id}
              option={option}
              isSelected={selectedRole?.value === option.value}
              onSelect={handleSelectRole}
            />
          ))}
        </div>

        {/* Confirmation & Continue */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-gold">
            Selected Role:
            <span className="ml-2 font-extrabold">
              {selectedRole?.label || "None"}
            </span>
          </p>
          <button
            type="button"
            disabled={isSubmitting || !selectedRole}
            onClick={handleSubmit}
            className="cursor-pointer rounded-xl border border-gold/30 bg-gold px-8 py-3 text-lg font-extrabold text-darkgreen transition-all duration-150 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Proceeding..." : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}