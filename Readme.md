# Getting Started

- Clone Repo | `git clone https://github.com/CanerSezgin/real-time-game-be.git`
- Install dependencies | npm install
- Run In Development Mode | `npm run dev`
- Build `npm run build`
- Run Server | `npm start`

# Endpoints (REST)

`GET /api/v1/games/:gameId`

- Returns game instance `IGameInstance`

`GET /api/v1/games`

- Returns all games

`POST /api/v1/games/join`

- Join game. If there is existing `pending` game, user joins as second player, if not user joins as first player.

# Socket.IO Events

`on` `join`

- Params: `gameId`
- Subscribes user into game channel in socket.io

`on` `play-game`

- Params: `gameId, selection, playerId`
- Send game selection, play round.

`emit | room based` `get-game`

- Return game instance `IGameInstance`

# Additional Notes

- I have left some `console.log`s in the code. These are only for giving you better illustration and more idea what exactly going on under the hood.
  Please, be aware of that these won't be in the code in production level application.

- Frontend / Backend urls are hardcodedly added into code(s).
  In production level apps, assigning these as environment variable would be suggested.

In default `Backend` runs at `http://localhost:4000`, `Frontend` runs at `http://localhost:3000`

- For the sake of simplicity, for game creation and storing games I am using `memory`. Which means when the server is reseted, all stored data will be lost. 

In order to persist data, it requires database implementation and it can be done without changing, the only thing that needs to be done is creating another `gameRepository implementation` which implements `IGameRepository`.