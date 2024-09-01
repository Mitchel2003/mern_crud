import { connectionDB } from "./db";
import app from "./app";
import "dotenv/config"

connectionDB();
app.listen(process.env.PORT);
console.log(`Server initialized on port ${process.env.PORT}`);