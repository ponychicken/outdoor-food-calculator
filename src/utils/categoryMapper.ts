import type { FoodItem } from "../types"

const categoryMap: Record<string, FoodItem["category"]> = {
  // Meats
  "en:meats": "meat",
  "en:fish-and-seafood": "meat",
  "en:poultry": "meat",

  // Nuts
  "en:nuts-and-nut-products": "nuts",

  // Dairies
  "en:dairies": "dairy",
  "en:cheeses": "dairy",
  "en:milks": "dairy",
  "en:yogurts": "dairy",

  // Vegetables
  "en:plant-based-foods-and-beverages": "vegetables",
  "en:plant-based-foods": "vegetables",
  "en:fruits-and-vegetables-based-foods": "vegetables",
  "en:vegetables-based-foods": "vegetables",
  "en:fruits-based-foods": "vegetables",

  // Grains
  "en:cereals-and-potatoes": "grains",
  "en:cereals-and-their-products": "grains",
  "en:breads": "grains",
  "en:breakfast-cereals": "grains",
  "en:pastas": "grains",
}

export const mapCategory = (tags: string[]): FoodItem["category"] => {
  if (!tags || tags.length === 0) {
    console.log("[CategoryMapper] No tags provided, defaulting to 'other'.")
    return "other"
  }

  for (const tag of tags) {
    if (categoryMap[tag]) {
      console.log(`[CategoryMapper] Matched tag "${tag}" to category "${categoryMap[tag]}".`)
      return categoryMap[tag]
    }
  }

  console.log(`[CategoryMapper] No match found for tags: ${JSON.stringify(tags)}. Defaulting to 'other'.`)
  return "other"
}
