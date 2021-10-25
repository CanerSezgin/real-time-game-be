import SocketIO from 'socket.io'
import { Server } from 'http'

import Player from '../entities/types/Player'
import GameSelection from '../entities/types/GameSelection'

import { gameService } from '../services/game'

export const initSocket = (httpServer: Server): void => {
  const io = new SocketIO.Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    },
  })

  io.on('connection', async (socket) => {
    console.log('New client connected', socket.id)

    socket.on('join', async (gameId) => {
      console.log('joining into game channel', gameId)
      const game = await gameService.getGameById(gameId)

      socket.join(gameId)
      io.in(gameId).emit('get-game', game.instance)
    })

    socket.on(
      'play-game',
      async (gameId, selection: GameSelection, playerId: Player['id']) => {
        const game = await gameService.getGameById(gameId)

        const isPlayerValid = game.playingPlayerValidation(playerId)
        if (isPlayerValid) {
          game.play(selection)
          io.in(gameId).emit('get-game', game.instance)
        } else {
          console.log('Invalid playerId is trying to play.')
        }
      }
    )

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id)
    })
  })
}
