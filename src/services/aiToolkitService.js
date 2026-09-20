import axios from "axios";
import { buildPayload } from "../utils/aiToolkitHelpers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export async function submitToolRequest(tool, values, file) {
  const url = tool.endpoint;

  if (tool.mode === "upload") {
    const formData = new FormData();
    formData.append("file", file);
    if (tool.id === "recommendation") {
      formData.append("latitude", String(values.latitude));
      formData.append("longitude", String(values.longitude));
    }

    const { data } = await apiClient.post(url, formData);
    return data;
  }

  const payload = buildPayload(values);
  const { data } = await apiClient.post(url, payload, {
    headers: { "Content-Type": "application/json" },
  });

  return data;
}