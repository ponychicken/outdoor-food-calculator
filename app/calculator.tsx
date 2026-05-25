"use client"

import { Feather } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import * as Clipboard from "expo-clipboard"
import type { NutritionProfile, FoodItem, CalculationItem, NutritionSummary, Calculation } from "../src/types"
import { useStorage } from "../src/hooks/useStorage"
import { FoodSelector } from "../src/components/FoodSelector"
import { CalculationItem as CalculationItemComponent } from "../src/components/CalculationItem"
import { calculateNutrition } from "../src/utils/nutritionCalculator"
import { LiveAnalysis } from "../src/components/LiveAnalysis"
import { SaveCalculationModal } from "../src/components/SaveCalculationModal"
import { buildCalculationPlainText } from "../src/utils/calculationExport"

export default function CalculatorScreen() {
  const [profiles, setProfiles] = useState<NutritionProfile[]>([])
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [selectedProfile, setSelectedProfile] = useState<NutritionProfile | null>(null)
  const [days, setDays] = useState("3")
  const [items, setItems] = useState<CalculationItem[]>([])
  const [showFoodSelector, setShowFoodSelector] = useState(false)
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false)
  const [nutrition, setNutrition] = useState<NutritionSummary | null>(null)
  const [currentCalculation, setCurrentCalculation] = useState<Partial<Calculation> | null>(null)
  const storage = useStorage()

  useEffect(() => {
    const loadAndRestore = async () => {
      const loadedProfiles = await loadData()
      // Pass profiles to ensure we're not using stale state
      await loadCurrentCalculation(loadedProfiles)
    }
    loadAndRestore()
  }, [])

  useEffect(() => {
    if (items.length > 0 && foods.length > 0) {
      const numDays = Number.parseFloat(days) || 1
      const calculatedNutrition = calculateNutrition(items, foods, numDays)
      setNutrition(calculatedNutrition)

      // Auto-save current calculation
      saveCurrentCalculation()
    } else {
      setNutrition(null)
    }
  }, [items, days, foods])

  const loadData = async () => {
    const [loadedProfiles, loadedFoods] = await Promise.all([storage.getProfiles(), storage.getFoods()])
    setProfiles(loadedProfiles)
    setFoods(loadedFoods)

    if (loadedProfiles.length > 0 && !selectedProfile) {
      setSelectedProfile(loadedProfiles[0])
    }
    return loadedProfiles
  }

  const loadCurrentCalculation = async (loadedProfiles?: NutritionProfile[]) => {
    const current = await storage.getCurrentCalculation()
    if (current) {
      setCurrentCalculation(current)
      if (current.days) setDays(current.days.toString())
      if (current.items) setItems(current.items)
      if (current.profileId) {
        // Use provided profiles list if available, otherwise fallback to state
        const profilesToSearch = loadedProfiles || profiles
        const profile = profilesToSearch.find((p) => p.id === current.profileId)
        if (profile) setSelectedProfile(profile)
      }
    }
  }

  const saveCurrentCalculation = async () => {
    const calculationToSave: Partial<Calculation> = {
      ...currentCalculation,
      days: Number.parseFloat(days) || 1,
      items,
      profileId: selectedProfile?.id || "",
    }
    setCurrentCalculation(calculationToSave)
    await storage.saveCurrentCalculation(calculationToSave)
  }

  const handleAddFood = (item: CalculationItem) => {
    const existingIndex = items.findIndex((i) => i.foodId === item.foodId)
    if (existingIndex >= 0) {
      const updatedItems = [...items]
      updatedItems[existingIndex].amount += item.amount
      setItems(updatedItems)
    } else {
      setItems([...items, item])
    }
  }

  const handleUpdateAmount = (foodId: string, amount: number) => {
    setItems(items.map((item) => (item.foodId === foodId ? { ...item, amount } : item)))
  }

  const handleRemoveItem = (foodId: string) => {
    setItems(items.filter((item) => item.foodId !== foodId))
  }

  const handleClearAll = () => {
    Alert.alert("Clear All", "Are you sure you want to clear all items?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setItems([])
          setCurrentCalculation(null)
          storage.clearCurrentCalculation()
        },
      },
    ])
  }

  const handleSaveCalculation = async (name: string) => {
    if (!selectedProfile || items.length === 0) {
      Alert.alert("Error", "Add items to your calculation before saving.")
      return
    }

    const calculation: Calculation = {
      id: currentCalculation?.id || `calc-${Date.now()}`,
      name: name.trim(),
      days: Number.parseFloat(days) || 1,
      profileId: selectedProfile.id,
      items: [...items],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await storage.saveCalculation(calculation)
    Alert.alert("Success", `Calculation "${name.trim()}" has been saved!`)
    setIsSaveModalVisible(false)
  }

  const handleSavePress = () => {
    setIsSaveModalVisible(true)
  }

  const handleCopyResults = async () => {
    if (items.length === 0 || !nutrition) {
      Alert.alert("Nothing to copy", "Add some food items first.")
      return
    }

    const text = buildCalculationPlainText({
      calculation: {
        name: currentCalculation?.name || "Current Calculation",
        days: Number.parseFloat(days) || 1,
        items,
        profileId: selectedProfile?.id || "",
      },
      foods,
      profile: selectedProfile,
      nutrition,
    })

    await Clipboard.setStringAsync(text)
    Alert.alert("Copied", "Calculation copied as plain text.")
  }

  const totalWeight = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-text">Food Calculator</Text>
            {items.length > 0 && (
              <View className="flex-row gap-4">
                <TouchableOpacity onPress={handleCopyResults}>
                  <Text className="text-primary text-base font-medium">Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSavePress}>
                  <Text className="text-primary text-base font-medium">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearAll}>
                  <Text className="text-red-500 text-base font-medium">Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Profile Selection */}
          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-lg font-semibold text-text mb-3">Nutrition Profile</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {profiles.map((profile) => (
                  <TouchableOpacity
                    key={profile.id}
                    className={`px-4 py-2 rounded-lg border-2 ${
                      selectedProfile?.id === profile.id ? "border-primary bg-primary/10" : "border-gray-200 bg-gray-50"
                    }`}
                    onPress={() => setSelectedProfile(profile)}
                  >
                    <Text
                      className={`font-medium ${selectedProfile?.id === profile.id ? "text-primary" : "text-text"}`}
                    >
                      {profile.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Days Input */}
          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-lg font-semibold text-text mb-3">Trip Duration</Text>
            <View className="flex-row items-center">
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-center text-lg font-semibold text-text w-20"
                value={days}
                onChangeText={setDays}
                keyboardType="numeric"
              />
              <Text className="ml-3 text-text">days</Text>
            </View>
          </View>

          {/* Food Items */}
          <View className="bg-white p-4 rounded-lg mb-4 mt-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-text">
                Food Items{" "}
                {totalWeight > 0 && (
                  <Text className="text-sm font-normal text-text-secondary">
                    ({(totalWeight / 1000).toFixed(2)} kg)
                  </Text>
                )}
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => setShowFoodSelector(true)}>
                  <Feather name="plus-circle" size={28} className="text-primary" />
                </TouchableOpacity>
              </View>
            </View>

            {items.length === 0 ? (
              <Text className="text-center text-text-secondary py-8">
                No food items added yet. Tap "Add Food" to get started.
              </Text>
            ) : (
              <View>
                {items.map((item) => {
                  const food = foods.find((f) => f.id === item.foodId)
                  return food ? (
                    <CalculationItemComponent
                      key={item.foodId}
                      item={item}
                      food={food}
                      onUpdateAmount={handleUpdateAmount}
                      onRemove={handleRemoveItem}
                    />
                  ) : null
                })}
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      {/* Live Analysis */}
      {nutrition && selectedProfile && (
        <View className="px-4 pb-4 pt-2">
          <LiveAnalysis nutrition={nutrition} profile={selectedProfile} />
        </View>
      )}

      <FoodSelector visible={showFoodSelector} onClose={() => setShowFoodSelector(false)} onAddFood={handleAddFood} />

      <SaveCalculationModal
        visible={isSaveModalVisible}
        initialName={currentCalculation?.name}
        onClose={() => setIsSaveModalVisible(false)}
        onSave={handleSaveCalculation}
      />
    </View>
  )
}
