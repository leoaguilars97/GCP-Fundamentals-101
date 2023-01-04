
const winston = require('winston')
const { LoggingWinston: GoogleTransport } = require('@google-cloud/logging-winston')
const expressWinston = require('express-winston') // ALMACENAR PETICIONES Y NOS VA A GENERAR UN MIDDLEWARE DE EXPRESS

const createLogger = () => {
  const transports = [new winston.transports.Console({ level: 'info' })]
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // export GOOGLE_APPLICATION_CREDENTIALS=${pwd}/service-account.json
    console.error('No hay un service account en el ambiente, guardarlo como env $GOOGLE_APPLICATION_CREDENTIALS=service-account.json')
    throw new Error()
  }

  transports.push(new GoogleTransport({
    enabled: true, // esta guarando cosas a stackdriver o no
    logName: 'default', // este es el nombre va a tomar tu DATASET
    resource: {
      type: 'generic_node', 
      labels: {
        node_id: 'mypicz',  // donde esta mi informacion -> SU
        location: 'default', // us-central1 -> el default del proyecto
        namespace: 'mypicz' // etiqueta para diferenciar logs
      }
    }
  }))

  const logger = winston.createLogger({
    level: 'info',
    transports
  })

  logger.info({
    message: 'Stackdriver inicializado'
  })

  // TOTALMENTE OPCIONAL PARA EL PROYECTO
  const requestLogger = expressWinston.logger({
    winstonInstance: logger
  })

  return { 
    logger,
    requestLogger
  }
}

const { logger, requestLogger } = createLogger()

const logEvent = (message, { status, action, startTime, ...rest}) =>  {
  const logFunc = status === 'FAILURE' ? logger.error : logger.info
  const responseTime = new Date().getTime() - startTime.getTime()
  const eventInfo = {
    ...rest,
    status,
    action,
    responseTime,
    type: 'EVENT'
  }

  logFunc(`${action} - ${message}`, eventInfo)
}

const logSuccess = (message, info) => {
  logEvent(message, {
    ...info,
    status: 'SUCCESS'
  })
}

const logFailure = (message, info) => {
  logEvent(message, {
    ...info,
    status: 'FAILURE'
  })
}


module.exports = {
  requestLogger,
  logger,
  logSuccess,
  logFailure
} 
