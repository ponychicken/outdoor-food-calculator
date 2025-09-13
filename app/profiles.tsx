"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from "react-native"
import type { NutritionProfile } from "../src/types"
import { useStorage } from "../src/hooks/useStorage"
import { ProfileCard } from "../src/components/ProfileCard"
import { ProfileForm } from "../src/components/ProfileForm"

export default function ProfilesScreen() {
  const [profiles, setProfiles] = useState<NutritionProfile[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProfile, setEditingProfile] = useState<NutritionProfile | undefined>()
  const storage = useStorage()

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    const loadedProfiles = await storage.getProfiles()
    setProfiles(loadedProfiles)
  }

  const handleSaveProfile = async (profile: NutritionProfile) => {
    await storage.saveProfile(profile)
    await loadProfiles()
    setShowForm(false)
    setEditingProfile(undefined)
  }

  const handleEditProfile = (profile: NutritionProfile) => {
    setEditingProfile(profile)
    setShowForm(true)
  }

  const handleDeleteProfile = (profileId: string) => {
    Alert.alert("Delete Profile", "Are you sure you want to delete this profile?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await storage.deleteProfile(profileId)
          await loadProfiles()
        },
      },
    ])
  }

  const handleCreateNew = () => {
    setEditingProfile(undefined)
    setShowForm(true)
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-text">Nutrition Profiles</Text>
          <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg" onPress={handleCreateNew}>
            <Text className="text-white font-semibold">+ New</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold text-text mb-3">Default Profiles</Text>
        {profiles
          .filter((p) => !p.isCustom)
          .map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}

        {profiles.some((p) => p.isCustom) && (
          <>
            <Text className="text-lg font-semibold text-text mb-3 mt-6">Custom Profiles</Text>
            {profiles
              .filter((p) => p.isCustom)
              .map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={handleEditProfile}
                  onDelete={handleDeleteProfile}
                />
              ))}
          </>
        )}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-background p-4">
          <ProfileForm
            profile={editingProfile}
            onSave={handleSaveProfile}
            onCancel={() => {
              setShowForm(false)
              setEditingProfile(undefined)
            }}
          />
        </View>
      </Modal>
    </View>
  )
}
