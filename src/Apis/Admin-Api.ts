import axios from "../Axios/Axios";

export const fetchAllUsers = async (): Promise<any> => {
  try {
    const response = await axios.get("auth/getAllUser");
    console.log("response:", response);
    return response ?? [];
  } catch (error) {
    console.error("error in fetchAllUsers api", error);
    return []; 
  }
};

export const fetchAllShopOwners = async (
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  try {
    const response = await axios.get(`/auth/viewAllShopOwners?page=${page}&limit=${limit}`);
    console.log('Shop owners response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching shop owners:', error);
    throw error;
  }
};

export const fetchAllShops = async (): Promise<any> => {
  try {
    const response = await axios.get('/shop/ViewAllShop');
    console.log("response", response);
    return response;
  } catch (error) {
    console.error("error in fetch shop", error);
    throw error;
  }
};

export const fetchAllPremiumShops = async (): Promise<any> => {
  try {
    const response = await axios.get('shop/getAllPremium');
    console.log('all premium shops:', response);
    return response;
  } catch (error) {
    console.error("error in fetch all premium shops", error);
    throw error;
  }
};

// FIXED: Added : number types to page and limit
export const fetchAllBooking = async (
  page: number,
  limit: number
): Promise<any> => {
  try {
    const response = await axios.get(`bookings`, {
      params: {
        page,
        limit,
      },
    });
    console.log("all bookings", response);
    return response;
  } catch (error) {
    console.error("error in fetch all booking api", error);
    throw error;
  }
};

// FIXED: Added : string type to userId
export const fetchShopOwner = async (userId: string): Promise<any> => {
  try {
    const shopOwner = await axios.get(`auth/shop-owner/${userId}`);
    return shopOwner;
  } catch (error) {
    console.error("error in fetch shop owner", error);
    throw error;
  }
};

// FIXED: Added : string type to userId
export const deleteShopOwner = async (userId: string): Promise<any> => {
  try {
    const response = await axios.delete(`auth/shop-owner/${userId}`);
    return response;
  } catch (error) {
    console.error("error in delete shop owner", error);
    throw error;
  }
};

export const updateShopOwner = async (
  userId: string,
  data: any
): Promise<any> => {
  try {
    const response = await axios.put(`auth/shop-owner/${userId}`, data);
    return response;
  } catch (error) {
    console.error("error in update shop owner", error);
    throw error;
  }
};

export const updateShop = async (
  shopId: string,
  data: any
): Promise<any> => {
  try {
    const shop = await axios.put(`shop/shop/${shopId}`, data);
    return shop;
  } catch (error) {
    console.error("error in updating shop api", error);
    throw error;
  }
};

export const deleteShop = async (shopId: string): Promise<any> => {
  try {
    const response = await axios.delete(`shop/deleteShop/${shopId}`);
    return response;
  } catch (error) {
    console.error("error in deleting shop", error);
    throw error;
  }
};

export const fetchShop = async (shopId: string): Promise<any> => {
  try {
    const shop = await axios.get(`shop/shop/${shopId}`);
    console.log("shop data:", shop);
    return shop;
  } catch (error) {
    console.error("error in fetch shop", error);
    throw error;
  }
};

export const fetchBookings = async (params: Record<string, any>): Promise<any> => {
  const response = await axios.get("/booking/bookings", { params });
  console.log("response:", response);
  return response;
};

export const fetchBookingById = async (bookingId: string): Promise<any> => {
  try {
    const response = await axios.get(`/booking/bookings/${bookingId}`);
    console.log("bookings", response);
    return response;
  } catch (error) {
    console.error("error in fetching booking", error);
    throw error;
  }
};

export const fetchShopBookings = async (
  shopId: string,
  params: Record<string, any> = {}
): Promise<any> => {
  try {
    const response = await axios.get(`/shop/bookings/${shopId}`, { params });
    console.log("shop booking response", response);
    return response;
  } catch (error) {
    console.error("Error fetching bookings by shopId:", error);
    throw error;
  }
};

export const fetchServiceByShop = async (shopId: string): Promise<any> => {
  try {
    const response = await axios.get(`/shop/service/${shopId}`);
    console.log("service", response);
    return response;
  } catch (error) {
    console.error("error in fetch service api", error);
    throw error;
  }
};

export const fetchBarbersByShop = async (shopId: string): Promise<any> => {
  try {
    const response = await axios.get(`/shop/barbers/${shopId}`);
    console.log("barbers", response);
    return response;
  } catch (error) {
    console.error("error in fetch barbers api", error);
    throw error;
  }
};