require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {sequelize} = require("./models");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes=require('./routes/expenseRoutes');
const paymentRoutes = require("./routes/paymentRoutes"); 
const premiumRoutes=require('./routes/premiumRoutes');
const aiCategoryRoutes = require("./routes/aiCategoryRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

app.use(cors());
app.use(express.json());

 
app.use("/api", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/premium',premiumRoutes);
app.use("/api/ai", aiCategoryRoutes);
app.use("/api/password", passwordRoutes);

sequelize.sync().then(()=>{
   console.log("Database connected & tables created");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });


