require("dotenv").config();
const express = require("express");
const errorHandler = require("./middlewares/error");
const notFoundHandler = require("./middlewares/not-found");
const authenticate = require("./middlewares/authenticate");
const optionalAuthenticate = require("./middlewares/optionalAuthenticate");
const admin = require("./middlewares/admin");
const adminRoutes = require("./routes/admin-route");
const authRoutes = require("./routes/auth-route");
const orderRoutes = require("./routes/order-route");
const productRoutes = require("./routes/product-route");
const userRoutes = require("./routes/user-route");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", authenticate, userRoutes);
app.use("/product", optionalAuthenticate, productRoutes);
app.use("/order", authenticate, orderRoutes);

app.use("/admin", authenticate, admin, adminRoutes);

app.use(errorHandler);
app.use("*", notFoundHandler);

const port = process.env.PORT;
app.listen(port || 8000, () => console.log("Server is running on port 8000"));
