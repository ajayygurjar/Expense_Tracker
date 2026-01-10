const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const keywordCategoryMap = {
  food: [
    "lunch",
    "dinner",
    "breakfast",
    "pizza",
    "burger",
    "hotel",
    "restaurant",
    "domino",
    "zomato",
    "swiggy",
  ],
  petrol: ["petrol", "diesel", "fuel", "pump"],
  travel: ["uber", "ola", "bus", "train", "flight", "cab", "auto"],
  shopping: ["amazon", "flipkart", "shopping", "clothes", "shoes", "mall"],
  entertainment: ["movie", "cinema", "netflix", "prime", "hotstar"],
  bills: ["electricity", "water", "mobile", "recharge", "wifi", "gas"],
  healthcare: ["doctor", "medicine", "hospital", "clinic"],
  education: ["fees", "college", "school", "course", "books"],
};

const localCategoryGuess = (description) => {
  const text = description.toLowerCase();

  for (const category in keywordCategoryMap) {
    if (
      keywordCategoryMap[category].some((keyword) => text.includes(keyword))
    ) {
      return category;
    }
  }

  return "others";
};

const suggestCategory = async (description) => {
  if (!description || description.trim().length < 3) return "others";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Task: Categorize expense. 
Examples: 
"Dinner at KFC" -> food
"Monthly WiFi" -> bills
Input: "${description}"
Suggest one: food, petrol, travel, shopping, entertainment, bills, healthcare, education, others. 
Reply only with the word.`,
    });

    return response.text.trim().toLowerCase();
  } catch (error) {
    console.warn("Gemini unavailable, using local category logic");
    return localCategoryGuess(description);
  }
};

module.exports = { suggestCategory };
