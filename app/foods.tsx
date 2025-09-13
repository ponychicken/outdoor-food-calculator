"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native"
import type { FoodItem } from "../src/types"
import { useStorage } from "../src/hooks/useStorage"
import { FoodCard } from "../src/components/FoodCard"
import { Feather } from "@expo/vector-icons"
import { AddFoodModal } from "../src/components/AddFoodModal"

export default function FoodsScreen() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const storage = useStorage()

  const categories = ["all", "grains", "nuts", "meat", "dairy", "vegetables", "other"]

  useEffect(() => {
    loadFoods()
  }, [])

  useEffect(() => {
    filterFoods()
  }, [foods, searchQuery, selectedCategory])

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

  const handleDeleteFood = (foodId: string) => {
    Alert.alert("Delete Food", "Are you sure you want to delete this food item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await storage.deleteFood(foodId)
          await loadFoods()
        },
      },
    ])
  }

  const handleFoodAdded = () => {
    loadFoods()
    setIsAddModalVisible(false)
  }

  return (
    <View className="flex-1 bg-background">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-text">Food Database</Text>
          <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
            <Feather name="plus-circle" size={28} className="text-primary" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-text"
          placeholder="Search foods..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`px-3 py-2 rounded-full ${selectedCategory === category ? "bg-primary" : "bg-gray-200"}`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text className={`text-sm font-medium ${selectedCategory === category ? "text-white" : "text-text"}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4">
        {filteredFoods.map((food) => (
          <FoodCard key={food.id} food={food} onDelete={food.isCustom ? handleDeleteFood : undefined} />
        ))}

        {filteredFoods.length === 0 && (
          <Text className="text-center text-text-secondary mt-8">No foods found matching your criteria</Text>
        )}
      </ScrollView>

      <AddFoodModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onFoodAdded={handleFoodAdded}
      />
    </View>
  )
}
