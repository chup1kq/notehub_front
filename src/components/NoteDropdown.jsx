import React, { useState, useRef, useEffect } from 'react';
import '../static/styles/noteDropdown.scss';
import { SlOptionsVertical } from "react-icons/sl";
import { deleteNote } from "../core/api";
import { tApi } from "../core/translateApi";
import { useTranslation } from "../hooks/useTranslation";

const baseNoteUrl = "http://localhost:3000/note";

export const NoteDropdown = ({ noteUrl, setModal, token }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { t } = useTranslation();

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

    const handleDeleteNote = async () => {
        if (!token) return;

        await deleteNote(noteUrl, token);
        window.location.reload();
    };

    const handleCopyUlr = async ()  => {
        try {
            const noteUrlFull = `${baseNoteUrl}/${noteUrl}`;
            await navigator.clipboard.writeText(noteUrlFull);
            setModal({
                show: true,
                message: tApi("ui.clipboard.copied")
            });
        } catch (err) {
            setModal({
                show: true,
                message: tApi("ui.clipboard.copyFailed")
            });
        }
    }


    return (
        <div className="note-dropdown" ref={dropdownRef}>
            <button className="note-dropdown-trigger" onClick={toggleDropdown}>
                <SlOptionsVertical />
            </button>

            <div className={`note-dropdown-menu ${isOpen ? 'open' : ''}`}>
                <button
                    className="note-dropdown-item"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUlr();
                    }}
                >
                    {t('notes.share')}
                </button>
                <button
                    className="note-dropdown-item"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote();
                    }}
                >
                    {t('notes.delete')}
                </button>
            </div>
        </div>
    );
};
