import { connectDB } from './db'
import app from './App';

connectDB();
app.listen(3000);
console.log('server on port 3000');
