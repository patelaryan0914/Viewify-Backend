import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import chalk from "chalk";
dotenv.config({ path: "./.env" });
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(chalk.green(`Server Running on Port : ${process.env.PORT}`));
    });
    console.log(chalk.green("MongoDB connected Succesfull"));
  })
  .catch((err) => {
    console.log(chalk.red("MongoDB Connection Failed", err));
  });
