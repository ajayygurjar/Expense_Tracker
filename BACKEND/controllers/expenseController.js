const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({
      amount,
      description,
      category
    });

    return res.status(201).json({ 
      message: "Expense added successfully",
      expense 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ expenses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpenses=async(req,res)=>{
  try {
    const {id}=req.params;
    const expense=await Expense.findByPk(id);
    if(!expense){
      return res.status(404).json({message:"Expense not found"});
    }
    await expense.destroy();
    return res.status(200).json({message:"expense deleted successfully"})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:'Server error'})
  }

}