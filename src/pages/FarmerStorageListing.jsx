import { useState, useEffect } from "react";
import SideNav from "../components/SideNav";
import { UseAppContext } from "../context/AppContext";
import FarmerStorageContent from "../components/FarmerStorageContent";

export default function FarmerStorageListing() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, setIsOpen, axios } = UseAppContext();

  // ── Fetch all active cold storages from backend ───────────────────────────
  const fetchStorages = async () => {
    try {
      const { data } = await axios.get("/api/coldstorage/all");
      if (data.success) {
        setStorages(data.storages);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStorages(); }, []);

  return (
    <div className="bg-black min-h-dvh">
      <SideNav />
      <div className={`flex flex-col min-h-dvh transition-all duration-300 ${isOpen ? "md:ml-[250px]" : "md:ml-[80px]"}`}>
        <div className="flex flex-col mx-2 md:mx-6 my-4 border border-gold/30 rounded-2xl shadow-2xl bg-black font-montserrat flex-1 overflow-hidden">
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-white font-montserrat font-bold text-lg">Loading cold storages...</p>
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
