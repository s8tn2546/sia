const app = require("./app");
const env = require("./config/env");
const connectDb = require("./config/db");

const bootstrap = async () => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Backend listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);
    process.exit(1);
  }
};

bootstrap();