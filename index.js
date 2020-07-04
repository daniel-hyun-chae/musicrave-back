// catch global error
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! shutting down...");
  console.log(err.name, err.message, err);
  process.exit(1);
});

// require config -> set environment variables
require("./utils/config");
const app = require("./app");

// set port and listen to a port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
