import { useLayoutEffect } from 'react';
import './App.css';
import './index.css';
import { AppProvider, UseAppContext } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import Authentication from './pages/Authentication';
import { Routes, Route, useLocation, Navigate } from 'react-router';
import UserInfo from './pages/UserInfo';
import Services from './pages/Services';
import Shop from './pages/Shop';
import Rentals from './pages/Rentals';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Transport from './pages/Transport';
import Role from './pages/Role';
import TransportService from './pages/TransportService';
import RentalsService from './pages/RentalsService';
import ShopService from './pages/ShopService';
import NotFound from './pages/NotFound';
import Filters from './components/Filters';
import GoUp from './components/GoUp';
import FProfile from './pages/FProfile';
import SPProfile from './pages/SPProfile';
import ContractFarming from './pages/ContractFarming';
import ContractFarmingService from './pages/ContractFarmingService';
import FarmerStorageListing from './pages/FarmerStorageListing';
import ServiceProviderStorageListing from './pages/ServiceProviderStorageListing';
import NotificationPanel from './components/NotificationPanel';
import Cart from './pages/Cart';
import Marketplace from './pages/Marketplace';
import AIToolkit from './pages/AIToolkit';
import Bookings from './pages/Bookings';
import VoiceSupportWidget from './components/VoiceSupportWidget';

const Wrapper = ({ children }) => {
	const location = useLocation();

	useLayoutEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	}, [location.pathname]);

	return children;
};

const AIToolkitRedirect = () => {
	const { role } = UseAppContext();
	const fallbackRole = role || localStorage.getItem('role') || 'farmer';
	return <Navigate to={`/${fallbackRole}/aitoolkit`} replace />;
};

export default function App() {
	return (
		<>
			<Wrapper>
				<LanguageProvider>
					<AppProvider>
						<Routes>
							<Route path='/' element={<Landing />} />
							<Route path='/auth' element={<Authentication />} />
							<Route path='/role' element={<Role />} />
							<Route path='/userinfo' element={<UserInfo />} />
							<Route path='/aitoolkit' element={<AIToolkitRedirect />} />
							<Route path='/services' element={<Services />} />
							<Route path='/filters' element={<Filters />} />
							<Route path='/farmer'>
								<Route index element={<Dashboard />} />
								<Route path='/farmer/shop' element={<Shop />} />
								<Route path='/farmer/marketplace' element={<Marketplace />} />
								<Route path='/farmer/rentals' element={<Rentals />} />
								<Route path='/farmer/transport' element={<Transport />} />
								<Route path='/farmer/coldstorage' element={<FarmerStorageListing />} />
								<Route path='/farmer/cart' element={<Cart />} />
								<Route path='/farmer/bookings' element={<Bookings />} />
								<Route path='/farmer/profile' element={<FProfile />} />
								<Route path='/farmer/contract' element={<ContractFarming />} />
								<Route path='/farmer/aitoolkit' element={<AIToolkit />} />
							</Route>
							<Route path='/serviceprovider'>
								<Route index element={<Dashboard />} />
								<Route path='/serviceprovider/transport' element={<TransportService />} />
								<Route path='/serviceprovider/rentals' element={<RentalsService />} />
								<Route path='/serviceprovider/shop' element={<ShopService />} />
								<Route path='/serviceprovider/marketplace' element={<Marketplace />} />
								<Route path='/serviceprovider/coldstorage' element={<ServiceProviderStorageListing />} />
								<Route path='/serviceprovider/cart' element={<Cart />} />
								<Route path='/serviceprovider/bookings' element={<Bookings />} />
								<Route path='/serviceprovider/profile' element={<SPProfile />} />
								<Route path='/serviceprovider/contract' element={<ContractFarmingService />} />
								<Route path='/serviceprovider/aitoolkit' element={<AIToolkit />} />
							</Route>
							<Route path='*' element={<NotFound />} />
						</Routes>
						<GoUp />
						<NotificationPanel />
						<VoiceSupportWidget />
					</AppProvider>
				</LanguageProvider>
			</Wrapper>
		</>
	);
}
