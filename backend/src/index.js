import dotenv from "dotenv"
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 8001;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server Is Running On Port ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB Connection ERROR :" ,err);
    
})
