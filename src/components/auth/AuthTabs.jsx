import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function AuthTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "signin", label: "Sign In" },
    { id: "signup", label: "Sign Up" },
  ];

  return (
    <div className="mx-auto flex rounded-full border border-black bg-white p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 font-montserrat font-semibold transition-all duration-300 ${
              isActive
                ? "bg-linear-to-r from-gold to-yellow-200 text-black shadow-sm"
                : "text-neutral-700 hover:text-black"
            }`}
          >
            <UserCircleIcon
              className={`size-7 ${isActive ? "fill-black" : "fill-gold"}`}
              aria-hidden="true"
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}