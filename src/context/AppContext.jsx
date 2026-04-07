import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "./Contexts";
import { useLocation, useNavigate } from "react-router";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");
    const [rentals, setRentals] = useState([]);
    const [cartsByRole, setCartsByRole] = useState({
        farmer: [],
        serviceprovider: [],
    });
    const [bookingsByRole, setBookingsByRole] = useState({
        farmer: [],
        serviceprovider: [],
    });
    const [isOpen, setIsOpen] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [marketplaceListings, setMarketplaceListings] = useState([
        {
            id: 7001,
            name: "Fresh Tomatoes",
            seller: "Rishi Farms",
            price: 32,
            rating: 4.7,
            category: "Vegetables",
            stock: "450 kg",
            location: "Medchal, Telangana",
            image: "/seeds.webp",
            description: "Freshly harvested tomatoes sorted for mandi supply and direct bulk purchase. This listing is suited for buyers who want clean, market-ready produce that can move quickly into retail, resale, or nearby distribution without needing much additional sorting.",
            availability: "Available",
        },
        {
            id: 7002,
            name: "Premium Turmeric",
            seller: "Lakshmi Agro",
            price: 96,
            rating: 4.8,
            category: "Spices",
            stock: "220 kg",
            location: "Erode, Tamil Nadu",
            image: "/fertilizers.png",
            description: "Cleaned and dried turmeric lots ready for processing and wholesale buyers. It works well for bulk buyers who want dependable handling quality, straightforward pickup planning, and stock that can move directly into the next trade or processing stage.",
            availability: "Available",
        },
        {
            id: 7003,
            name: "Groundnut Crop Lot",
            seller: "Sai Harvest Group",
            price: 71,
            rating: 4.4,
            category: "Crops",
            stock: "1.2 tonnes",
            location: "Anantapur, Andhra Pradesh",
            image: "/shop.avif",
            description: "Bulk groundnut stock from this season suitable for traders and processing units. The quantity and condition make it a practical option when a buyer wants one seasonal listing that supports larger-volume commercial purchase decisions.",
            availability: "Booked",
        },
    ]);
    const [serviceProviderNotifications, setServiceProviderNotifications] = useState([
        {
            id: 1,
            farmerName: "Rajesh Kumar",
            farmerAvatar: "RK",
            module: "Rentals",
            title: "Harvester rental request",
            detail: "Needs Harvester Prime X9 from 14 Apr to 16 Apr for paddy harvesting in Medchal.",
        },
        {
            id: 2,
            farmerName: "Venkat Rao",
            farmerAvatar: "VR",
            module: "Transport",
            title: "Truck booking request",
            detail: "Requested a 12 tonne truck for Hyderabad to Guntur crop movement on 18 Apr.",
        },
        {
            id: 3,
            farmerName: "Sowmya Naik",
            farmerAvatar: "SN",
            module: "Cold Storage",
            title: "Cold storage booking request",
            detail: "Wants 4 days of storage for tomatoes with an estimated load of 2.5 tonnes.",
        },
        {
            id: 4,
            farmerName: "Arjun Patel",
            farmerAvatar: "AP",
            module: "Contract Farming",
            title: "Contract interest message",
            detail: "Applied for your maize contract with 8 acres in Warangal and asked for input support details.",
        },
    ]);
    const [farmerNotifications, setFarmerNotifications] = useState([
        {
            id: 101,
            providerName: "Srinivasa Cold Storage",
            providerAvatar: "SC",
            status: "accepted",
            title: "Cold storage request accepted",
            detail: "Your tomato storage request for 14 Apr to 18 Apr was accepted by Srinivasa Cold Storage.",
        },
        {
            id: 102,
            providerName: "Venkat Logistics",
            providerAvatar: "VL",
            status: "rejected",
            title: "Transport request rejected",
            detail: "Your reefer van request from Hyderabad to Guntur was rejected due to limited availability.",
        },
    ]);

    const routeRole = location.pathname.startsWith("/serviceprovider")
        ? "serviceprovider"
        : location.pathname.startsWith("/farmer")
            ? "farmer"
            : "";
    const effectiveRole = routeRole || role || "farmer";
    const cart = cartsByRole[effectiveRole] || [];
    const bookings = bookingsByRole[effectiveRole] || [];



    const fetchUser = async () => {
        try {

            const user = await axios.get('/api/user/data');
            // console.log(user);

            if (user.data.success) {
                setUser(user.data.user);
                localStorage.setItem('role', user.data.user.role);
                setRole(user.data.user.role);
                navigate(`/${user.data.user.role}/`);

                return user.data.user;
            } else {
                navigate('/auth');
                return null;
            }
        } catch (error) {
            console.log("Fetch error:", error);
            window.alert(error.message);
            return null;
        }
    };

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/farmer/rentals');
            data.success ? setRentals(data.rentals) : alert(data.message);
        } catch (error) {
            window.alert(error.message);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        // localStorage.removeItem('role');
        localStorage.setItem('role',"");
        setRole("");
        setToken(null);
        setUser(null);
        axios.defaults.headers.common['Authorization'] = '';
        alert("Logged out successfully");
        navigate('/auth');
    }

    const handleProviderNotificationAction = (id, action) => {
        const notification = serviceProviderNotifications.find((item) => item.id === id);
        if (!notification) return;

        const nextStatus = action === "accept" ? "accepted" : "rejected";
        const providerName = user?.name || "Service Provider";
        const providerAvatar = providerName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        setFarmerNotifications((prev) => [
            {
                id: Date.now(),
                providerName,
                providerAvatar,
                status: nextStatus,
                title: `${notification.module} request ${nextStatus}`,
                detail: `${providerName} ${nextStatus} ${notification.farmerName}'s ${notification.module.toLowerCase()} request.`,
            },
            ...prev,
        ]);

        if (notification.bookingId) {
            setBookingsByRole((prev) => ({
                ...prev,
                farmer: (prev.farmer || []).map((item) =>
                    item.id === notification.bookingId
                        ? {
                            ...item,
                            status: nextStatus === "accepted" ? "Accepted" : "Rejected",
                            updatedAt: new Date().toISOString(),
                        }
                        : item
                ),
            }));
        }

        setServiceProviderNotifications((prev) => prev.filter((item) => item.id !== id));
    };

    const setCart = (updater) => {
        setCartsByRole((prev) => {
            const currentCart = prev[effectiveRole] || [];
            const nextCart = typeof updater === "function" ? updater(currentCart) : updater;
            return {
                ...prev,
                [effectiveRole]: nextCart,
            };
        });
    };

    const addToCart = (module, item) => {
        setCartsByRole(prev => {
            const currentCart = prev[effectiveRole] || [];
            const isAlreadyInCart = currentCart.some(cartItem => (cartItem.id || cartItem._id) === (item.id || item._id) && cartItem.cartModule === module);
            if (isAlreadyInCart) {
                window.alert(`${item.name || item.vehicleType || 'Item'} is already in your cart.`);
                return prev;
            }
            window.alert(`${item.name || item.vehicleType || 'Item'} added to cart!`);
            return {
                ...prev,
                [effectiveRole]: [...currentCart, { ...item, cartModule: module }],
            };
        });
    };

    const addBooking = (bookingData) => {
        const bookingId = bookingData.id || `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const bookingRecord = {
            id: bookingId,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            status: "Pending",
            image: bookingData.image || "",
            ...bookingData,
        };

        setBookingsByRole((prev) => ({
            ...prev,
            [effectiveRole]: [bookingRecord, ...(prev[effectiveRole] || [])],
        }));

        if (effectiveRole === "farmer" && bookingData.providerName) {
            const farmerName = user?.name || "Farmer";
            const farmerAvatar = farmerName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            setServiceProviderNotifications((prev) => [
                {
                    id: Date.now(),
                    bookingId,
                    farmerName,
                    farmerAvatar,
                    module: bookingData.module || "Service",
                    title: bookingData.notificationTitle || `${bookingData.module || "Service"} request`,
                    detail: bookingData.notificationDetail || bookingData.summary || "A new booking request is waiting for review.",
                },
                ...prev,
            ]);
        }

        return bookingId;
    };

    const addMarketplaceListing = (listing) => {
        setMarketplaceListings((prev) => [{ ...listing, id: Date.now() }, ...prev]);
    };

    const updateMarketplaceListing = (id, listing) => {
        setMarketplaceListings((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...listing, id } : item))
        );
    };

    const deleteMarketplaceListing = (id) => {
        setMarketplaceListings((prev) => prev.filter((item) => item.id !== id));
    };

    useEffect(() => {
        const roleStr = localStorage.getItem('role');
        if (roleStr) setRole(roleStr);
        const tokenStr = localStorage.getItem('token');
        setToken(tokenStr);
    }, []);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `${token}`;
        }
    }, [token]);

    const value = {
        navigate,
        token,
        setToken,
        user,
        setUser,
        role,
        setRole,
        rentals,
        setRentals,
        fetchUser,
        fetchData,
        logout,
        isOpen,
        setIsOpen,
        notificationsOpen,
        setNotificationsOpen,
        serviceProviderNotifications,
        setServiceProviderNotifications,
        farmerNotifications,
        setFarmerNotifications,
        handleProviderNotificationAction,
        cart,
        setCart,
        addToCart,
        bookings,
        bookingsByRole,
        setBookingsByRole,
        addBooking,
        marketplaceListings,
        setMarketplaceListings,
        addMarketplaceListing,
        updateMarketplaceListing,
        deleteMarketplaceListing,
        axios
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const UseAppContext = () => {
    return useContext(AppContext);
}
