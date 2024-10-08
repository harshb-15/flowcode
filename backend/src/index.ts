import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { createNewContainer, editFileInContainer, getContainerFromId, runFileInContainer } from './dockerFiles/dockerHelper';
import { Container } from 'dockerode';
dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/create-room', async (req: Request, res: Response) =>
{
    const container = await createNewContainer();
    res.json({ containerId: container.id.substring(0,12) });
})

app.post('/run-code/:containerId', async (req: Request, res: Response) =>
{
    const containerId: string = req.params.containerId;
    const fileData: string = req.body.message;
    const container: Container = getContainerFromId(containerId);
    await editFileInContainer(container, fileData);
    const output = await runFileInContainer(container);
    res.json({ output });
})

app.listen(port, () => {
    console.log(`[server]: Server is at http://localhost:${port}`);
});
