import { View, Text } from "react-native"
import type { NutritionSummary, NutritionProfile } from "../types"
import { calculateCompletionPercentages } from "../utils/nutritionCalculator"

interface NutritionProgressProps {
  nutrition: NutritionSummary
  profile: NutritionProfile
  showDetailed?: boolean
}

export function NutritionProgress({ nutrition, profile, showDetailed = false }: NutritionProgressProps) {
  const completions = calculateCompletionPercentages(nutrition, profile)

  const proteinTarget = (profile.caloriesPerDay * (profile.proteinPercent / 100)) / 4
  const carbsTarget = (profile.caloriesPerDay * (profile.carbsPercent / 100)) / 4
  const fatTarget = (profile.caloriesPerDay * (profile.fatPercent / 100)) / 9
  const fiberTarget = (profile.caloriesPerDay / 1000) * profile.fiberPer1000cal

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "#16a34a" // green
    if (percentage >= 70) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  const nutrients = [
    {
      label: "Calories",
      short: "Cal",
      percentage: completions.calories,
      current: nutrition.dailyCalories,
      target: profile.caloriesPerDay,
      unit: "",
      color: "#3b82f6",
    },
    {
      label: "Protein",
      short: "Pro",
      percentage: completions.protein,
      current: nutrition.dailyProtein,
      target: proteinTarget,
      unit: "g",
      color: "#10b981",
    },
    {
      label: "Carbs",
      short: "Carb",
      percentage: completions.carbs,
      current: nutrition.dailyCarbs,
      target: carbsTarget,
      unit: "g",
      color: "#f59e0b",
    },
    {
      label: "Fat",
      short: "Fat",
      percentage: completions.fat,
      current: nutrition.dailyFat,
      target: fatTarget,
      unit: "g",
      color: "#ef4444",
    },
    {
      label: "Fiber",
      short: "Fib",
      percentage: completions.fiber,
      current: nutrition.dailyFiber,
      target: fiberTarget,
      unit: "g",
      color: "#8b5cf6",
    },
  ]

  if (showDetailed) {
    return (
      <View className="bg-white p-4 rounded-lg border border-gray-200">
        <Text className="text-lg font-semibold text-text mb-4">Nutrition Progress</Text>

        <View className="space-y-4">
          {nutrients.map((nutrient) => (
            <View key={nutrient.label}>
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-medium text-text">{nutrient.label}</Text>
                <Text className="text-sm text-text-secondary">
                  {Math.round(nutrient.current)}/{nutrient.target}
                  {nutrient.unit} ({Math.round(nutrient.percentage)}%)
                </Text>
              </View>

              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(nutrient.percentage, 100)}%`,
                    backgroundColor: getProgressColor(nutrient.percentage),
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View className="bg-white p-3 rounded-lg border border-gray-200">
      <Text className="text-sm font-semibold text-text mb-3">Daily Progress</Text>

      <View className="flex-row justify-between">
        {nutrients.map((nutrient) => (
          <View key={nutrient.short} className="items-center flex-1">
            <View className="w-8 h-8 rounded-full border-2 border-gray-200 items-center justify-center mb-1">
              <View
                className="w-6 h-6 rounded-full"
                style={{
                  backgroundColor: nutrient.percentage >= 80 ? getProgressColor(nutrient.percentage) : "#e5e7eb",
                }}
              />
            </View>
            <Text className="text-xs font-medium text-text">{nutrient.short}</Text>
            <Text className="text-xs text-text-secondary">{Math.round(nutrient.percentage)}%</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
