import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
const basUrl = process.env.EXPO_PUBLIC_BASE_URL
export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    register: async (username, email, password,) => {

        set({ isLoading: true });
        try {
            const response = await fetch(basUrl + `/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
            return { success: true, message: "User registered successfully" }
        } catch (error) {
            set({ isLoading: false });
            console.log(error)
            return { success: false, message: error.message }
        }
    },
    signIn: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(basUrl + `/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
            return { success: true, message: "User logged in successfully" }
        } catch (error) {
            set({ isLoading: false });
            console.log(error)
            return { success: false, message: error.message }
        }
    }
}))