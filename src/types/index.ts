export interface NutritionProfile {
  id: string
  name: string
  caloriesPerDay: number
  proteinPercent: number // as percentage of calories
  carbsPercent: number // as percentage of calories
  fatPercent: number // as percentage of calories
  fiberPer1000cal: number // grams per 1000 calories
  isCustom: boolean
}

export interface FoodItem {
  id: string
  name: string
  category: "grains" | "nuts" | "meat" | "dairy" | "vegetables" | "other"
  // Nutrition per 100g
  calories: number
  protein: number // grams
  carbs: number // grams
  fat: number // grams
  fiber: number // grams
  isCustom: boolean
}

export interface CalculationItem {
  foodId: string
  amount: number // grams
}

export interface Calculation {
  id: string
  name: string
  days: number
  profileId: string
  items: CalculationItem[]
  createdAt: Date
  updatedAt: Date
}

export interface NutritionSummary {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  totalFiber: number
  dailyCalories: number
  dailyProtein: number
  dailyCarbs: number
  dailyFat: number
  dailyFiber: number
}

export interface CompletionPercentages {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}
