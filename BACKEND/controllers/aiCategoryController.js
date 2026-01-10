const { suggestCategory } = require("../services/aiCategoryService");


exports.getSuggestedCategory = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length < 3) {
      return res.status(200).json({ suggestedCategory: "others" });
    }

    const suggestedCategory = await suggestCategory(description);

    return res.status(200).json({
      suggestedCategory: suggestedCategory || "others",
    });
  } catch (error) {
    
    console.error("AI Controller Error:", error);

    return res.status(200).json({
      suggestedCategory: "others",
    });
  }
};
