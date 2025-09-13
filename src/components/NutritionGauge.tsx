import { View, Text } from "react-native"
import Svg, { Circle } from "react-native-svg"

interface NutritionGaugeProps {
  label: string
  current: number
  target: number
  unit: string
  color: string
  size?: number
}

export function NutritionGauge({ label, current, target, unit, color, size = 80 }: NutritionGaugeProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getStatusColor = () => {
    if (percentage >= 90) return "#16a34a" // green
    if (percentage >= 70) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  const statusColor = getStatusColor()

  return (
    <View className="items-center">
      <View className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <Svg width={size} height={size} className="absolute">
          {/* Background circle */}
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth="4" fill="transparent" />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={statusColor}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        <Text className="text-base font-bold text-text text-center">{Math.round(percentage)}%</Text>
      </View>

      <Text className="text-sm font-medium text-text mt-2 text-center">{label}</Text>
      <Text className="text-xs text-text-secondary text-center">
        {Math.round(current)}/{Math.round(target)}
        {unit}
      </Text>
    </View>
  )
}
