const { suggestCategory } = require("../services/aiCategoryService");

exports.getSuggestedCategory = async (req, res) => {
  try {
    const { description } = req.body;
    const result = await suggestCategory(description);

    return res.status(200).json(result);
  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(200).json({
      suggestedCategory: "others",
      source: "error"
    });
  }
};