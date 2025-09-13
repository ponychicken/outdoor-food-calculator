import { View, Text, TouchableOpacity } from "react-native"
import type { NutritionProfile } from "../types"

interface ProfileCardProps {
  profile: NutritionProfile
  onSelect?: (profile: NutritionProfile) => void
  onEdit?: (profile: NutritionProfile) => void
  onDelete?: (profileId: string) => void
  isSelected?: boolean
}

export function ProfileCard({ profile, onSelect, onEdit, onDelete, isSelected }: ProfileCardProps) {
  const { proteinPercent, carbsPercent, fatPercent } = profile

  return (
    <TouchableOpacity
      className={`p-4 rounded-lg border-2 mb-3 ${
        isSelected ? "border-primary bg-primary/10" : "border-gray-200 bg-white"
      }`}
      onPress={() => onSelect?.(profile)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-text">{profile.name}</Text>
        {profile.isCustom && (
          <View className="flex-row gap-2">
            <TouchableOpacity className="px-2 py-1 bg-secondary rounded" onPress={() => onEdit?.(profile)}>
              <Text className="text-white text-xs">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-2 py-1 bg-red-500 rounded" onPress={() => onDelete?.(profile.id)}>
              <Text className="text-white text-xs">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="grid grid-cols-2 gap-2">
        <View>
          <Text className="text-sm text-text-secondary">Calories/day</Text>
          <Text className="text-base font-medium text-text">{profile.caloriesPerDay}</Text>
        </View>
        <View>
          <Text className="text-sm text-text-secondary">Protein</Text>
          <Text className="text-base font-medium text-text">{proteinPercent}%</Text>
        </View>
        <View>
          <Text className="text-sm text-text-secondary">Carbs</Text>
          <Text className="text-base font-medium text-text">{carbsPercent}%</Text>
        </View>
        <View>
          <Text className="text-sm text-text-secondary">Fat</Text>
          <Text className="text-base font-medium text-text">{fatPercent}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
