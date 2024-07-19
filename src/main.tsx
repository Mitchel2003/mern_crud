import ReactDOM from 'react-dom/client'
import React from 'react'
import App, { app } from './App'
import './index.css'

import { connectDB } from "./db.ts";

connectDB();
app.listen(3000);
console.log('server on port 3000');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)