"use client"
import { Editor } from "@monaco-editor/react";

export default function MyEditor()
{
    return (
        <Editor
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            theme="vs-dark"
        />
    );
}