import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import dotenv from "dotenv";


dotenv.config({
    path: "./.env"
})
const app = express();

app.use(
    cors({
        origin: ["https://timeless-elegance-frontend.onrender.com"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
)
app.options("*", cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/uploads", express.static("uploads"));



// Load the Swagger/OpenAPI spec file
const swaggerDocument = YAML.load('src/docs/swagger.yaml');

// Serve Swagger UI at a specific endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Import your error handler and user router
import { errorHandler } from './middlewares/error.middleware.js';
import userRouter from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import orderRoutes from './routes/order.routes.js'
import reviewRoutes from './routes/review.routes.js'
import cartRoutes from './routes/cart.routes.js'
import adminRoutes from "./routes/admin.routes.js";
import paymentRouter from "./services/payment.service.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/cart", cartRoutes)

app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/payment", paymentRouter);


app.use(errorHandler)


export {app}