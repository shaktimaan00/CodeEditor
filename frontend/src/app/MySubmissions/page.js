"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./style.css";

const MySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [copiedMessage, setCopiedMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/data');
                setSubmissions(Object.values(response.data));
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            }
        };

        fetchData();
    }, []);

    const toggleCodeDisplay = (index) => {
        const newSubmissions = [...submissions];
        newSubmissions[index].showFullCode = !newSubmissions[index].showFullCode;
        setSubmissions(newSubmissions);
    };

    const copyCodeToClipboard = (code, index) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                const newSubmissions = [...submissions];
                newSubmissions[index].copied = true;
                setSubmissions(newSubmissions);
                setTimeout(() => {
                    newSubmissions[index].copied = false;
                    setSubmissions(newSubmissions);
                }, 1500);
            })
            .catch((error) => {
                console.error('Failed to copy code to clipboard:', error);
            });
    };

    return (
        <div className='submission'>
            <ul>
                <div className='section2 sectionq'>
                    <div className='status'>Status</div>
                    <div className='language'>Language</div>
                    <div className='time'>Time</div>
                    <div className='memory'>Memory</div>
                </div>
                <div className='divider'></div>
                {submissions.map((submission, index) => (
                    <li className='submission-2' key={index}>
                        <div>
                            <h1 className='subText'>Submission:</h1>
                            <div className='section2'>
                                <div className={`status ${submission.codeStatus === "Accepted" ? 'text-green-600' : submission.codeStatus === "Time Limit Exceeded" ? 'text-orange-600' : 'text-red-600'}`}>
                                    {submission.codeStatus}
                                </div>
                                <div className='language'>{submission.language}</div>
                                <div className='time'>{submission.time}</div>
                                <div className='memory'>{submission.memory}</div>
                            </div>
                            <div className='section3'>
                                <h1>Input</h1>
                                <div className="stdin">{submission.stdin}</div>
                            </div>
                            <h1>Code</h1>
                            <div className='section4'>
                                <pre className='sourcecode' >
                                    <code>
                                        {submission?.showFullCode
                                            ? submission?.sourceCode
                                            : submission?.sourceCode?.slice(0, 100) + '...'}
                                    </code>
                                </pre>
                                {submission?.sourceCode?.length > 100 && (
                                    <button onClick={() => toggleCodeDisplay(index)} className='toggle-button'>
                                        <i>{submission?.showFullCode ? 'Show Less' : 'See More'}</i>
                                    </button>
                                )}
                                <button onClick={() => copyCodeToClipboard(submission.sourceCode, index)} className='copy-button'>
                                    {submission?.copied ? 'Copied' : 'Copy Code'}
                                </button>
                            </div>
                            <div className='divider'></div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MySubmissions;
