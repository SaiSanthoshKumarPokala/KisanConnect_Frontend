import { useState, useLayoutEffect, useEffect } from 'react';
import './App.css';
import './index.css';
import { AppContext, RoleContext, SidenavContext } from './context/Contexts';
import { AppProvider, UseAppContext } from './context/AppContext';
import NavBar from './components/NavBar';
import Authentication from './pages/Authentication';
import { Routes, Route, useLocation } from 'react-router';
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
import ContractFarming2 from './pages/ContractFarming_2';
import ContractFarmingService from './pages/ContractFarmingService';


const Wrapper = ({ children }) => {
	const location = useLocation();

	useLayoutEffect(() => {
		// Scroll to the top of the page when the route changes
		window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
	}, [location.pathname]);

	return children;
};



export default function App() {
	

	return (
		<>
			<Wrapper>
				<AppProvider>
					<Routes>
						<Route path='/' element={<Landing />} />
						<Route path='/auth' element={<Authentication />} />
						<Route path='/role' element={<Role />} />
						<Route path='/userinfo' element={<UserInfo />} />
						<Route path='/services' element={<Services />} />
						<Route path='/filters' element={<Filters />} />
						<Route path='/farmer'>
							<Route index element={<Dashboard />} />
							<Route path='/farmer/shop' element={<Shop />} />
							<Route path='/farmer/rentals' element={<Rentals />} />
							<Route path='/farmer/transport' element={<Transport />} />
							<Route path='/farmer/profile' element={<FProfile />} />
							<Route path='/farmer/contract' element={<ContractFarming />} />
						</Route>
						<Route path='/serviceprovider'>
							<Route index element={<Dashboard />} />
							<Route path='/serviceprovider/transport' element={<TransportService />} />
							<Route path='/serviceprovider/rentals' element={<RentalsService />} />
							<Route path='/serviceprovider/shop' element={<ShopService />} />
							<Route path='/serviceprovider/profile' element={<SPProfile />} />
							<Route path='/serviceprovider/contract' element={<ContractFarmingService/>} />
						</Route>
						<Route path='*' element={<NotFound />} />
					</Routes>
					<GoUp />
				</AppProvider>
			</Wrapper>
		</>
	)
}
