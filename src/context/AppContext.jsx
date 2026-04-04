import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "./Contexts";
import { useNavigate } from "react-router";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");
    const [rentals, setRentals] = useState([]);
    const [isOpen, setIsOpen] = useState(false);



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

    useEffect(() => {
        const role = localStorage.getItem('role');

        const setrole = () => { setRole(role); }
        setrole();
    }, [role])

    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);

        // if (token) {
        //     const role = localStorage.getItem('role');
        //     setRole(role);
        // }
    }, [])

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `${token}`
        }
    }, [token])

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
        axios
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const UseAppContext = () => {
    return useContext(AppContext);
}

