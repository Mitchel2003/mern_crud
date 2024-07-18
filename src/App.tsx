import express, { Express } from 'express';
import cors from 'cors';

const app: Express = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
)
function App() {
  return (
    <>
      <div>
        <p>something</p>
      </div>
    </>
  )
}

export default App