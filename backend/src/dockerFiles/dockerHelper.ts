import Docker, { Container } from 'dockerode';

// Constants
const docker = new Docker();
const defaultScriptPath: string = '/app/script.py';
const defaultStarterPath = {
    python: '/home/harsh/Documents/PyCpp/web/inter/flowcode/backend/src/script.py',
};
const defaultContainerOptions: Docker.ContainerCreateOptions = {
    Image: 'python:3.9',
    Cmd: ['tail', '-f', '/dev/null'],
    Tty: true,
    HostConfig: {
        Binds: [`${defaultStarterPath.python}:${defaultScriptPath}`],
    },
};

// Helper Functions
export function createNewContainer(
    containerOptions: Docker.ContainerCreateOptions = defaultContainerOptions
) {
    try {
        const container = docker.createContainer(containerOptions);
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
        await container.start();
        const command = [
            'sh',
            '-c',
            `echo "${fileData.replace(/"/g, '\\"')}" > /app/script.py`,
        ];

        // Execute the command inside the container to write the new data to the file
        const execEntity = await container.exec({
            Cmd: command,
            AttachStdout: true,
            AttachStderr: true,
        });
        await execEntity.start({ Detach: false, Tty: false });
        await container.stop();

    } catch (err) {
        throw new Error("Error Editing File in container id: " + container.id + "\n" + err.message);
    }
}

export async function runFileInContainer(container: Docker.Container)
{
    try {
        await container.start();
        const command = ['python', '/app/script.py'];

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
        await container.stop();
        output = output.trim(); // Remove leading/trailing whitespace
        output = output.replace(/[^\x20-\x7E\n]/g, '');
        // output = output.replace(/\n/g, '<br>');
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
            Cmd: ['cat', '/app/script.py'], // Command to read the file
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
        output = output.trim(); // Remove leading/trailing whitespace
        output = output.replace(/[^\x20-\x7E\n]/g, '');
        return output.substring(1); // Return the fetched output
    } catch (error) {
        console.error('Error fetching file:', error);
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
