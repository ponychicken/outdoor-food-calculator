import { View, Text } from "react-native"
import type { NutritionSummary, NutritionProfile } from "../types"
import { calculateCompletionPercentages } from "../utils/nutritionCalculator"

interface CompactAnalysisProps {
  nutrition: NutritionSummary
  profile: NutritionProfile
}

export function CompactAnalysis({ nutrition, profile }: CompactAnalysisProps) {
  const completions = calculateCompletionPercentages(nutrition, profile)
  const proteinTarget = (profile.caloriesPerDay * (profile.proteinPercent / 100)) / 4
  const carbsTarget = (profile.caloriesPerDay * (profile.carbsPercent / 100)) / 4
  const fatTarget = (profile.caloriesPerDay * (profile.fatPercent / 100)) / 9
  const fiberTarget = (profile.caloriesPerDay / 1000) * profile.fiberPer1000cal

  const getBarColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  const nutrients = [
    {
      label: "Cal",
      percentage: completions.calories,
      current: nutrition.dailyCalories,
      target: profile.caloriesPerDay,
      unit: "",
    },
    {
      label: "Pro",
      percentage: completions.protein,
      current: nutrition.dailyProtein,
      target: proteinTarget,
      unit: "g",
    },
    {
      label: "Carb",
      percentage: completions.carbs,
      current: nutrition.dailyCarbs,
      target: carbsTarget,
      unit: "g",
    },
    { label: "Fat", percentage: completions.fat, current: nutrition.dailyFat, target: fatTarget, unit: "g" },
    {
      label: "Fib",
      percentage: completions.fiber,
      current: nutrition.dailyFiber,
      target: fiberTarget,
      unit: "g",
    },
  ]

  return (
    <View className="bg-white p-3 rounded-lg border border-gray-200">
      <Text className="text-sm font-semibold text-text mb-3">Daily Progress</Text>

      <View className="space-y-2">
        {nutrients.map((nutrient) => (
          <View key={nutrient.label} className="flex-row items-center">
            <Text className="text-xs font-medium text-text w-8">{nutrient.label}</Text>

            <View className="flex-1 mx-2">
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className={`h-full rounded-full ${getBarColor(nutrient.percentage)}`}
                  style={{ width: `${Math.min(nutrient.percentage, 100)}%` }}
                />
              </View>
            </View>

            <Text className="text-xs text-text-secondary w-16 text-right">
              {Math.round(nutrient.current)}/{nutrient.target}
              {nutrient.unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
