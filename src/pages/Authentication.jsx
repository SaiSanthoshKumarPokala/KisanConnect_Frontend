import { useState } from "react";
import Google from "/google.svg";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import AuthTabs from "../components/auth/AuthTabs";
import AuthInput from "../components/auth/AuthInput";

const INITIAL_FORM_STATE = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAgreed: false,
};

export default function Authentication() {
  const { navigate, setToken, axios, fetchUser } = UseAppContext();
  const [authMode, setAuthMode] = useState("signin");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle(authMode === "signin" ? "Sign In" : "Create Account");

  const handleTabChange = (mode) => {
    setAuthMode(mode);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/user/login", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        axios.defaults.headers.common["Authorization"] = `${data.token}`;
        await fetchUser();
        window.alert("Logged in");
      } else {
        alert(data.message || "Failed to log in.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "An error occurred during sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!formData.termsAgreed) {
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/user/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `${data.token}`;
        navigate("/role");
      } else {
        alert(data.message || "Failed to register account.");
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "An error occurred during sign up.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[url('/background.png')] bg-cover bg-center py-8 font-montserrat font-bold">
      <div className="m-auto flex w-11/12 max-w-xl flex-col items-center justify-center rounded-md border border-white bg-darkgreen/40 p-6 backdrop-blur-sm md:w-10/12 md:p-10">
        <AuthTabs activeTab={authMode} onTabChange={handleTabChange} />

        <form
          onSubmit={authMode === "signin" ? handleSignIn : handleSignUp}
          className="mx-auto mt-6 flex w-full flex-col gap-2"
        >
          {/* Header Title */}
          <div className="flex flex-col items-center p-2 text-center text-white">
            <h1 className="text-3xl md:text-4xl">
              {authMode === "signin" ? "Welcome back!" : "Create your Account"}
            </h1>
            <p className="mt-1 text-lg font-normal text-white/90 md:text-xl">
              {authMode === "signin" ? "You have been missed" : "Let's get started!"}
            </p>
          </div>

          <AuthInput
            id="username"
            name="username"
            label="Username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            icon={UserIcon}
          />

          <AuthInput
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your Email ID"
            autoComplete="email"
            icon={EnvelopeIcon}
            iconColor="fill-activetab"
          />

          <AuthInput
            id={authMode === "signin" ? "current-password" : "new-password"}
            name={authMode === "signin" ? "current-password" : "new-password"}
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder={authMode === "signin" ? "Enter your password" : "Set password"}
            autoComplete={authMode === "signin" ? "current-password" : "new-password"}
            icon={LockClosedIcon}
          />

          {authMode === "signup" && (
            <AuthInput
              id="confirm-password"
              name="confirm-password"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              icon={LockClosedIcon}
            />
          )}

          {/* Terms Agreement Checkbox */}
          <div className="flex flex-row items-center gap-2 p-2">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              checked={formData.termsAgreed}
              onChange={(e) => handleInputChange("termsAgreed", e.target.checked)}
              className="size-5 cursor-pointer accent-gold"
            />
            <label htmlFor="terms" className="cursor-pointer text-sm font-normal text-white md:text-base">
              I agree to the Terms of Service and Privacy policy
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-sm border border-black bg-linear-to-r from-gold to-yellow-200 p-2.5 font-montserrat text-lg font-bold text-black transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : authMode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>

          <p className="my-2 text-center font-bold text-white">OR</p>

          {/* Third Party Auth */}
          <button
            type="button"
            className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-sm border-2 border-white p-2 text-lg transition-all duration-200 hover:scale-[1.02]"
          >
            <img src={Google} alt="" className="size-6" />
            <span className="font-bold text-white">Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}