import Docker from 'dockerode'
import path from 'path'

const docker = new Docker()

export async function runContainer ()
{
    try {
        const scriptPath = "/home/harsh/Documents/PyCpp/web/inter/FlowCode/backend/src/script.py";
        const container = docker.createContainer({
            Image: 'python:3.9',
            Cmd: ['python', '/app/script.py'],
            Tty: true,
            HostConfig: {
                Binds: [`${scriptPath}:/app/script.py`],
                AutoRemove: true, 
            },
        }); 
        (await container).start()
        const stream = (await container).attach({ stream: true, stdout: true, stderr: true });
        (await stream).pipe(process.stdout);
    } catch (err) {
        console.log("Run Container Error: " + err.message);
    }
}
