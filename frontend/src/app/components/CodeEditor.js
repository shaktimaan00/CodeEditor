// components/CodeEditor.js
import React from 'react';
import { Editor, Monaco } from '@monaco-editor/react';

const CodeEditor = ({ value, onChange }) => {
  const handleEditorChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue={value}
      onChange={handleEditorChange}
      theme="vs-dark"
    />
  );
};

export default CodeEditor;
