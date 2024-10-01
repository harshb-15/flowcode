'use client';
import { Editor, OnMount } from '@monaco-editor/react';
// import React from 'react';
import { useRef } from 'react';

export default function MyEditor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorRef = useRef<any>(null);

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
            const response = await fetch('http://localhost:3001/code-run', {
                method: 'POST', // Change to POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: getCode() }), 
            }); 
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.log("Not successful")
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
                height="90vh"
                defaultLanguage="python"
                defaultValue="print('hellooooworldd')"
                theme="vs-dark"
                onMount={handleEditorDidMount}
            />
        </div>
    );
}
