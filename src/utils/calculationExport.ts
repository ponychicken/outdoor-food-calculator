import type { Calculation, FoodItem, NutritionProfile, NutritionSummary } from "../types"
import { calculateNutrition } from "./nutritionCalculator"

interface ExportCalculationOptions {
  calculation: Pick<Calculation, "name" | "days" | "items" | "profileId">
  foods: FoodItem[]
  profile?: NutritionProfile | null
  nutrition?: NutritionSummary | null
}

const formatNumber = (value: number, decimals = 1) => {
  return Number.isInteger(value) ? value.toString() : value.toFixed(decimals)
}

const resolveFoodName = (foodId: string, foods: FoodItem[]) => {
  return foods.find((food) => food.id === foodId)?.name || foodId
}

export const buildCalculationPlainText = ({
  calculation,
  foods,
  profile,
  nutrition,
}: ExportCalculationOptions): string => {
  const resolvedNutrition = nutrition || calculateNutrition(calculation.items, foods, calculation.days)
  const totalWeight = calculation.items.reduce((sum, item) => sum + item.amount, 0)

  const lines = [
    calculation.name?.trim() || "Food Calculation",
    `Days: ${formatNumber(calculation.days)}`,
    profile ? `Profile: ${profile.name}` : null,
    `Total weight: ${formatNumber(totalWeight)}g (${(totalWeight / 1000).toFixed(2)}kg)`,
    "",
    "Nutrition summary",
    `Daily: ${Math.round(resolvedNutrition.dailyCalories)} kcal, ${formatNumber(resolvedNutrition.dailyProtein)}g protein, ${formatNumber(resolvedNutrition.dailyCarbs)}g carbs, ${formatNumber(resolvedNutrition.dailyFat)}g fat, ${formatNumber(resolvedNutrition.dailyFiber)}g fiber`,
    `Total: ${Math.round(resolvedNutrition.totalCalories)} kcal, ${formatNumber(resolvedNutrition.totalProtein)}g protein, ${formatNumber(resolvedNutrition.totalCarbs)}g carbs, ${formatNumber(resolvedNutrition.totalFat)}g fat, ${formatNumber(resolvedNutrition.totalFiber)}g fiber`,
    "",
    "Items",
    ...calculation.items.map((item) => `- ${resolveFoodName(item.foodId, foods)}: ${formatNumber(item.amount)}g`),
  ]

  return lines.filter(Boolean).join("\n")
}
