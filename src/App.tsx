import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Components/DashBoard';
import MainLayout from './MainLayout';
import Users from './Components/Users'
import ShopOwners from './Components/ShopOwners';
import ShopsList from './Components/Shops';
import ShopDetialView from './Components/ShopDetialView';
import PremiumShopsList from './Components/PremiumShop';
import ShopOwnerDetail from './Components/ShopOwnerDetailedView';
import Bookings from './Components/Bookings';
import BookingDetails from './Components/BookingDetails';
import ShopBookingsScreen from './Components/ShopBooking';
import ShopServices from './Components/Service';
import Barbers from './Components/Barbers';
import ShopBarbers from './Components/Barbers';
import Login from './Components/AdminLogin';
import Customization from './Components/Customization';
import BroadcastNotification from './Components/BroadcastNotification';

function App() {
  return (
    <Routes>
  {/* Root Login */}
  <Route path="/" element={<Login />} />

  {/* Dashboard Layout */}
  <Route path="/admin" element={<MainLayout />}>

    <Route index element={<Dashboard />} />

    <Route path="users" element={<Users />} />
    <Route path="shop-owners" element={<ShopOwners />} />
    <Route path="shop-owners/:id" element={<ShopOwnerDetail />} />

    <Route path="shops" element={<ShopsList />} />
    <Route path="shops/:id" element={<ShopDetialView />} />
    <Route path="premium-shops" element={<PremiumShopsList />} />
    <Route path="shops-detail/:id" element={<ShopDetialView />} />

    <Route path="bookings" element={<Bookings />} />
    <Route path="bookings/:id" element={<BookingDetails />} />

    <Route path="shop-booking/:shopId" element={<ShopBookingsScreen />} />
    <Route path="shop-service/:shopId" element={<ShopServices />} />
    <Route path="shop-barbers/:shopId" element={<ShopBarbers />} />

    <Route path="barbers" element={<Barbers />} />
    <Route path="customization" element={<Customization />} />
    <Route path="notifications" element={<BroadcastNotification />} />

  </Route>
</Routes>

  );
}

export default App;
