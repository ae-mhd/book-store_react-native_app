import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeScreen } from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/auth";
import { useEffect } from "react";
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);


  // handle navigation base on auth state
  useEffect(() => {
    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;
    if (!isAuthScreen && !isSignedIn) {
      router.replace("/(auth)");
    }
    else if (isAuthScreen && isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);

  return (<SafeAreaProvider>
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeScreen>
    <StatusBar style="dark" />
  </SafeAreaProvider>);
}
