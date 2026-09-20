import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function AuthInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  icon: Icon,
  iconColor = "fill-gold",
  required = true,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === "password";
  const resolvedType = isPasswordField && isPasswordVisible ? "text" : type;

  return (
    <div className="flex w-full flex-col items-start gap-1 p-2">
      <label htmlFor={id} className="font-montserrat text-lg text-white md:text-xl">
        {label}
      </label>
      <div className="flex w-full flex-row items-center justify-between rounded-sm border border-black bg-white p-2">
        <div className="flex w-full flex-row items-center gap-2">
          {Icon && <Icon className={`size-6 shrink-0 ${iconColor}`} aria-hidden="true" />}
          <input
            id={id}
            name={name}
            type={resolvedType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            className="w-full font-montserrat font-normal text-black outline-none placeholder:text-neutral-400"
          />
        </div>
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="ml-2 cursor-pointer text-gold focus:outline-none"
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="size-6 fill-gold" aria-hidden="true" />
            ) : (
              <EyeIcon className="size-6 fill-gold" aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}