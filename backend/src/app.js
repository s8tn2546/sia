const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const loggerMiddleware = require("./middleware/logger.middleware");
const authMiddleware = require("./middleware/auth.middleware");
const { notFoundMiddleware, errorMiddleware } = require("./middleware/error.middleware");

const demandRoutes = require("./routes/demand.routes");
const delayRoutes = require("./routes/delay.routes");
const routeRoutes = require("./routes/route.routes");
const chatRoutes = require("./routes/chat.routes");
const insightsRoutes = require("./routes/insights.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const supplyRoutes = require("./routes/supply.routes");
const trackingRoutes = require("./routes/tracking.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(loggerMiddleware);
app.use(authMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend healthy" });
});

app.use("/api/demand", demandRoutes);
app.use("/api/delay", delayRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/supply", supplyRoutes);
app.use("/api/track", trackingRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
