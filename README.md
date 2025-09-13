# Outdoor Food Calculator

A Expo React Native app for calculating nutritional requirements for outdoor activities like hiking, camping, and backpacking. Plan your meals using customizable nutrition profiles.

## Features

### Food Database
- database of common outdoor foods with nutrition information
- Add custom food items
- d import foods from OpenNutritionFacts

###  Nutrition Profiles
- Pre-built profiles for different activity levels
- Create custom profiles with personalized calorie and macronutrient targets

### Calculator
- Real-time nutrition calculations as you add foods
- Instant feedback on nutritional contents (calories, protein, carbs, fat, and fiber)
- Save meal calculations with custom names

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Setup
1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd outdoor-food-calculator
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npx expo start
   \`\`\`

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Usage

### Getting Started
1. **Select a Profile**: Choose from pre-built activity profiles or create a custom one
2. **Add Foods**: Browse the food database and add items to your calculation
3. **Adjust Amounts**: Use the +/- controls to set precise quantities
4. **Monitor Progress**: Watch the live gauges to see how well you're meeting nutrition targets
5. **Save Calculations**: Save your meal plans with descriptive names for future reference

### Creating Custom Profiles
- Navigate to the Profiles tab
- Tap "Add Custom Profile"
- Enter your details: name, age, weight, activity level
- Set custom calorie and macronutrient targets if desired
- Save and select your new profile

### Adding Custom Foods
- Go to the Foods tab
- Tap "Add Custom Food"
- Enter complete nutritional information per 100g
- Categorize your food for easy searching
- Use in calculations immediately

## Technical Details

### Architecture
- **Framework**: Expo SDK 51 with React Native
- **Language**: TypeScript for type safety
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Storage**: AsyncStorage for local data persistence
- **Navigation**: Expo Router with file-based routing


## Contributing

Happy about PRs

## License

This project is licensed under the AGPL License

## Support

For questions, issues, or feature requests, please open an issue on the GitHub repository.
