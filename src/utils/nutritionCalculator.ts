import type { FoodItem, CalculationItem, NutritionSummary, CompletionPercentages, NutritionProfile } from "../types"

export const calculateNutrition = (items: CalculationItem[], foods: FoodItem[], days: number): NutritionSummary => {
  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  let totalFiber = 0

  items.forEach((item) => {
    const food = foods.find((f) => f.id === item.foodId)
    if (food) {
      const multiplier = item.amount / 100 // Convert to per 100g
      totalCalories += food.calories * multiplier
      totalProtein += food.protein * multiplier
      totalCarbs += food.carbs * multiplier
      totalFat += food.fat * multiplier
      totalFiber += food.fiber * multiplier
    }
  })

  return {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalFiber,
    dailyCalories: totalCalories / days,
    dailyProtein: totalProtein / days,
    dailyCarbs: totalCarbs / days,
    dailyFat: totalFat / days,
    dailyFiber: totalFiber / days,
  }
}

export const calculateCompletionPercentages = (
  nutrition: NutritionSummary,
  profile: NutritionProfile,
): CompletionPercentages => {
  const proteinTarget = (profile.caloriesPerDay * (profile.proteinPercent / 100)) / 4
  const carbsTarget = (profile.caloriesPerDay * (profile.carbsPercent / 100)) / 4
  const fatTarget = (profile.caloriesPerDay * (profile.fatPercent / 100)) / 9
  const fiberTarget = (profile.caloriesPerDay / 1000) * profile.fiberPer1000cal

  return {
    calories:
      profile.caloriesPerDay > 0 ? Math.min((nutrition.dailyCalories / profile.caloriesPerDay) * 100, 100) : 100,
    protein: proteinTarget > 0 ? Math.min((nutrition.dailyProtein / proteinTarget) * 100, 100) : 100,
    carbs: carbsTarget > 0 ? Math.min((nutrition.dailyCarbs / carbsTarget) * 100, 100) : 100,
    fat: fatTarget > 0 ? Math.min((nutrition.dailyFat / fatTarget) * 100, 100) : 100,
    fiber: fiberTarget > 0 ? Math.min((nutrition.dailyFiber / fiberTarget) * 100, 100) : 100,
  }
}
