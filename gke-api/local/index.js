const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json({ limit: '15mb', extended: true }))

app.use(cors({ origin: true, optionsSuccessStatus: 200 }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', ['GET'])
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

app.get('/', (_req, res) => console.log('203 Ok') | res.sendStatus(203))
app.post('/', (_req, res) => console.log('201 Created') | res.sendStatus(201))
app.get('/fail', (_req, res) => console.log('500 ISE') | res.sendStatus(500))

const port = process.env.PORT || 3000
app.listen(port, console.log(`API @ ${port}`))