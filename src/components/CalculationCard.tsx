import { Feather } from "@expo/vector-icons"
import { View, Text, TouchableOpacity } from "react-native"
import type { Calculation, NutritionProfile, FoodItem } from "../types"
import { calculateNutrition } from "../utils/nutritionCalculator"

interface CalculationCardProps {
  calculation: Calculation
  profile?: NutritionProfile
  foods: FoodItem[]
  onLoad: (calculation: Calculation) => void
  onDelete: (calculationId: string) => void
  onCopy: (calculation: Calculation) => void
}

export function CalculationCard({ calculation, profile, foods, onLoad, onDelete, onCopy }: CalculationCardProps) {
  const nutrition = calculateNutrition(calculation.items, foods, calculation.days)
  const totalItems = calculation.items.reduce((sum, item) => sum + item.amount, 0)

  const proteinPerDayTarget = profile ? Math.round((profile.caloriesPerDay * (profile.proteinPercent / 100)) / 4) : 0

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
      onPress={() => onLoad(calculation)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-text">{calculation.name}</Text>
          <Text className="text-sm text-text-secondary">
            {calculation.days} days • {calculation.items.length} food types • {Math.round(totalItems / 1000)}kg total
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => onCopy(calculation)}>
            <Feather name="copy" size={20} className="text-primary" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(calculation.id)}>
            <Feather name="trash-2" size={20} className="text-red-500" />
          </TouchableOpacity>
        </View>
      </View>

      {profile && (
        <View className="mb-2">
          <Text className="text-xs text-text-secondary mb-1">Daily averages:</Text>
          <View className="flex-row justify-between">
            <Text className="text-sm text-text">
              {Math.round(nutrition.dailyCalories)}/{profile.caloriesPerDay} cal
            </Text>
            <Text className="text-sm text-text">
              {Math.round(nutrition.dailyProtein)}/{proteinPerDayTarget}g protein
            </Text>
          </View>
        </View>
      )}

      <View className="flex-row justify-between items-center">
        <Text className="text-xs text-text-secondary">Created: {formatDate(calculation.createdAt)}</Text>
        <Text className="text-xs text-primary font-medium">Tap to load</Text>
      </View>
    </TouchableOpacity>
  )
}
