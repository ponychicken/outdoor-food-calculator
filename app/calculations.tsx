"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, Alert } from "react-native"
import * as Clipboard from "expo-clipboard"
import type { Calculation, NutritionProfile, FoodItem } from "../src/types"
import { useStorage } from "../src/hooks/useStorage"
import { CalculationCard } from "../src/components/CalculationCard"
import { router } from "expo-router"
import { buildCalculationPlainText } from "../src/utils/calculationExport"

export default function CalculationsScreen() {
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [profiles, setProfiles] = useState<NutritionProfile[]>([])
  const [foods, setFoods] = useState<FoodItem[]>([])
  const storage = useStorage()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [loadedCalculations, loadedProfiles, loadedFoods] = await Promise.all([
      storage.getCalculations(),
      storage.getProfiles(),
      storage.getFoods(),
    ])

    setCalculations(
      loadedCalculations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    )
    setProfiles(loadedProfiles)
    setFoods(loadedFoods)
  }

  const handleLoadCalculation = async (calculation: Calculation) => {
    // Save as current calculation
    await storage.saveCurrentCalculation({
      id: calculation.id,
      name: calculation.name,
      days: calculation.days,
      items: calculation.items,
      profileId: calculation.profileId,
    })

    // Navigate to calculator
    router.push("/calculator")
  }

  const handleDeleteCalculation = (calculationId: string) => {
    const calculation = calculations.find((c) => c.id === calculationId)
    if (!calculation) return

    Alert.alert("Delete Calculation", `Are you sure you want to delete "${calculation.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await storage.deleteCalculation(calculationId)
          await loadData()
        },
      },
    ])
  }

  const handleCopyCalculation = async (calculation: Calculation) => {
    const profile = profiles.find((p) => p.id === calculation.profileId)
    const text = buildCalculationPlainText({
      calculation,
      foods,
      profile,
    })

    await Clipboard.setStringAsync(text)
    Alert.alert("Copied", "Calculation copied as plain text.")
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-text mb-6">Saved Calculations</Text>

        {calculations.length === 0 ? (
          <View className="bg-white p-8 rounded-lg border border-gray-200">
            <Text className="text-center text-text-secondary text-lg mb-2">No saved calculations yet</Text>
            <Text className="text-center text-text-secondary">
              Create a calculation in the calculator and save it to see it here.
            </Text>
          </View>
        ) : (
          <View>
            {calculations.map((calculation) => {
              const profile = profiles.find((p) => p.id === calculation.profileId)
              return (
                <CalculationCard
                  key={calculation.id}
                  calculation={calculation}
                  profile={profile}
                  foods={foods}
                  onLoad={handleLoadCalculation}
                  onDelete={handleDeleteCalculation}
                  onCopy={handleCopyCalculation}
                />
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
