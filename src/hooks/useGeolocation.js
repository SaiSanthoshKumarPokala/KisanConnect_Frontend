import { useState, useCallback } from "react";

export default function useGeolocation() {
  const [gpsLocation, setGpsLocation] = useState({
    latitude: "",
    longitude: "",
    status: "GPS not captured yet.",
    error: "",
  });

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported in this browser.",
        status: "Unable to read GPS.",
      }));
      return;
    }

    setGpsLocation((prev) => ({
      ...prev,
      error: "",
      status: "Capturing current location...",
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          status: "GPS location captured.",
          error: "",
        });
      },
      (error) => {
        setGpsLocation((prev) => ({
          ...prev,
          error: error.message || "Unable to access location.",
          status: "Unable to read GPS.",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  return { gpsLocation, captureLocation };
}