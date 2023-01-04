const express = require('express')
const app = express()
const cors = require('cors')
const gravatar = require('gravatar')

const { 
  logSuccess,   // ESTE ES UN MANEJADOR DE EVENTOS QUE TUVIERON EXITO
  logFailure,   // ESTE ES UN MANEJADOR DE EVENTOS QUE FALLARON 
  requestLogger // ESTE ES UN EXPRESS-WINSTON LOGGER => SIRVE PARA LOGGEAR LAS PETICIONES
} = require('./logger/logger')

app.use(express.json({ limit: '15mb', extended: true }))

app.use(cors({ origin: true, optionsSuccessStatus: 200 }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', ['GET'])
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

// Express-Winston => CADA PETICION LA VOY A LOGGEAR
// /home -> HTTP GET /home
app.use(requestLogger)

const randomInt = (min, max) => Math.ceil(Math.random() * (max - min) + min)
const sleep = ms => new Promise(res => setTimeout(res, ms))

app.get('/', async (req, res) => {
  const min = req.query.min || 100
  const max = req.query.max || 2500
  const errorProportion = req.query.errorProportion || 4 // 25% -> 1-> 100% 
  const waitTime = randomInt(min, max) // CUANTO VOY A ESPERAR
  const startTime = new Date() // 

  // simulando lo que realmente haria una api
  await sleep(waitTime) // 1000 ms, 2500 ms
  const isError = randomInt(0, 100) % errorProportion === 0

  // 
  const eventInfo = {
    action: 'GETTING /',
    min, max, errorProportion, waitTime, startTime
  }

  if (isError) {
    logFailure(`Failed getting request`, eventInfo) // LOG DEL EVENTO A STACKDRIVER
    return res.sendStatus(500)
  }

  logSuccess(`Request accepted`, eventInfo) // LOG DEL EVENTO A STACKDRIVER

  res.sendStatus(200)
})

const htmlTemplate = `
<html><body><img src="$IMAGE_URL" /></body></html>
`

app.get('/profile/:email', async (req, res) => {
  const email = req.params.email
  const startTime = new Date()
  const eventInfo = {
    email, startTime, action: 'GETTING PROFILE'
  }
  try {
    const gurl = await gravatar.url(email) // gravatar.io/1234lkjlksalf
    logSuccess('Successfully retrieved profile', { ...eventInfo, gurl })
    return res.send(htmlTemplate.replace('$IMAGE_URL', gurl))
  }
  catch (e) {
    console.error(e)
    logFailure(e.message || 'An error happened while fetching the profile', eventInfo)
    return res.sendStatus(500)
  }
})

const port = process.env.PORT || 3000
app.listen(port, console.log(`API @ ${port}`))