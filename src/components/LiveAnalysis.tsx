import { View } from "react-native"
import type { NutritionSummary, NutritionProfile } from "../types"
import { NutritionGauge } from "./NutritionGauge"

interface LiveAnalysisProps {
  nutrition: NutritionSummary
  profile: NutritionProfile
}

export function LiveAnalysis({ nutrition, profile }: LiveAnalysisProps) {
  const proteinTarget = (profile.caloriesPerDay * (profile.proteinPercent / 100)) / 4
  const carbsTarget = (profile.caloriesPerDay * (profile.carbsPercent / 100)) / 4
  const fatTarget = (profile.caloriesPerDay * (profile.fatPercent / 100)) / 9
  const fiberTarget = (profile.caloriesPerDay / 1000) * profile.fiberPer1000cal

  return (
    <View className="bg-white p-2 rounded-lg border border-gray-200 shadow-lg">
      <View className="flex-row justify-around">
        <NutritionGauge
          label="Calories"
          current={nutrition.dailyCalories}
          target={profile.caloriesPerDay}
          unit=""
          color="#3b82f6"
          size={60}
        />
        <NutritionGauge
          label="Protein"
          current={nutrition.dailyProtein}
          target={proteinTarget}
          unit="g"
          color="#10b981"
          size={60}
        />
        <NutritionGauge
          label="Carbs"
          current={nutrition.dailyCarbs}
          target={carbsTarget}
          unit="g"
          color="#f59e0b"
          size={60}
        />
        <NutritionGauge
          label="Fat"
          current={nutrition.dailyFat}
          target={fatTarget}
          unit="g"
          color="#ef4444"
          size={60}
        />
        <NutritionGauge
          label="Fiber"
          current={nutrition.dailyFiber}
          target={fiberTarget}
          unit="g"
          color="#8b5cf6"
          size={60}
        />
      </View>
    </View>
  )
}
