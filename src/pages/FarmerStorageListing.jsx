import { useState, useEffect, useCallback } from "react";
import SideNav from "../components/SideNav";
import FarmerStorageContent from "../components/farmer/FarmerStorageContent";
import { UseAppContext } from "../context/AppContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function FarmerStorageListing() {
  useDocumentTitle("Cold Storage Facilities");

  const { isOpen, setIsOpen, axios } = UseAppContext();

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStorages = useCallback(async (signal) => {
    try {
      const { data } = await axios.get("/api/coldstorage/all", { signal });
      if (data.success) {
        setStorages(data.storages || []);
      }
    } catch (error) {
      if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
        setStorages([]);
      }
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStorages(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchStorages]);

  return (
    <div className="min-h-dvh bg-black font-montserrat">
      <SideNav />

      <div
        className={`flex min-h-dvh flex-col transition-[margin] duration-300 ${
          isOpen ? "md:ml-62.5" : "md:ml-20"
        }`}
      >
        <div className="mx-2 my-4 flex flex-1 flex-col overflow-hidden rounded-[26px] border border-gold/30 bg-black shadow-2xl md:mx-6">
          {loading ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <p className="font-montserrat text-lg font-bold text-white">
                Loading cold storages...
              </p>
            </div>
          ) : (
            <FarmerStorageContent
              storages={storages}
              search={search}
              setSearch={setSearch}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onOpenSidebar={() => setIsOpen(!isOpen)}
            />
          )}
        </div>
      </div>
    </div>
  );
}