import express from 'express'
import type { Request, Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.get('/api/messages/:id', (req: Request, res: Response) => {
    // Retrieve all messages from db and send to front end but is that even a good idea? what if millions of messages?
    res.send('on the given path')
})

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

export default app
