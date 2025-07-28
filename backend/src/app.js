import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Import your error handler and user router
import { errorHandler } from './middlewares/error.middleware.js';
import userRouter from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import orderRoutes from './routes/order.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/orders", orderRoutes)


app.use(errorHandler)


export {app}