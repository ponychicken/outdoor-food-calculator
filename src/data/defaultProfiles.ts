import type { NutritionProfile } from "../types"

export const defaultProfiles: NutritionProfile[] = [
  {
    id: "moderate-activity",
    name: "Shorter Activity",
    caloriesPerDay: 2800,
    proteinPercent: 15,
    carbsPercent: 50,
    fatPercent: 35,
    fiberPer1000cal: 12,
    isCustom: false,
  },
  {
    id: "high-activity",
    name: "Weeklong Hike",
    caloriesPerDay: 3500,
    proteinPercent: 18,
    carbsPercent: 47,
    fatPercent: 35,
    fiberPer1000cal: 12,
    isCustom: false,
  },
  {
    id: "extreme-activity",
    name: "Long Distance Hike",
    caloriesPerDay: 4000,
    proteinPercent: 25,
    carbsPercent: 35,
    fatPercent: 40,
    fiberPer1000cal: 12,
    isCustom: false,
  },
]
