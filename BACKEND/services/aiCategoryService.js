const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const keywordCategoryMap = {
  food: ["lunch", "dinner", "breakfast", "pizza", "burger", "hotel", "restaurant", "domino", "zomato", "swiggy"],
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
    if (keywordCategoryMap[category].some((keyword) => text.includes(keyword))) {
      return category;
    }
  }
  return "others";
};

const suggestCategory = async (description) => {
  console.log(`\n--- New Request: "${description}" ---`);

  if (!description || description.trim().length < 3) {
    console.log("Result: Short description, defaulting to 'others'");
    return { suggestedCategory: "others", source: "local" };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Task: Categorize this expense: "${description}". 
      Reply with ONLY one word from this list: ${Object.keys(keywordCategoryMap).join(", ")}, others.`,
    });

    const suggested = response.text.trim().toLowerCase();
    const validCategories = [...Object.keys(keywordCategoryMap), "others"];
    const finalCategory = validCategories.includes(suggested) ? suggested : "others";

    // SERVER CONSOLE LOG
    console.log(`>>> GEMINI SUCCESS: Categorized as [${finalCategory}]`);

    return {
      suggestedCategory: finalCategory,
      source: "gemini"
    };
  } catch (error) {
    // SERVER CONSOLE LOG
    console.warn(`>>> AI ERROR: ${error.message}`);
    
    const fallback = localCategoryGuess(description);
    console.log(`>>> LOCAL FALLBACK: Categorized as [${fallback}]`);

    return {
      suggestedCategory: fallback,
      source: "local"
    };
  }
};

module.exports = { suggestCategory };