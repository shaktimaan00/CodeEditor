// pages/index.js
"use client"
import React, { useState, useEffect } from 'react';
import OutputWindow from './components/OutputWindow';
import axios from 'axios';
import LanguagesDropdown from './components/LanguagesDropdown';
import { languageOptions } from './constants/languageOptions';
import { defineTheme } from './lib/defineTheme';
import { classnames } from './utils/general';
import ThemeDropdown from './components/ThemeDropdown';
import CodeEditorWindow from './components/CodeEditorWindow';
import CustomInput from './components/CustomInput';
import OutputDetails from './components/OutputDetails';
import { customStyles } from './constants/customStyles';
import Link from 'next/link';

export default function Home() {
  const [code, setCode] = useState('');
  const [parameters, setParameters] = useState('');
  const [output, setOutput] = useState('');
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3001/data', userData);
      console.log("db data" + response.data);
      return response.data; // Return any data received from the server
    } catch (error) {
      console.error('Error creating user:', error);
      throw error; // Throw the error for handling elsewhere if needed
    }
  };

  const executeCode = async () => {
    try {
      setProcessing(true);
      const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
          base64_encoded: 'true',
          fields: '*'
        },
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': 'def00207c7mshd995416bf24fff8p1044e2jsn5e52cc1d9e65',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
          language_id: language.id,
          source_code: btoa(code), // Encode code as base64
          stdin: btoa(parameters) // Encode parameters as base64
        }
      };

      const response = await axios.request(options);
      console.log(response);
      const submissionId = response.data.token;
      checkStatus(submissionId);
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code.');
    } finally {
      setProcessing(false);
    }
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: "https://judge0-ce.p.rapidapi.com/submissions" + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        'X-RapidAPI-Key': 'def00207c7mshd995416bf24fff8p1044e2jsn5e52cc1d9e65',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        console.log("response.data", response.data);
        setOutput(response.data);
        const newUser = {
          username: '{DummyUser}', // Set the username here
          language: language.value,
          stdin: parameters,
          sourceCode: code,
          codeStatus: response.data?.status?.description,
          memory: response.data?.memory,
          time: response.data?.time,
          submittedOn: new Date().toISOString()
        };
        await createUser(newUser);
        console.log("Done");
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } 
    else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  return (
    <div>
<div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className="px-4 py-2">
          <Link href="/MySubmissions" ><button className='mt-1 px-4 py-2 rounded font-light hover:bg-slate-500 hover:text-white bg-slate-400' >My Submissions</button></Link>
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={output} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={parameters}
              setCustomInput={setParameters}
            />
            <button
              onClick={executeCode}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {output && <OutputDetails outputDetails={output} />}
        </div>
      </div>
    </div>
  );
}
