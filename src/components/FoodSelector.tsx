"use client"

import { Feather } from "@expo/vector-icons"
import { CameraView, useCameraPermissions } from "expo-camera"
import { useState, useEffect, useRef } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet, Platform } from "react-native"
import type { FoodItem, CalculationItem } from "../types"
import { mapCategory } from "../utils/categoryMapper"
import { useStorage } from "../hooks/useStorage"

interface FoodSelectorProps {
  visible: boolean
  onClose: () => void
  onAddFood: (item: CalculationItem) => void
}

export function FoodSelector({ visible, onClose, onAddFood }: FoodSelectorProps) {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [amount, setAmount] = useState("100")
  const [isScanning, setIsScanning] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const searchInputRef = useRef<TextInput>(null)
  const incrementButtonRef = useRef<any>(null)
  const storage = useStorage()

  const categories = ["all", "grains", "nuts", "meat", "dairy", "vegetables", "other"]

  useEffect(() => {
    if (visible) {
      loadFoods()
    }
  }, [visible])

  useEffect(() => {
    filterFoods()
  }, [foods, searchQuery, selectedCategory])

  useEffect(() => {
    if (visible && !selectedFood) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [visible, selectedFood])

  useEffect(() => {
    if (selectedFood) {
      const timeoutId = setTimeout(() => {
        incrementButtonRef.current?.focus?.()
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [selectedFood])

  const loadFoods = async () => {
    const loadedFoods = await storage.getFoods()
    setFoods(loadedFoods)
  }

  const filterFoods = () => {
    let filtered = foods

    if (selectedCategory !== "all") {
      filtered = filtered.filter((food) => food.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredFoods(filtered)
  }

  const handleAddFood = () => {
    if (selectedFood && amount) {
      const numAmount = Number.parseFloat(amount)
      if (!isNaN(numAmount) && numAmount > 0) {
        onAddFood({
          foodId: selectedFood.id,
          amount: numAmount,
        })
        setSelectedFood(null)
        setAmount("100")
        onClose()
      }
    }
  }

  const adjustAmount = (delta: number) => {
    const currentAmount = Number.parseFloat(amount) || 0
    const newAmount = Math.max(0, currentAmount + delta)
    setAmount(newAmount.toString())
  }

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food)
  }

  const handleScanPress = async () => {
    if (!permission) {
      // Camera permissions are still loading.
      return
    }

    if (!permission.granted) {
      const { status } = await requestPermission()
      if (status !== "granted") {
        Alert.alert("Permission required", "Camera permission is needed to scan barcodes.")
        return
      }
    }

    setIsScanning(true)
  }

  const handleBarCodeScanned = async ({ data: barcode }: { data: string }) => {
    setIsScanning(false)
    Alert.alert("Barcode Scanned", `Searching for product with barcode: ${barcode}`, [{ text: "OK" }])

    try {
      const baseUrl = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=product_name,nutriments,categories_tags`
      const requestUrl = Platform.OS === "web" ? `https://corsproxy.io/?${encodeURIComponent(baseUrl)}` : baseUrl
      const response = await fetch(requestUrl)
      const json = await response.json()

      if (json.status === 1 && json.product && json.product.nutriments) {
        const nutriments = json.product.nutriments
        const mappedCategory = mapCategory(json.product.categories_tags || [])
        const newFood: FoodItem = {
          id: `custom-${Date.now()}`,
          name: json.product.product_name || `Scanned Item ${barcode}`,
          category: mappedCategory,
          calories: Math.round(nutriments["energy-kcal_100g"] || 0),
          protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
          fat: Math.round((nutriments.fat_100g || 0) * 10) / 10,
          fiber: Math.round((nutriments.fiber_100g || 0) * 10) / 10,
          isCustom: true,
        }

        // Save the new food and select it
        await storage.saveFood(newFood)
        await loadFoods() // Reload food list
        setSelectedFood(newFood)
      } else {
        Alert.alert("Not Found", "Product not found in the Open Food Facts database.")
      }
    } catch (error) {
      console.error("Failed to fetch food data:", error)
      Alert.alert("Error", "Failed to retrieve food data. Please check your connection.")
    }
  }

  if (isScanning) {
    return (
      <Modal visible={visible} animationType="slide">
        <View className="flex-1">
          <CameraView
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13", "ean8"],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            className="absolute top-12 left-4 bg-black/50 p-2 rounded-full"
            onPress={() => setIsScanning(false)}
          >
            <Text className="text-white text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-background">
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-text">Add Food</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-primary text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!selectedFood ? (
          <View className="flex-1">
            <View className="p-4">
              <View className="flex-row items-center gap-2 mb-4">
                <TextInput
                  ref={searchInputRef}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-text"
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={visible && !selectedFood}
                />
                <TouchableOpacity onPress={handleScanPress}>
                  <Feather name="camera" size={28} className="text-primary" />
                </TouchableOpacity>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row gap-2">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      className={`px-3 py-2 rounded-full ${selectedCategory === category ? "bg-primary" : "bg-gray-200"}`}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text
                        className={`text-sm font-medium ${selectedCategory === category ? "text-white" : "text-text"}`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <ScrollView className="flex-1 px-4">
              {filteredFoods.map((food) => (
                <TouchableOpacity
                  key={food.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 mb-3"
                  onPress={() => handleSelectFood(food)}
                >
                  <Text className="text-lg font-semibold text-text">{food.name}</Text>
                  <Text className="text-sm text-text-secondary">
                    {food.calories} cal, {food.protein}g protein per 100g
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="flex-1 p-4">
            <TouchableOpacity className="mb-4" onPress={() => setSelectedFood(null)}>
              <Text className="text-primary">← Back to food list</Text>
            </TouchableOpacity>

            <View className="bg-white p-4 rounded-lg mb-6">
              <Text className="text-xl font-bold text-text mb-2">{selectedFood.name}</Text>
              <Text className="text-sm text-text-secondary mb-4">Per 100g:</Text>
              <View className="grid grid-cols-2 gap-4">
                <View>
                  <Text className="text-sm text-text-secondary">Calories</Text>
                  <Text className="text-lg font-semibold text-text">{selectedFood.calories}</Text>
                </View>
                <View>
                  <Text className="text-sm text-text-secondary">Protein</Text>
                  <Text className="text-lg font-semibold text-text">{selectedFood.protein}g</Text>
                </View>
                <View>
                  <Text className="text-sm text-text-secondary">Carbs</Text>
                  <Text className="text-lg font-semibold text-text">{selectedFood.carbs}g</Text>
                </View>
                <View>
                  <Text className="text-sm text-text-secondary">Fat</Text>
                  <Text className="text-lg font-semibold text-text">{selectedFood.fat}g</Text>
                </View>
              </View>
            </View>

            <View className="bg-white p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-text mb-4">Amount (grams)</Text>

              <View className="flex-row items-center justify-center mb-4">
                <TouchableOpacity
                  className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center"
                  onPress={() => adjustAmount(-100)}
                >
                  <Text className="text-xl font-bold text-text">-</Text>
                </TouchableOpacity>

                <TextInput
                  className="mx-4 text-center text-2xl font-bold text-text border-b border-gray-300 min-w-20"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  ref={incrementButtonRef}
                  className="bg-gray-200 w-12 h-12 rounded-full items-center justify-center"
                  onPress={() => adjustAmount(100)}
                >
                  <Text className="text-xl font-bold text-text">+</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-2 justify-center">
                <TouchableOpacity className="bg-gray-100 px-3 py-2 rounded" onPress={() => adjustAmount(-50)}>
                  <Text className="text-text">-50g</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 px-3 py-2 rounded" onPress={() => adjustAmount(-10)}>
                  <Text className="text-text">-10g</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 px-3 py-2 rounded" onPress={() => adjustAmount(10)}>
                  <Text className="text-text">+10g</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 px-3 py-2 rounded" onPress={() => adjustAmount(50)}>
                  <Text className="text-text">+50g</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="bg-primary p-4 rounded-lg" onPress={handleAddFood}>
              <Text className="text-white text-center text-lg font-semibold">Add to Calculation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  )
}
