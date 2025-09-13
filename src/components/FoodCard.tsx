import { View, Text, TouchableOpacity } from "react-native"
import type { FoodItem } from "../types"

interface FoodCardProps {
  food: FoodItem
  onEdit?: (food: FoodItem) => void
  onDelete?: (foodId: string) => void
}

export function FoodCard({ food, onEdit, onDelete }: FoodCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "grains":
        return "bg-amber-100 text-amber-800"
      case "nuts":
        return "bg-orange-100 text-orange-800"
      case "meat":
        return "bg-red-100 text-red-800"
      case "dairy":
        return "bg-blue-100 text-blue-800"
      case "vegetables":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <View className="p-4 bg-white rounded-lg border border-gray-200 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-text">{food.name}</Text>
          <Text className={`text-xs px-2 py-1 rounded-full self-start mt-1 ${getCategoryColor(food.category)}`}>
            {food.category}
          </Text>
        </View>
        {food.isCustom && (
          <View className="flex-row gap-2">
            <TouchableOpacity className="px-2 py-1 bg-secondary rounded" onPress={() => onEdit?.(food)}>
              <Text className="text-white text-xs">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-2 py-1 bg-red-500 rounded" onPress={() => onDelete?.(food.id)}>
              <Text className="text-white text-xs">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text className="text-sm text-text-secondary mb-2">Per 100g:</Text>
      <View className="flex-row flex-wrap -mx-1">
        <View className="w-1/2 px-1 mb-2">
          <Text className="text-xs text-text-secondary">Calories</Text>
          <Text className="text-sm font-medium text-text">{food.calories}</Text>
        </View>
        <View className="w-1/2 px-1 mb-2">
          <Text className="text-xs text-text-secondary">Protein</Text>
          <Text className="text-sm font-medium text-text">{food.protein}g</Text>
        </View>
        <View className="w-1/2 px-1 mb-2">
          <Text className="text-xs text-text-secondary">Carbs</Text>
          <Text className="text-sm font-medium text-text">{food.carbs}g</Text>
        </View>
        <View className="w-1/2 px-1 mb-2">
          <Text className="text-xs text-text-secondary">Fat</Text>
          <Text className="text-sm font-medium text-text">{food.fat}g</Text>
        </View>
        <View className="w-1/2 px-1 mb-2">
          <Text className="text-xs text-text-secondary">Fiber</Text>
          <Text className="text-sm font-medium text-text">{food.fiber}g</Text>
        </View>
      </View>
    </View>
  )
}
