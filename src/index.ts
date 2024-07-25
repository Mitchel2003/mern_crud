import { connectionDB } from "./db";
import { PORT } from "./config";
import app from "./app";

connectionDB();
app.listen(PORT);
console.log(`Server initialized on port ${PORT}`);