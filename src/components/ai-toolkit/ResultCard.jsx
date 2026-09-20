import { PROXY_SOIL_MAP } from "../../constants/aiToolkitData";

export default function ResultCard({ result, isSubmitting, error, mode }) {
  const recommendationProxy =
    mode === "recommendation"
      ? result?.proxyMap || PROXY_SOIL_MAP[result?.soilType] || null
      : null;

  return (
    <div className="rounded-[18px] border border-white/10 bg-[#050505]/95 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-gold/25 bg-black px-3 py-1 font-montserrat text-xs font-bold uppercase tracking-[0.24em] text-gold/85">
          Model response
        </span>
        {isSubmitting && (
          <span className="font-montserrat text-sm text-white/55">Running inference...</span>
        )}
      </div>

      {error && (
        <p className="mt-3 font-montserrat text-sm leading-6 text-red-400">{error}</p>
      )}

      {!error && !result && !isSubmitting && (
        <p className="mt-3 font-montserrat text-sm leading-6 text-white/55">
          Submit the current tool to see the prediction here.
        </p>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
              Primary result
            </p>
            <p className="mt-2 font-montserrat text-2xl font-black capitalize text-amber-200 md:text-3xl">
              {typeof result.prediction === "number"
                ? `${result.prediction} ${result.unit || ""}`.trim()
                : result.prediction}
            </p>
            {result.confidence !== null && result.confidence !== undefined && (
              <p className="mt-1 font-montserrat text-sm text-white/60">
                Confidence: {result.confidence}%
              </p>
            )}
            {result.message && (
              <p className="mt-2 font-montserrat text-sm leading-6 text-white/70">{result.message}</p>
            )}
          </div>

          {mode === "recommendation" && result.soilType && (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-montserrat text-sm uppercase tracking-[0.2em] text-white/45">
                  Soil classifier
                </p>
                <p className="mt-2 font-montserrat text-lg font-bold text-white">{result.soilType}</p>
                <p className="mt-1 font-montserrat text-sm text-gold/85">
                  Confidence: {result.soilConfidence}%
                </p>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-montserrat text-sm uppercase tracking-[0.2em] text-white/45">
                  GPS location
                </p>
                <p className="mt-2 font-montserrat text-sm text-white/75">
                  Lat: {result.weather?.latitude}
                </p>
                <p className="mt-1 font-montserrat text-sm text-white/75">
                  Lon: {result.weather?.longitude}
                </p>
                {result.weather?.city && (
                  <p className="mt-1 font-montserrat text-sm text-gold/85">{result.weather.city}</p>
                )}
              </div>
              <div className="rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-montserrat text-sm uppercase tracking-[0.2em] text-white/45">
                  OpenWeather
                </p>
                <p className="mt-2 font-montserrat text-sm text-white/75">
                  Temp: {result.weather?.temperature} deg C
                </p>
                <p className="mt-1 font-montserrat text-sm text-white/75">
                  Humidity: {result.weather?.humidity}%
                </p>
                <p className="mt-1 font-montserrat text-sm text-white/75">
                  Rainfall: {result.weather?.rainfall} mm
                </p>
                {result.weather?.description && (
                  <p className="mt-1 font-montserrat text-sm capitalize text-gold/85">
                    {result.weather.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {mode === "recommendation" && recommendationProxy && (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                Proxy soil map
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  ["N", recommendationProxy.n],
                  ["P", recommendationProxy.p],
                  ["K", recommendationProxy.k],
                  ["pH", recommendationProxy.ph],
                ].map(([label, value]) => (
                  <div
                    key={`${mode}-${label}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-sm text-white/50">{label}</p>
                    <p className="mt-1 font-montserrat text-base font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === "recommendation" && result.inferredFeatures && (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                Model inputs
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                {[
                  ["N", result.inferredFeatures.nitrogen],
                  ["P", result.inferredFeatures.phosphorus],
                  ["K", result.inferredFeatures.potassium],
                  ["pH", result.inferredFeatures.ph],
                ].map(([label, value]) => (
                  <div
                    key={`${mode}-feature-${label}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-sm text-white/50">{label}</p>
                    <p className="mt-1 font-montserrat text-base font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {[
                  ["Temperature", result.inferredFeatures.temperature],
                  ["Humidity", result.inferredFeatures.humidity],
                  ["Rainfall", result.inferredFeatures.rainfall],
                ].map(([label, value]) => (
                  <div
                    key={`${mode}-weather-feature-${label}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-sm text-white/50">{label}</p>
                    <p className="mt-1 font-montserrat text-base font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === "recommendation" && Array.isArray(result.featureArray) && (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                7-feature array
              </p>
              <div className="mt-3 rounded-[14px] border border-white/10 bg-black px-4 py-3">
                <p className="font-mono text-sm text-gold/90">[{result.featureArray.join(", ")}]</p>
              </div>
            </div>
          )}

          {Array.isArray(result.topMatches) && result.topMatches.length > 0 && (
            <div>
              <p className="font-montserrat text-sm uppercase tracking-[0.24em] text-white/45">
                Top matches
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {result.topMatches.map((match) => (
                  <div
                    key={`${mode}-${match.classId}`}
                    className="rounded-[14px] border border-white/10 bg-black px-4 py-3"
                  >
                    <p className="font-montserrat text-base font-bold capitalize text-white">
                      {match.label}
                    </p>
                    <p className="mt-1 font-montserrat text-sm text-gold/85">{match.confidence}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}