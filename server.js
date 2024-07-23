import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";
const startServer = async () => {

  //connect database
  await connectDB()
  
  const PORT = config.port || 3000;

  app.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
  });
};
startServer();
