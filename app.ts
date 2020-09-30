import express from 'express';
import * as http from 'http';
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at port ${port}`)
});

server.listen(port, () => {
    console.log(`Server running at port ${port}`)
});