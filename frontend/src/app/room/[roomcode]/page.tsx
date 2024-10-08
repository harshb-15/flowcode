'use client';
import { Editor, OnMount } from '@monaco-editor/react';
import { useRef, useState } from 'react';
export default function RenderRoom({
    params,
}: {
    params: { roomcode: string };
}) {
    const editorRef = useRef<any>(null);
    const [codeOutput, setCodeOutput] = useState('');
    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };
    const getCode = () => {
        if (editorRef.current) {
            const code: string = editorRef.current.getValue();
            console.log(code);
            return code; // You can perform any action with the code here
        }
        return undefined;
    };
    const fetchData = async () => {
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
    return (
        <div>
            <button
                onClick={() => {
                    fetchData();
                }}
            >
                Run
            </button>
            <Editor
                height="80vh"
                defaultLanguage="python"
                defaultValue="print('hellooooworldd')"
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
