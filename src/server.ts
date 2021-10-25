import { hostname } from 'os'
import { createServer } from 'http'
import app from './app'
import { initSocket } from './drivers/socket'
import { config } from './config'

export const httpServer = createServer(app)

initSocket(httpServer)

httpServer.listen(config.port, () =>
  console.log(
    `✓ SERVER: Listening at http://${hostname()}:${config.port} in ${
      config.env
    } environment.`
  )
)
