import express from 'express';
import { retrieveData, insertData } from './db/dbData.js';
import { connectDB } from './db/dbConnect.js';
const port = process.env.PORT ?? "Initial Value is null or undefined";
const app = express();
app.use(express.static('public'));
// app.use(cors({
//     origin: "http://localhost:5173", // replace with online whitelist later
// }));
app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json('Hello World!');
});
app.get('/api/messages/:id', async (req, res) => {
    // ToDo Validation Middleware and Token Verification Middleware
    const data = await retrieveData();
    res.status(200).json(data);
});
app.post('/api/messages', async (req, res) => {
    // ToDO Validation Middleware
    const data = req.body;
    await insertData(data);
    res.status(200).json(data); // Not good
});
app.listen(port, async () => {
    await connectDB();
    console.log(`Server started on port ${port}`);
});
export default app;
