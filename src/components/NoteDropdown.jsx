import React, { useState, useRef, useEffect } from 'react';
import '../static/styles/noteDropdown.scss';
import {SlOptionsVertical} from "react-icons/sl";

export const NoteDropdown = ({ noteUrl, onAction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleAction = (action) => {
        setIsOpen(false);
        if (onAction) {
            onAction(action, noteUrl);
        }
    };

    return (
        <div className="note-dropdown" ref={dropdownRef}>
            <button
                className="note-dropdown-trigger"
                onClick={toggleDropdown}
            >
                <SlOptionsVertical />
            </button>

            <div className={`note-dropdown-menu ${isOpen ? 'open' : ''}`}>
                <button
                    className="note-dropdown-item"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAction('share');
                    }}
                >
                    Поделиться
                </button>
                <button
                    className="note-dropdown-item"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAction('delete');
                    }}
                >
                    Удалить
                </button>
            </div>
        </div>
    );
};
