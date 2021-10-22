import { createServer } from 'http';
import app from './app';
import { initSocket } from './socket';

const port = process.env.PORT || 4000;

export const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
