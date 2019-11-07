import express from 'express'
import cors from 'cors'
import narouMiddleware from 'narou-middleware'

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

const app = express()
app.use(cors())
app.use(narouMiddleware({ r18: true }))
const listener = app.listen(port, host, () => {
  console.log('listening on', listener.address().port)
})
