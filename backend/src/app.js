import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import helmet from 'helmet';
import cors from 'cors'

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

app.use(helmet())

// Load the Swagger/OpenAPI spec file
const swaggerDocument = YAML.load('src/docs/swagger.yaml'); // Adjust path if your swagger.yaml is in a different folder, e.g., './docs/swagger.yaml'

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

app.use("/api/v1/users", userRouter)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/cart", cartRoutes)


app.use(errorHandler)


export {app}