import app from "./server/app.js";

// Run the server!
const start = async () => {
  try {
    await app.listen(4000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
