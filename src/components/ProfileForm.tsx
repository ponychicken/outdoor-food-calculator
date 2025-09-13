"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import type { NutritionProfile } from "../types"

interface ProfileFormProps {
  profile?: NutritionProfile
  onSave: (profile: NutritionProfile) => void
  onCancel: () => void
}

export function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name || "")
  const [calories, setCalories] = useState(profile?.caloriesPerDay.toString() || "")
  const [proteinPercent, setProteinPercent] = useState(profile?.proteinPercent.toString() || "")
  const [fatPercent, setFatPercent] = useState(profile?.fatPercent.toString() || "")
  const [fiberPer1000cal, setFiberPer1000cal] = useState(profile?.fiberPer1000cal.toString() || "")

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a profile name")
      return
    }

    const numCalories = Number.parseFloat(calories)
    const numProteinPercent = Number.parseFloat(proteinPercent)
    const numFatPercent = Number.parseFloat(fatPercent)
    const numFiberPer1000cal = Number.parseFloat(fiberPer1000cal)

    if (isNaN(numCalories) || isNaN(numProteinPercent) || isNaN(numFatPercent) || isNaN(numFiberPer1000cal)) {
      Alert.alert("Error", "Please enter valid numbers for all nutrition values")
      return
    }

    const carbsPercent = 100 - numProteinPercent - numFatPercent
    if (carbsPercent < 0) {
      Alert.alert("Error", "Protein and Fat percentages cannot add up to more than 100%.")
      return
    }

    const newProfile: NutritionProfile = {
      id: profile?.id || `custom-${Date.now()}`,
      name: name.trim(),
      caloriesPerDay: numCalories,
      proteinPercent: numProteinPercent,
      carbsPercent,
      fatPercent: numFatPercent,
      fiberPer1000cal: numFiberPer1000cal,
      isCustom: true,
    }

    onSave(newProfile)
  }

  return (
    <View className="p-4 bg-white rounded-lg">
      <Text className="text-xl font-bold text-text mb-4">{profile ? "Edit Profile" : "Create New Profile"}</Text>

      <View className="mb-4">
        <Text className="text-sm font-medium text-text mb-1">Profile Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-text"
          value={name}
          onChangeText={setName}
          placeholder="Enter profile name"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-text mb-1">Calories per day</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-text"
          value={calories}
          onChangeText={setCalories}
          placeholder="2500"
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-text mb-1">Protein (% of calories)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-text"
          value={proteinPercent}
          onChangeText={setProteinPercent}
          placeholder="20"
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-text mb-1">Fat (% of calories)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-text"
          value={fatPercent}
          onChangeText={setFatPercent}
          placeholder="30"
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium text-text mb-1">Carbs (% of calories)</Text>
        <Text className="border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-text-secondary">
          {Math.max(0, 100 - (Number(proteinPercent) || 0) - (Number(fatPercent) || 0))}
        </Text>
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-text mb-1">Fiber per day (g / 1000 calories)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 text-text"
          value={fiberPer1000cal}
          onChangeText={setFiberPer1000cal}
          placeholder="12"
          keyboardType="numeric"
        />
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity className="flex-1 bg-gray-500 p-3 rounded-lg" onPress={onCancel}>
          <Text className="text-white text-center font-semibold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-primary p-3 rounded-lg" onPress={handleSave}>
          <Text className="text-white text-center font-semibold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
