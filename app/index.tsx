import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Link } from "expo-router"

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <Text className="text-3xl font-bold text-text mb-2">Outdoor Food Calculator</Text>
        <Text className="text-lg text-text-secondary mb-8">
      What to bring on your next hike?    
        </Text>

        <View className="space-y-4">
          <Link href="/calculator" asChild>
            <TouchableOpacity className="bg-primary p-4 rounded-lg">
              <Text className="text-white text-lg font-semibold text-center">Open Calculator</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/calculations" asChild>
            <TouchableOpacity className="bg-secondary p-4 rounded-lg">
              <Text className="text-white text-lg font-semibold text-center">Saved Calculations</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/profiles" asChild>
            <TouchableOpacity className="bg-accent p-4 rounded-lg">
              <Text className="text-white text-lg font-semibold text-center">Manage Profiles</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/foods" asChild>
            <TouchableOpacity className="bg-gray-600 p-4 rounded-lg">
              <Text className="text-white text-lg font-semibold text-center">Food Database</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}
