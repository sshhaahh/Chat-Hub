import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import {io} from "socket.io-client"


const BASE_URL = import.meta.env.MODE==='development'?"http://localhost:5001/api":"/"


export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdateProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],                                           
  socket:null,
  // ✅ CHECK AUTH
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket()

    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ SIGNUP
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Sign Up Successful!");
      get().connectSocket()

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ LOGIN
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login Successful!");
      get().connectSocket()

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ LOGOUT
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout Successful");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed.");
    }
  },

  // ✅ UPDATE PROFILE
  updateProfile: async (data) => {
    set({ isUpdateProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data }); // Backend returns updated user
      toast.success("Profile Updated!");
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error?.response?.data?.message || "Profile update failed.");
    } finally {
      set({ isUpdateProfile: false });
    }
  },

  connectSocket:()=>{
    const {authUser}=get()
    if(!authUser || get().socket?.connected) return 
    const socket =io(BASE_URL,{
      query:{
        userId:authUser._id,
      }
    })
    socket.connect();

    socket.on('getOnlineUsers',(userIds)=>{
      set({onlineUsers:userIds})
    })

    set({socket:socket})
  },


  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
  },

}));
