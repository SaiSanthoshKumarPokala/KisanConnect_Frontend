import { useState } from "react";
import { NavLink, Link } from "react-router";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { UseAppContext } from "../context/AppContext";

export default function NavBar() {
  const { role, navigate, token, logout } = UseAppContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* For medium and large screens */}
      <nav className="hidden md:flex items-center justify-evenly p-4 bg-darkgreen backdrop-blur-xl font-montserrat z-10 border-b border-white/50">
        <div className="logo">
          <Link to="/">
            <img
              src="/Kisan Connect Logo 1.png"
              className="size-18 rounded-full"
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `mx-2 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] hover:text-[#d4af37] hover:underline hover:underline-offset-8 font-bold ${
                isActive ? "p-2 underline underline-offset-8" : "p-2 hover:underline hover:underline-offset-4"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `mx-2 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] hover:text-[#d4af37] hover:underline hover:underline-offset-8 font-bold ${
                isActive ? "p-2 underline underline-offset-8" : "p-2 hover:underline hover:underline-offset-4"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `mx-2 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] hover:text-[#d4af37] hover:underline hover:underline-offset-8 font-bold ${
                isActive ? "p-2 underline underline-offset-8" : "p-2 hover:underline hover:underline-offset-4"
              }`
            }
          >
            Services
          </NavLink>
          <NavLink
            to="/faqs"
            className={({ isActive }) =>
              `mx-2 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] hover:text-[#d4af37] hover:underline hover:underline-offset-8 font-bold ${
                isActive ? "p-2 underline underline-offset-8" : "p-2 hover:underline hover:underline-offset-4"
              }`
            }
          >
            Faqs
          </NavLink>
        </div>
        <div className="auth flex items-center gap-2 font-semibold">
          {token ? (
            <div className="flex flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  navigate(`/${role}`);
                }}
                className="px-5 py-1.5 text-white text-xl rounded-xl border-[#d4af37] border hover:cursor-pointer hover:bg-[#d4af37] hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                }}
                className="px-5 py-1.5 text-white text-xl rounded-xl border-[#d4af37] border hover:cursor-pointer hover:bg-[#d4af37] hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-1.5 text-white text-xl rounded-xl border-[#d4af37] border hover:cursor-pointer hover:bg-[#d4af37] hover:text-darkgreen bg-darkgreen transition-all ease-in duration-100"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* For small screens */}
      <nav className="w-full flex flex-col md:hidden items-center p-4 font-montserrat z-100 bg-darkgreen text-[#d4af37] border-b border-white/30">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="logo">
            <Link to="/">
              <img
                src="/Kisan Connect Logo 1.png"
                className="size-18 rounded-full"
                alt="Logo"
              />
            </Link>
          </div>
          {!open && (
            <div>
              <button
                type="button"
                className="p-2 cursor-pointer active:transition-all active:ease-in active:duration-500"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Bars3Icon className="size-10" aria-label="Menu" />
              </button>
            </div>
          )}
          {open && (
            <button
              type="button"
              className="p-2 cursor-pointer transition-all ease-in duration-500"
              onClick={() => {
                setOpen(false);
              }}
            >
              <XMarkIcon className="size-10" />
            </button>
          )}
        </div>
        {open && (
          <div className="flex flex-col gap-4 items-start justify-center w-full h-full relative py-4 translate-x-0 transition-all duration-300">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] ${
                  isActive ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] ${
                  isActive ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] ${
                  isActive ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4"
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/faqs"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-2 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] ${
                  isActive ? "underline underline-offset-4" : "hover:underline hover:underline-offset-4"
                }`
              }
            >
              Faqs
            </NavLink>
            {token ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(`/${role}`);
                }}
                className="mx-2 underline underline-offset-4 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)] text-left cursor-pointer"
              >
                Dashboard
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mx-2 underline underline-offset-4 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}