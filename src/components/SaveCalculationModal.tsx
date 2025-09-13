"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native"

import { useEffect } from "react"

interface SaveCalculationModalProps {
  visible: boolean
  initialName?: string
  onClose: () => void
  onSave: (name: string) => void
}

export function SaveCalculationModal({ visible, initialName = "", onClose, onSave }: SaveCalculationModalProps) {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    if (visible) {
      setName(initialName)
    }
  }, [visible, initialName])

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for the calculation.")
      return
    }
    onSave(name.trim())
  }

  const handleClose = () => {
    setName("")
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View className="flex-1 bg-background p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-text">Save Calculation</Text>
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-primary text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-base font-medium text-text-secondary mb-2">Calculation Name</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-text text-base mb-6"
          placeholder="e.g., Summer Trip"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <TouchableOpacity className="bg-primary p-4 rounded-lg" onPress={handleSave}>
          <Text className="text-white text-center text-lg font-semibold">Save</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}
