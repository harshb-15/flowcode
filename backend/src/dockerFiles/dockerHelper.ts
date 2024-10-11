import Docker, { Container } from 'dockerode';
import fs from 'fs';
// Constants
const docker = new Docker();
const defaultScriptPath: string = '/home/script.py';
const defaultStarterPath = {
    python: '/home/harsh/Documents/PyCpp/web/inter/flowcode/backend/src/script.py',
};
const defaultContainerOptions: Docker.ContainerCreateOptions = {
    Image: 'python:3.9',
    Cmd: ['tail', '-f', '/dev/null'],
    Tty: true,
    // HostConfig: {
    //     Binds: [`${defaultStarterPath.python}:${defaultScriptPath}`],
    // },
};
// Helper Functions
export async function createNewContainer(
    containerOptions: Docker.ContainerCreateOptions = defaultContainerOptions
) {
    try {
        const container = await docker.createContainer(containerOptions);
        let defData = ""
        fs.readFile(defaultStarterPath.python, 'utf-8', (err, data) => { defData = data; })
        await container.start();

        // Step 3: Create a command to add the file to the container
        const exec = await container.exec({
            AttachStdout: true,
            AttachStderr: true,
            Cmd: [
                'sh',
                '-c',
                `echo "${defData.replace(/"/g, '\\"')}" > ${defaultScriptPath}`,
            ],
        });

        const stream = await exec.start({ Detach: false, Tty: false });

        // Collect output (optional)
        let output = '';
        stream.on('data', (chunk) => {
            output += chunk.toString();
        });

        // Wait for the stream to end
        await new Promise((resolve) => stream.on('end', resolve));
        await container.stop();
        return container;
    } catch (err) {
        throw new Error('Error While Creating a new Container: ' + err.message);
    }
}

export function getContainerFromId(containerId: string) {
    try {
        return docker.getContainer(containerId);
    } catch (err) {
        throw new Error('Error Getting Container From ID: ' + err.message);
    }
}

export async function editFileInContainer(container: Docker.Container, fileData: string)
{
    try {
        const command = [
            'sh',
            '-c',
            `echo "${fileData.replace(/"/g, '\\"')}" > ${defaultScriptPath}`,
        ];

        // Execute the command inside the container to write the new data to the file
        const execEntity = await container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true,
        });
        await execEntity.start({ Detach: false, Tty: false });

    } catch (err) {
        throw new Error("Error Editing File in container id: " + container.id + "\n" + err.message);
    }
}

export async function runFileInContainer(container: Docker.Container)
{
    try {
        const command = ['python', defaultScriptPath];

        // Execute the command inside the container to write the new data to the file
        const idk = await container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true,
        });
        const stream = await idk.start({ Detach: false, Tty: false });
        let output = '';
        stream.on('data', (chunk) => {
            output += chunk.toString();
        });
        await new Promise((resolve) => stream.on('end', resolve));
        output = output.slice(8)
        return output;
    } catch (err) {
        throw new Error("Error Running File In Container: \n" + err.message);
    }
}

export async function getFileDataFromContainer(container: Container) {
    try {
        // Use exec to run a command that reads the file
        await container.start()
        const exec = await container.exec({
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['cat', defaultScriptPath], // Command to read the file
        });

        const stream = await exec.start({ Detach: false, Tty: false });
        let output = '';

        // Collect data from stdout
        stream.on('data', (chunk) => {
            output += chunk.toString();
        });

        // Wait for the stream to end
        await new Promise((resolve) => stream.on('end', resolve));
        await container.stop();
        output = output.slice(8);
        return output; 
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}

export async function isContainerRunning(container: Docker.Container) {
    try {
        const data = await container.inspect();
        return data.State.Running;
    } catch (error) {
        console.error('Error inspecting container:', error);
        return false;
    }
}

export async function runContainer(
    container: Docker.Container,
    // scriptPath: string = defaultScriptPath
) {
    try {
        container.start();
        let stream = await (container.attach({
            stream: true,
            stdout: true,
            stderr: true,
        }));
        return new Promise<string>((resolve, reject) => {
            let output = '';

            // Listen to data from the stream
            stream.on('data', (chunk) => {
                output += chunk.toString(); // Append the chunk to the output string
            });

            // Handle error if the stream fails
            stream.on('error', (err) => {
                reject(err);
            });

            // When the stream ends (container stops)
            stream.on('end', () => {
                resolve(output); // Return the output string
            });
        });
    } catch (err) {
        console.log('Run Container Error: ' + err.message);
    }
}
