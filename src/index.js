import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" });
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server Running on Port : ${process.env.PORT}`);
    });
    console.log("MongoDB connected Succesfull");
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
