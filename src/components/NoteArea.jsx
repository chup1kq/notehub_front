import React, { useState, useRef, useEffect } from 'react';

export const NoteArea = ({ content, onContentChange, className = "", disabled = false }) => {
    const [value, setValue] = useState(content || "");
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    useEffect(() => {
        setValue(content || "");
    }, [content]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onContentChange) {
            onContentChange(newValue);
        }
    };

    return (
        <textarea
            ref={textareaRef}
            className={`note-area ${className}`}
            value={value}
            onChange={handleChange}
            placeholder="Введите ваш текст..."
            disabled={disabled}
        />
    );
};