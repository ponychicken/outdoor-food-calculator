"use client"

import { Feather } from "@expo/vector-icons"
import { CameraView, useCameraPermissions } from "expo-camera"
import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native"
import type { FoodItem } from "../types"
import { mapCategory } from "../utils/categoryMapper"
import { useStorage } from "../hooks/useStorage"

interface AddFoodModalProps {
  visible: boolean
  onClose: () => void
  onFoodAdded: () => void
}

export function AddFoodModal({ visible, onClose, onFoodAdded }: AddFoodModalProps) {
  const [mode, setMode] = useState<"manual" | "search">("manual")

  // Form state
  const [name, setName] = useState("")
  const [category, setCategory] = useState<FoodItem["category"]>("other")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [carbs, setCarbs] = useState("")
  const [fat, setFat] = useState("")
  const [fiber, setFiber] = useState("")

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()

  const storage = useStorage()
  const foodCategories: FoodItem["category"][] = ["grains", "nuts", "meat", "dairy", "vegetables", "other"]

  const resetForm = () => {
    setName("")
    setCategory("other")
    setCalories("")
    setProtein("")
    setCarbs("")
    setFat("")
    setFiber("")
  }

  const handleClose = () => {
    resetForm()
    setSearchQuery("")
    setSearchResults([])
    setMode("manual")
    onClose()
  }

  const handleSave = async () => {
    if (!name.trim() || !calories || !protein || !carbs || !fat || !fiber) {
      Alert.alert("Error", "Please fill out all numeric fields.")
      return
    }

    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      calories: Number.parseFloat(calories) || 0,
      protein: Number.parseFloat(protein) || 0,
      carbs: Number.parseFloat(carbs) || 0,
      fat: Number.parseFloat(fat) || 0,
      fiber: Number.parseFloat(fiber) || 0,
      isCustom: true,
    }

    await storage.saveFood(newFood)
    Alert.alert("Success", `"${newFood.name}" has been added to your food database.`)
    onFoodAdded()
    handleClose()
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setSearchResults([])
    const startTime = Date.now()
    console.log(`[OpenFoodFacts] Starting search for "${searchQuery}"...`)
    try {
      const baseUrl = `https://search.openfoodfacts.org/search?q=${searchQuery}&page_size=10&fields=product_name,nutriments,code,categories_tags`
      const requestUrl = Platform.OS === "web" ? `https://corsproxy.io/?${encodeURIComponent(baseUrl)}` : baseUrl
      const response = await fetch(requestUrl)
      const json = await response.json()
      if (json.hits && json.hits.length > 0) {
        const filteredHits = json.hits.filter(
          (hit: any) => hit.product_name && hit.nutriments?.["energy-kcal_100g"] > 0,
        )
        if (filteredHits.length > 0) {
          setSearchResults(filteredHits)
        } else {
          Alert.alert("No Results", "No valid products found for your search term.")
        }
      } else {
        Alert.alert("No Results", "No products found for your search term.")
      }
    } catch (error) {
      console.error("Failed to search food data:", error)
      Alert.alert("Error", "Failed to search for food data. Please check your connection.")
    } finally {
      const duration = Date.now() - startTime
      console.log(`[OpenFoodFacts] Search finished in ${duration}ms.`)
      setIsSearching(false)
    }
  }

  const populateFormWithProduct = (product: any) => {
    const nutriments = product.nutriments || {}
    const mappedCategory = mapCategory(product.categories_tags || [])
    setName(product.product_name || "")
    setCalories(Math.round(nutriments["energy-kcal_100g"] || 0).toString())
    setProtein((nutriments.proteins_100g || 0).toFixed(1))
    setCarbs((nutriments.carbohydrates_100g || 0).toFixed(1))
    setFat((nutriments.fat_100g || 0).toFixed(1))
    setFiber((nutriments.fiber_100g || 0).toFixed(1))
    setCategory(mappedCategory)
    setMode("manual")
  }

  const handleScanPress = async () => {
    if (!permission) return
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
      if (json.status === 1 && json.product) {
        populateFormWithProduct(json.product)
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
            barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8"] }}
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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View className="flex-1 bg-background">
        <View className="p-4 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-text">Add New Food</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-primary text-lg">Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode switcher */}
        <View className="flex-row p-1 bg-gray-200 rounded-lg m-4">
          <TouchableOpacity
            className={`flex-1 p-2 rounded-md ${mode === "manual" ? "bg-white shadow" : ""}`}
            onPress={() => setMode("manual")}
          >
            <Text className="text-center font-semibold text-text">Manual Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-2 rounded-md ${mode === "search" ? "bg-white shadow" : ""}`}
            onPress={() => setMode("search")}
          >
            <Text className="text-center font-semibold text-text">Search Database</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          {mode === "manual" && (
            <View className="space-y-4 pb-8">
              <View>
                <Text className="text-base font-medium text-text-secondary mb-2">Food Name</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base"
                  placeholder="e.g., Almonds"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View>
                <Text className="text-base font-medium text-text-secondary mb-2">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {foodCategories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        className={`px-3 py-2 rounded-full ${category === cat ? "bg-primary" : "bg-gray-200"}`}
                        onPress={() => setCategory(cat)}
                      >
                        <Text className={`text-sm font-medium ${category === cat ? "text-white" : "text-text"}`}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <Text className="text-base font-medium text-text-secondary pt-2">Nutrition per 100g</Text>
              <View className="flex-row flex-wrap -mx-2">
                <View className="w-1/2 px-2 mb-4">
                  <Text className="font-medium text-text-secondary mb-1">Calories (kcal)</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base"
                    placeholder="e.g., 579"
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="numeric"
                  />
                </View>
                <View className="w-1/2 px-2 mb-4">
                  <Text className="font-medium text-text-secondary mb-1">Protein (g)</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base"
                    placeholder="e.g., 21"
                    value={protein}
                    onChangeText={setProtein}
                    keyboardType="numeric"
                  />
                </View>
                <View className="w-1/2 px-2 mb-4">
                  <Text className="font-medium text-text-secondary mb-1">Carbs (g)</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base"
                    placeholder="e.g., 22"
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                  />
                </View>
                <View className="w-1/2 px-2 mb-4">
                  <Text className="font-medium text-text-secondary mb-1">Fat (g)</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base"
                    placeholder="e.g., 49"
                    value={fat}
                    onChangeText={setFat}
                    keyboardType="numeric"
                  />
                </View>
                <View className="w-1/2 px-2 mb-4">
                  <Text className="font-medium text-text-secondary mb-1">Fiber (g)</Text>
                  <TextInput
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base"
                    placeholder="e.g., 12"
                    value={fiber}
                    onChangeText={setFiber}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity className="bg-primary p-4 rounded-lg mt-2" onPress={handleSave}>
                <Text className="text-white text-center text-lg font-semibold">Save Food</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === "search" && (
            <View className="pb-4">
              <View className="flex-row items-center gap-2 mb-4">
                <TextInput
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base"
                  placeholder="Search Open Food Facts..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleScanPress}>
                  <Feather name="camera" size={28} className="text-primary" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                className="bg-secondary p-3 rounded-lg mb-4"
                onPress={handleSearch}
                disabled={isSearching}
              >
                <Text className="text-white text-center font-semibold">Search</Text>
              </TouchableOpacity>

              {isSearching ? (
                <ActivityIndicator size="large" color="#3b82f6" />
              ) : (
                <View>
                  {searchResults.map((product) => (
                    <TouchableOpacity
                      key={product.code}
                      className="bg-white p-3 rounded-lg border border-gray-200 mb-2"
                      onPress={() => populateFormWithProduct(product)}
                    >
                      <Text className="font-semibold text-text">{product.product_name}</Text>
                      <Text className="text-sm text-text-secondary">
                        {Math.round(product.nutriments?.["energy-kcal_100g"] || 0)} kcal per 100g
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  )
}
