import { connectionDB } from "./db";
import app from "./app";

connectionDB();
app.listen(3000);
console.log('server opened port 3000');