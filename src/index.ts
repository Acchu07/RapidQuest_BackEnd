import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import {retrieveData, insertData} from './db/dbData.js'
import {connectDB} from './db/dbConnect.js'

const port = process.env.PORT ?? "Initial Value is null or undefined";

const app = express()
app.use(express.static('public'))


// Need some sort of process for url unification current pipeline has a lot of rep look up online on it
// app.use(cors({
//     origin: "http://localhost:5173", // replace with online whitelist later
// }));
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Hello World!')
})

app.get('/api/messages/:id', async (req: Request, res: Response) => {
    // ToDo Validation Middleware and Token Verification Middleware
    const data = await retrieveData()
    res.status(200).json(data)
})

app.post('/api/messages', async (req: Request, res: Response) => {
    // ToDO Validation Middleware
    const data = req.body
    await insertData(data)
    res.status(200).json(data) // Not good
})

app.listen(port, async () => {
    await connectDB()
    console.log(`Server started on port ${port}`)
})

export default app
