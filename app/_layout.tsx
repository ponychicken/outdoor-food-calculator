import { Stack } from "expo-router"
import "../global.css"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="calculator" options={{ title: "Calculator" }} />
      <Stack.Screen name="profiles" options={{ title: "Profiles" }} />
      <Stack.Screen name="foods" options={{ title: "Food Database" }} />
      <Stack.Screen name="calculations" options={{ title: "Saved Calculations" }} />
    </Stack>
  )
}
