import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { runContainer } from './dockerFiles/dockerHelper';
dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.post('/code-run', (req: Request, res: Response) => {
    var data: { message: any } = req.body;
    console.log('received');
    setCodeToFile(
        data.message,
        '/home/harsh/Documents/PyCpp/web/inter/flowcode/backend/src/script.py'
    );
    runContainer()
    res.send({ message: req.body.message });
});

app.listen(port, () => {
    console.log(`[server]: Server is at http://localhost:${port}`);
});

function setCodeToFile(code: string, filePath: string) {
    fs.writeFile(filePath, code, (err) => {
        if (err) {
            console.log(err.message);
            return;
        }
        console.log('File Written');
    });
}
