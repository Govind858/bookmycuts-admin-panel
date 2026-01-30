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
import ShopDetail from './Components/ShopDetialView';
import Bookings from './Components/Bookings';
import BookingDetails from './Components/BookingDetails';
import ShopBookingsScreen from './Components/ShopBooking';
import ShopServices from './Components/Service';
import ShopBarbers from './Components/Barbers';

function App() {
  return (
    <Routes>
      {/* Parent Route with layout */}
      <Route path="/" element={<MainLayout />}>
        {/* Index route */}
        <Route index element={<Dashboard />} />
        <Route path="/users" element={<Users/>} />
        <Route path="/shop-owners" element={<ShopOwners/>} />
        <Route path="/admin/shop-owners/:id" element={<ShopOwnerDetail/>} />
        <Route path="/shops" element={<ShopsList />} />
        <Route path="/shops/:shopId" element={<ShopDetialView />} />
        <Route path="/premium-shops" element={<PremiumShopsList />} />
        <Route path="/admin/shops/:id" element={<ShopDetail  />} />
        <Route path="/bookings" element={<Bookings/>} />
        <Route path='/bookings/:id' element={<BookingDetails/>} />
        <Route path='/shop-booking/:shopId' element={<ShopBookingsScreen/>} />
        <Route path='/shop-service/:shopId' element={<ShopServices/>} />
        <Route path='/shop-barbers/:shopId' element={<ShopBarbers/>} />
      </Route>
    </Routes>
  );
}

export default App;
