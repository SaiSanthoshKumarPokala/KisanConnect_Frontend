import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "./Contexts";
import { useLocation, useNavigate } from "react-router";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken]   = useState(null);
    const [user, setUser]     = useState(null);
    const [role, setRole]     = useState("");
    const [rentals, setRentals] = useState([]);
    const [cartsByRole, setCartsByRole]     = useState({ farmer: [], serviceprovider: [] });
    const [bookingsByRole, setBookingsByRole] = useState({ farmer: [], serviceprovider: [] });
    const [isOpen, setIsOpen] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // ── Deal / order states ────────────────────────────────────────────────
    const [ongoingDeals, setOngoingDeals]           = useState([]);
    const [transportDeals, setTransportDeals]       = useState([]);
    const [transportRejected, setTransportRejected] = useState([]);
    const [rentalDeals, setRentalDeals]             = useState([]);
    const [rentalRejected, setRentalRejected]       = useState([]);
    const [contractDeals, setContractDeals]         = useState([]);
    const [shopOrders, setShopOrders]               = useState([]);
    const [marketplaceOrders, setMarketplaceOrders] = useState([]);

    const [serviceProviderNotifications, setServiceProviderNotifications] = useState([]);
    const [farmerNotifications, setFarmerNotifications]                   = useState([]);
    const [marketplaceListings, setMarketplaceListings]                   = useState([]);

    const routeRole = location.pathname.startsWith("/serviceprovider")
        ? "serviceprovider"
        : location.pathname.startsWith("/farmer")
            ? "farmer"
            : "";
    const effectiveRole = routeRole || role || "farmer";
    const cart          = cartsByRole[effectiveRole] || [];
    const bookings      = bookingsByRole[effectiveRole] || [];

    // ── Fetch functions ────────────────────────────────────────────────────
    const fetchOngoingDeals = async () => {
        try { const { data } = await axios.get("/api/coldstorage/mydeals"); if (data.success) setOngoingDeals(data.deals); }
        catch (e) { console.log("fetchOngoingDeals:", e.message); }
    };
    const fetchTransportDeals = async () => {
        try { const { data } = await axios.get("/api/transport/mydeals"); if (data.success) setTransportDeals(data.deals); }
        catch (e) { console.log("fetchTransportDeals:", e.message); }
    };
    const fetchTransportRejected = async () => {
        try { const { data } = await axios.get("/api/transport/rejected"); if (data.success) setTransportRejected(data.bookings); }
        catch (e) { console.log("fetchTransportRejected:", e.message); }
    };
    const fetchRentalDeals = async () => {
        try { const { data } = await axios.get("/api/rentals/mydeals"); if (data.success) setRentalDeals(data.deals); }
        catch (e) { console.log("fetchRentalDeals:", e.message); }
    };
    const fetchRentalRejected = async () => {
        try { const { data } = await axios.get("/api/rentals/rejected"); if (data.success) setRentalRejected(data.bookings); }
        catch (e) { console.log("fetchRentalRejected:", e.message); }
    };
    const fetchContractDeals = async () => {
        try { const { data } = await axios.get("/api/contractfarming/mydeals"); if (data.success) setContractDeals(data.deals); }
        catch (e) { console.log("fetchContractDeals:", e.message); }
    };
    const fetchShopOrders = async () => {
        try {
            const ep = effectiveRole === "serviceprovider" ? "/api/shop/myorders" : "/api/shop/mypurchases";
            const { data } = await axios.get(ep);
            if (data.success) setShopOrders(data.orders || []);
        } catch (e) { console.log("fetchShopOrders:", e.message); }
    };
    const fetchMarketplaceOrders = async () => {
        try {
            const ep = effectiveRole === "farmer" ? "/api/marketplace/mysales" : "/api/marketplace/mypurchases";
            const { data } = await axios.get(ep);
            if (data.success) setMarketplaceOrders(data.orders || []);
        } catch (e) { console.log("fetchMarketplaceOrders:", e.message); }
    };

    const refreshNotifications = async () => {
        await Promise.all([
            fetchOngoingDeals(),
            fetchTransportDeals(),
            fetchTransportRejected(),
            fetchRentalDeals(),
            fetchRentalRejected(),
            fetchContractDeals(),
            fetchShopOrders(),
            fetchMarketplaceOrders(),
        ]);
    };

    useEffect(() => {
        if (notificationsOpen && token) refreshNotifications();
    }, [notificationsOpen]);

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/user/data");
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem("role", res.data.user.role);
                setRole(res.data.user.role);
                navigate(`/${res.data.user.role}/`);
                return res.data.user;
            } else { navigate("/auth"); return null; }
        } catch (error) { console.log(error); window.alert(error.message); return null; }
    };

    const fetchData = async () => {
        try { const { data } = await axios.get("/api/farmer/rentals"); data.success ? setRentals(data.rentals) : alert(data.message); }
        catch (error) { window.alert(error.message); }
    };

    const logout = () => {
        localStorage.removeItem("token"); localStorage.setItem("role", "");
        setRole(""); setToken(null); setUser(null);
        setOngoingDeals([]); setTransportDeals([]); setTransportRejected([]);
        setRentalDeals([]); setRentalRejected([]); setContractDeals([]);
        setShopOrders([]); setMarketplaceOrders([]);
        axios.defaults.headers.common["Authorization"] = "";
        alert("Logged out successfully");
        navigate("/auth");
    };

    const handleProviderNotificationAction = (id) => {
        setServiceProviderNotifications((prev) => prev.filter((item) => item.id !== id));
    };

    // ── Cart helpers ───────────────────────────────────────────────────────
    const setCart = (updater) => {
        setCartsByRole((prev) => {
            const currentCart = prev[effectiveRole] || [];
            const nextCart = typeof updater === "function" ? updater(currentCart) : updater;
            return { ...prev, [effectiveRole]: nextCart };
        });
    };

    const addShopItem = (cartModule, item) => {
        setCartsByRole((prev) => {
            const currentCart = prev[effectiveRole] || [];
            const existing = currentCart.find((c) => c._id === item._id && c.cartModule === cartModule);
            if (existing) {
                return { ...prev, [effectiveRole]: currentCart.map((c) => c._id === item._id && c.cartModule === cartModule ? { ...c, quantity: (c.quantity || 1) + 1 } : c) };
            }
            return { ...prev, [effectiveRole]: [...currentCart, { ...item, cartModule, quantity: 1 }] };
        });
    };
    const updateShopQty = (itemId, cartModule, delta) => {
        setCartsByRole((prev) => {
            const currentCart = prev[effectiveRole] || [];
            const updated = currentCart
                .map((c) => c._id === itemId && c.cartModule === cartModule ? { ...c, quantity: Math.max(0, (c.quantity || 1) + delta) } : c)
                .filter((c) => !(c._id === itemId && c.cartModule === cartModule && (c.quantity || 1) <= 0));
            return { ...prev, [effectiveRole]: updated };
        });
    };
    const removeShopItem = (itemId, cartModule) => {
        setCartsByRole((prev) => ({ ...prev, [effectiveRole]: (prev[effectiveRole] || []).filter((c) => !(c._id === itemId && c.cartModule === cartModule)) }));
    };

    const addMarketplaceItem = (cartModule, item) => {
        setCartsByRole((prev) => {
            const currentCart = prev[effectiveRole] || [];
            const existing = currentCart.find((c) => (c._id || c.id) === (item._id || item.id) && c.cartModule === cartModule);
            if (existing) {
                return { ...prev, [effectiveRole]: currentCart.map((c) => (c._id || c.id) === (item._id || item.id) && c.cartModule === cartModule ? { ...c, quantity: (c.quantity || 1) + 1 } : c) };
            }
            return { ...prev, [effectiveRole]: [...currentCart, { ...item, _id: item._id || item.id, cartModule, quantity: 1 }] };
        });
    };
    const updateMarketplaceQty = (itemId, cartModule, delta) => {
        setCartsByRole((prev) => {
            const currentCart = prev[effectiveRole] || [];
            const updated = currentCart
                .map((c) => (c._id || c.id) === itemId && c.cartModule === cartModule ? { ...c, quantity: Math.max(0, (c.quantity || 1) + delta) } : c)
                .filter((c) => !((c._id || c.id) === itemId && c.cartModule === cartModule && (c.quantity || 1) <= 0));
            return { ...prev, [effectiveRole]: updated };
        });
    };
    const removeMarketplaceItem = (itemId, cartModule) => {
        setCartsByRole((prev) => ({ ...prev, [effectiveRole]: (prev[effectiveRole] || []).filter((c) => !((c._id || c.id) === itemId && c.cartModule === cartModule)) }));
    };

    const addToCart = (cartModule, item) => {
        setCartsByRole((prev) => {
            const currentCart = prev[effectiveRole] || [];
            const isAlreadyInCart = currentCart.some((c) => (c.id || c._id) === (item.id || item._id) && c.cartModule === cartModule);
            if (isAlreadyInCart) { window.alert(`${item.name || "Item"} is already in your cart.`); return prev; }
            window.alert(`${item.name || "Item"} added to cart!`);
            return { ...prev, [effectiveRole]: [...currentCart, { ...item, cartModule }] };
        });
    };

    const placeShopOrder = async (items, totalAmount) => {
        try {
            const { data } = await axios.post("/api/shop/order", {
                items: items.map((i) => ({ productId: i._id, name: i.name, brand: i.seller || i.brand || "", price: i.price, quantity: i.quantity || 1, image: i.image || "", owner: i.owner || null })),
                totalAmount,
            });
            if (data.success) setShopOrders((prev) => [data.order, ...prev]);
        } catch (error) {
            console.log("placeShopOrder:", error.message);
            setShopOrders((prev) => [{ _id: `local-${Date.now()}`, items: items.map((i) => ({ ...i, quantity: i.quantity || 1 })), totalAmount, paidAt: new Date().toISOString(), createdAt: new Date().toISOString() }, ...prev]);
        }
    };

    const placeMarketplaceOrder = async (items, totalAmount) => {
        try {
            const { data } = await axios.post("/api/marketplace/order", {
                items: items.map((i) => ({ listingId: i._id || i.id, name: i.name, category: i.category || "", price: i.price, quantity: i.quantity || 1, image: i.image || "", owner: i.owner || null })),
                totalAmount,
            });
            if (data.success) setMarketplaceOrders((prev) => [data.order, ...prev]);
        } catch (error) {
            console.log("placeMarketplaceOrder:", error.message);
            setMarketplaceOrders((prev) => [{ _id: `local-${Date.now()}`, items: items.map((i) => ({ ...i, quantity: i.quantity || 1 })), totalAmount, paidAt: new Date().toISOString(), createdAt: new Date().toISOString() }, ...prev]);
        }
    };

    // ── Pay for a cold storage / transport / rental booking ────────────────
    // Called from NotificationPanel after simulated card payment succeeds
    // module: "coldstorage" | "transport" | "rentals"
    const payDeal = async (module, bookingId, totalAmount) => {
        const endpoints = {
            coldstorage: "/api/coldstorage/pay",
            transport:   "/api/transport/pay",
            rentals:     "/api/rentals/pay",
        };
        const ep = endpoints[module];
        if (!ep) throw new Error("Unknown module: " + module);

        const { data } = await axios.post(ep, { bookingId, totalAmount });
        if (!data.success) throw new Error(data.message);

        // Update the local deal state so NotificationPanel re-renders immediately
        if (module === "coldstorage") {
            setOngoingDeals((prev) =>
                prev.map((d) => d._id === bookingId ? { ...d, paymentStatus: "paid", paidAt: new Date().toISOString(), totalAmount } : d)
            );
        } else if (module === "transport") {
            setTransportDeals((prev) =>
                prev.map((d) => d._id === bookingId ? { ...d, paymentStatus: "paid", paidAt: new Date().toISOString(), totalAmount } : d)
            );
        } else if (module === "rentals") {
            setRentalDeals((prev) =>
                prev.map((d) => d._id === bookingId ? { ...d, paymentStatus: "paid", paidAt: new Date().toISOString(), totalAmount } : d)
            );
        }

        return data;
    };

    const addBooking = (bookingData) => {
        const bookingId = bookingData.id || `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const bookingRecord = { id: bookingId, createdAt: new Date().toISOString(), updatedAt: null, status: "Pending", image: bookingData.image || "", ...bookingData };
        setBookingsByRole((prev) => ({ ...prev, [effectiveRole]: [bookingRecord, ...(prev[effectiveRole] || [])] }));
        return bookingId;
    };

    const addMarketplaceListing    = (l) => setMarketplaceListings((prev) => [{ ...l, id: Date.now() }, ...prev]);
    const updateMarketplaceListing = (id, l) => setMarketplaceListings((prev) => prev.map((item) => (item.id === id ? { ...item, ...l, id } : item)));
    const deleteMarketplaceListing = (id) => setMarketplaceListings((prev) => prev.filter((item) => item.id !== id));

    useEffect(() => {
        const roleStr  = localStorage.getItem("role"); if (roleStr) setRole(roleStr);
        const tokenStr = localStorage.getItem("token"); setToken(tokenStr);
    }, []);

    useEffect(() => {
        if (token) { axios.defaults.headers.common["Authorization"] = `${token}`; refreshNotifications(); }
    }, [token]);

    const value = {
        navigate, token, setToken, user, setUser, role, setRole,
        rentals, setRentals, fetchUser, fetchData, logout,
        isOpen, setIsOpen, notificationsOpen, setNotificationsOpen,
        serviceProviderNotifications, setServiceProviderNotifications,
        farmerNotifications, setFarmerNotifications,
        handleProviderNotificationAction,
        // Deals
        ongoingDeals, setOngoingDeals, fetchOngoingDeals,
        transportDeals, setTransportDeals, fetchTransportDeals,
        transportRejected, setTransportRejected, fetchTransportRejected,
        rentalDeals, setRentalDeals, fetchRentalDeals,
        rentalRejected, setRentalRejected, fetchRentalRejected,
        contractDeals, setContractDeals, fetchContractDeals,
        shopOrders, setShopOrders, fetchShopOrders,
        marketplaceOrders, setMarketplaceOrders, fetchMarketplaceOrders,
        refreshNotifications,
        // Cart
        cart, setCart, addToCart,
        addShopItem, updateShopQty, removeShopItem, placeShopOrder,
        addMarketplaceItem, updateMarketplaceQty, removeMarketplaceItem, placeMarketplaceOrder,
        // Deal payment
        payDeal,
        bookings, bookingsByRole, setBookingsByRole, addBooking,
        // Marketplace listings (local)
        marketplaceListings, setMarketplaceListings,
        addMarketplaceListing, updateMarketplaceListing, deleteMarketplaceListing,
        axios,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const UseAppContext = () => useContext(AppContext);
