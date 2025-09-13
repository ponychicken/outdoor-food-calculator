import AsyncStorage from "@react-native-async-storage/async-storage"
import type { NutritionProfile, FoodItem, Calculation } from "../types"
import { defaultProfiles } from "../data/defaultProfiles"
import { defaultFoods } from "../data/defaultFoods"

const STORAGE_KEYS = {
  PROFILES: "nutrition_profiles",
  FOODS: "food_items",
  CALCULATIONS: "calculations",
  CURRENT_CALCULATION: "current_calculation",
}

export const useStorage = () => {
  const getProfiles = async (): Promise<NutritionProfile[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROFILES)
      if (stored) {
        let customProfiles = JSON.parse(stored)
        // One-time migration for old profile structure
        const needsMigration = customProfiles.length > 0 && customProfiles[0].proteinPerDay !== undefined
        if (needsMigration) {
          customProfiles = customProfiles.map((p: any) => ({
            id: p.id,
            name: p.name,
            caloriesPerDay: p.caloriesPerDay,
            proteinPercent: Math.round((p.proteinPerDay * 4 * 100) / p.caloriesPerDay),
            fatPercent: Math.round((p.fatPerDay * 9 * 100) / p.caloriesPerDay),
            carbsPercent: Math.round((p.carbsPerDay * 4 * 100) / p.caloriesPerDay),
            fiberPer1000cal: Math.round((p.fiberPerDay * 1000) / p.caloriesPerDay),
            isCustom: p.isCustom,
          }))
          // Re-save migrated profiles
          await AsyncStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(customProfiles))
        }
        return [...defaultProfiles, ...customProfiles]
      }
      return defaultProfiles
    } catch (error) {
      console.error("Error loading profiles:", error)
      return defaultProfiles
    }
  }

  const saveProfile = async (profile: NutritionProfile): Promise<void> => {
    try {
      const profiles = await getProfiles()
      const customProfiles = profiles.filter((p) => p.isCustom)
      const existingIndex = customProfiles.findIndex((p) => p.id === profile.id)

      if (existingIndex >= 0) {
        customProfiles[existingIndex] = profile
      } else {
        customProfiles.push(profile)
      }

      await AsyncStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(customProfiles))
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const deleteProfile = async (profileId: string): Promise<void> => {
    try {
      const profiles = await getProfiles()
      const customProfiles = profiles.filter((p) => p.isCustom && p.id !== profileId)
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(customProfiles))
    } catch (error) {
      console.error("Error deleting profile:", error)
    }
  }

  const getFoods = async (): Promise<FoodItem[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FOODS)
      if (stored) {
        const customFoods = JSON.parse(stored)
        return [...defaultFoods, ...customFoods]
      }
      return defaultFoods
    } catch (error) {
      console.error("Error loading foods:", error)
      return defaultFoods
    }
  }

  const saveFood = async (food: FoodItem): Promise<void> => {
    try {
      const foods = await getFoods()
      const customFoods = foods.filter((f) => f.isCustom)
      const existingIndex = customFoods.findIndex((f) => f.id === food.id)

      if (existingIndex >= 0) {
        customFoods[existingIndex] = food
      } else {
        customFoods.push(food)
      }

      await AsyncStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(customFoods))
    } catch (error) {
      console.error("Error saving food:", error)
    }
  }

  const deleteFood = async (foodId: string): Promise<void> => {
    try {
      const foods = await getFoods()
      const customFoods = foods.filter((f) => f.isCustom && f.id !== foodId)
      await AsyncStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(customFoods))
    } catch (error) {
      console.error("Error deleting food:", error)
    }
  }

  const getCalculations = async (): Promise<Calculation[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CALCULATIONS)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading calculations:", error)
      return []
    }
  }

  const saveCalculation = async (calculation: Calculation): Promise<void> => {
    try {
      const calculations = await getCalculations()
      const existingIndex = calculations.findIndex((c) => c.id === calculation.id)

      if (existingIndex >= 0) {
        calculations[existingIndex] = calculation
      } else {
        calculations.push(calculation)
      }

      await AsyncStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(calculations))
    } catch (error) {
      console.error("Error saving calculation:", error)
    }
  }

  const deleteCalculation = async (calculationId: string): Promise<void> => {
    try {
      const calculations = await getCalculations()
      const filtered = calculations.filter((c) => c.id !== calculationId)
      await AsyncStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(filtered))
    } catch (error) {
      console.error("Error deleting calculation:", error)
    }
  }

  const getCurrentCalculation = async (): Promise<Partial<Calculation> | null> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CALCULATION)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Error loading current calculation:", error)
      return null
    }
  }

  const saveCurrentCalculation = async (calculation: Partial<Calculation>): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_CALCULATION, JSON.stringify(calculation))
    } catch (error) {
      console.error("Error saving current calculation:", error)
    }
  }

  return {
    getProfiles,
    saveProfile,
    deleteProfile,
    getFoods,
    saveFood,
    deleteFood,
    getCalculations,
    saveCalculation,
    deleteCalculation,
    getCurrentCalculation,
    saveCurrentCalculation,
  }
}
