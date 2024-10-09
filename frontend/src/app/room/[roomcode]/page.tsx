'use client';
import { Editor, OnMount } from '@monaco-editor/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
export default function RenderRoom({
    params,
}: {
    params: { roomcode: string };
    })
{
    const [fileData, setFileData] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const nextRouter = useRouter();
    const editorRef = useRef<any>(null);
    const [codeOutput, setCodeOutput] = useState('');
    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };
    const getCode = () => {
        if (editorRef.current) {
            const code: string = editorRef.current.getValue();
            return code; 
        }
        return undefined;
    };
    const runCode = async () => {
        try {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            var raw = JSON.stringify({
                message: getCode(),
            });

            const response = await fetch(
                `http://127.0.0.1:3001/run-code/${params.roomcode}`,
                {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow',
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data);
            setCodeOutput(data.output);
        } catch (err) {
            console.log('Not successful');
            console.log(err);
        }
    };
    const fetchFileData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3001/get-file-data/${params.roomcode}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result: string = (await response.json()).fileData;
            setFileData(result);
            
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchFileData();
    }, []);
    if (loading) return <div>Fetching room details...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div>
            <button
                onClick={() => {
                    runCode();
                }}
            >
                Run
            </button>
            <Editor
                height="80vh"
                defaultLanguage="python"
                value={fileData}
                theme="vs-dark"
                onMount={handleEditorDidMount}
            />
            <p>Output:</p>
            <pre>
                <code>
                    {codeOutput}
                </code>
            </pre>
        </div>
    );
}
