import axios from "../Axios/Axios";

export const fetchAllUsers = async () => {
  try {
    const response = await axios.get("auth/getAllUser");
    console.log("response:",response)
    return response ?? [];
  } catch (error) {
    console.error("error in fetchAllUsers api", error);
    return []; // ✅ fallback
  }
};


export const fetchAllShopOwners = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axios.get(`/auth/viewAllShopOwners?page=${page}&limit=${limit}`);
    console.log('Shop owners response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching shop owners:', error);
    throw error; // let component handle it
  }
};

export const fetchAllShops = async () => {
    try {
        const response = await axios.get('/shop/ViewAllShop')
        console.log("response",response)
        return response
    } catch (error) {
        console.error("error in fetch shop",error)
    }
}

export const fetchAllPremiumShops = async () => {
    try {
        const response = await axios.get('shop/getAllPremium')
        console.log('all premium shops:',response)
        return response
    } catch (error) {
        console.error("error in fetch all premium shops",error)
    }
}

export const fetchAllBooking = async (page,limit) => {
    try {
        const  response = await axios.get(`bookings`,{
            params:{
                page,limit
            }
        })
        console.log("all bookings",response)
        return response
    } catch (error) {
        console.error("error in fetch all booking api",error)
    }
}

export const fetchShopOwner = async (userId) => {
    try {
        const  shopOwner = await axios.get(`auth/shop-owner/${userId}`)
        return shopOwner
    } catch (error) {
        console.error("error in fetch shop owner",error)
    }
}

export const deleteShopOwner = async (userId) => {
    try {
        const  shopOwner = await axios.delete(`auth/shop-owner/${userId}`)
        return shopOwner
    } catch (error) {
        console.error("error in fetch shop owner",error)
    }
}

export const updateShopOwner = async (userId,data) => {
    try {
        const  shopOwner = await axios.put(`auth/shop-owner/${userId}`,data)
        return shopOwner
    } catch (error) {
        console.error("error in fetch shop owner",error)
    }
}

export const updateShop = async (shopId,data) => {
    try {
        const  shop = await axios.put(`shop/shop/${shopId}`,data)
        return shop
    } catch (error) {
        console.error("error in updating shop api",error)
    }
}

export const deleteShop = async (shopId) => {
    try {
        const  shop = await axios.delete(`shop/deleteShop/${shopId}`)
        return shop
    } catch (error) {
        console.error("error in deleting shop",error)
    }
}

export const fetchShop = async (shopId) => {
    try {
        const  shop = await axios.get(`shop/shop/${shopId}`)
        console.log("shop data:",shop)
        return shop
    } catch (error) {
        console.error("error in fetch shop",error)
    }
}

export const fetchBookings = async (params) => {
 const response = await axios.get("/booking/bookings", { params });
 console.log("response:",response)
 return response
};

export const fetchBookingById = async (bookingId) => {
    try {
          const response = await axios.get(`/booking/bookings/${bookingId}`);
          console.log("bookings", response)
          return response
    } catch (error) {
        console.log("error in fetching booking",error)
    }
};


export const fetchShopBookings = async (shopId, params = {}) => {
  try {
    const response = await axios.get(
      `/shop/bookings/${shopId}`,
      { params }
    );
    console.log("shop booking response",response)
    return response; // ✅ return data
  } catch (error) {
    console.error("Error fetching bookings by shopId:", error);
    throw error; // ✅ let caller handle it
  }
};

export const fetchServiceByShop = async (shopId) => {
    try {
        const response = await axios.get(`/shop/service/${shopId}`)
        console.log("servcie",response)
        return response
    } catch (error) {
        console.error("error in fetch service  api",error)
    }
}


export const fetchBarbersByShop = async (shopId) => {
    try {
        const response = await axios.get(`/shop/barbers/${shopId}`)
        console.log("barbers",response)
        return response
    } catch (error) {
        console.error("error in fetch barbers  api",error)
    }
}
