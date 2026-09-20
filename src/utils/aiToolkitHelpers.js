import { NUMERIC_FIELDS } from "../constants/aiToolkitData";

export function buildPayload(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      NUMERIC_FIELDS.has(key) ? Number(value) : String(value).trim(),
    ])
  );
}

export function validateToolInput(tool, values, file) {
  if (tool.mode === "upload") {
    if (!file) {
      throw new Error("Please upload an image before running this model.");
    }
    if (tool.id === "recommendation" && (!values.latitude || !values.longitude)) {
      throw new Error("Capture your GPS latitude and longitude before generating a recommendation.");
    }
    return;
  }

  const emptyField = tool.steps
    ?.flat()
    ?.find((field) => `${values?.[field.key] ?? ""}`.trim() === "");

  if (emptyField) {
    throw new Error(`Please fill in ${emptyField.label} before running this model.`);
  }
}