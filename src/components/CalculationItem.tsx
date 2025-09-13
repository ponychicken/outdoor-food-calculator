import { Feather } from "@expo/vector-icons"
import { View, Text, TouchableOpacity, TextInput } from "react-native"
import type { CalculationItem as CalculationItemType, FoodItem } from "../types"

interface CalculationItemProps {
  item: CalculationItemType
  food: FoodItem
  onUpdateAmount: (foodId: string, amount: number) => void
  onRemove: (foodId: string) => void
}

export function CalculationItem({ item, food, onUpdateAmount, onRemove }: CalculationItemProps) {
  const handleAmountChange = (text: string) => {
    const amount = Number.parseFloat(text) || 0
    onUpdateAmount(item.foodId, amount)
  }

  const adjustAmount = (delta: number) => {
    const newAmount = Math.max(0, item.amount + delta)
    onUpdateAmount(item.foodId, newAmount)
  }

  const multiplier = item.amount / 100
  const itemCalories = Math.round(food.calories * multiplier)
  const itemProtein = Math.round(food.protein * multiplier * 10) / 10
  const proteinPercentage = food.calories > 0 ? Math.round(((food.protein * 4) / food.calories) * 100) : 0

  return (
    <View className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-text">{food.name}</Text>
          <Text className="text-sm text-text-secondary">
            {itemCalories} cal, {proteinPercentage}% protein
          </Text>
        </View>
        <TouchableOpacity onPress={() => onRemove(item.foodId)}>
          <Feather name="trash-2" size={20} className="text-red-500" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium text-text">Amount (g):</Text>

        <View className="flex-row items-center">
          <TouchableOpacity
            className="bg-gray-200 w-8 h-8 rounded items-center justify-center"
            onPress={() => adjustAmount(-100)}
          >
            <Text className="text-text font-bold">-</Text>
          </TouchableOpacity>

          <TextInput
            className="mx-2 text-center text-lg font-semibold text-text border-b border-gray-300 min-w-16"
            value={item.amount.toString()}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />

          <TouchableOpacity
            className="bg-gray-200 w-8 h-8 rounded items-center justify-center"
            onPress={() => adjustAmount(100)}
          >
            <Text className="text-text font-bold">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
