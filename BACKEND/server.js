require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {sequelize} = require("./models");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes=require('./routes/expenseRoutes')

const app = express();

app.use(cors());
app.use(express.json());

 
app.use("/api", authRoutes);
app.use("/api/expenses", expenseRoutes);


sequelize.sync({ alter: true }).then(()=>{
   console.log("Database connected & tables created");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });


