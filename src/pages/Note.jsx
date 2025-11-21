import {NoteArea} from "../components/NoteArea";
import {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {createNote} from "../core/api";
import {useAuth} from "../context/AuthContext";
import { SimpleModal } from "../components/modals/SimpleModal";
import { useTranslation } from "../hooks/useTranslation";

const DeleteType = {
    never: "never",
    burnAfterRead: "burnAfterRead",
    burnAfterTime: "burnAfterTime"
};

const deleteTypeToExpirationTypeMap = {
    [DeleteType.never]: "NEVER",
    [DeleteType.burnAfterRead]: "BURN_AFTER_READ",
    [DeleteType.burnAfterTime]: "BURN_AFTER_TIME",
};

const noteTypeToKey = {
    [DeleteType.never]: 'never',
    [DeleteType.burnAfterRead]: 'burnAfterRead',
    [DeleteType.burnAfterTime]: 'burnAfterTime',
};

export const Note = () => {
    const [noteType, setNoteType] = useState(DeleteType.never);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState("");
    const [title, setTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");

    const [modal, setModal] = useState({
        show: false,
        message: ""
    });

    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const {token} = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTypeSelect = (type) => {
        setNoteType(type);
        setIsDropdownOpen(false);

        if (type !== DeleteType.burnAfterTime) {
            setSelectedDateTime("");
        }
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleCreateNote = async () => {
        const newNote = {
            title: title,
            content: noteContent,
            expirationType: deleteTypeToExpirationTypeMap[noteType],
            expirationPeriod: noteType === DeleteType.burnAfterTime ? selectedDateTime : null
        };

        const result = await createNote(newNote, token);

        if (!result.ok) {
            setModal({
                show: true,
                message: result.error
            });
            return;
        }

        navigate(`/note/${result.data.url}`);
    };

    return (
        <>
            <div className="note-container">
                <div className={"col-note"}>
                    <input
                        type="text"
                        className="note-area note-title-input"
                        placeholder={t('notes.titlePlaceholder')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <NoteArea
                        content={noteContent}
                        onContentChange={setNoteContent}
                    />
                </div>

                <div className="note-settings-container">
                    <div className="note-settings" id="note-settings">
                        <label className="text settings-label">{t('expiration.typeOfDelete')}</label>
                        <div className="dropdown-container" ref={dropdownRef}>
                            <button
                                className="dropdown-trigger"
                                onClick={toggleDropdown}
                                type="button"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="listbox"
                            >
                                <span className="text">{t(`expiration.${noteType}`)}</span>
                                <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            {isDropdownOpen && (
                                <div className="dropdown-menu" role="listbox">
                                    {Object.values(DeleteType).map((type) => (
                                        <button
                                            key={type}
                                            className={`dropdown-item ${noteType === type ? "active" : ""}`}
                                            onClick={() => handleTypeSelect(type)}
                                            type="button"
                                            role="option"
                                            aria-selected={noteType === type}
                                        >
                                            <span className="text">{t(`expiration.${noteTypeToKey[type]}`)}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {noteType === DeleteType.burnAfterTime && (
                        <div className="time-settings" id="time-settings">
                            <label className="text settings-label">{t('editNote.deleteDateTime')}</label>
                            <input
                                type="datetime-local"
                                className="datetime-input"
                                value={selectedDateTime}
                                onChange={(e) => setSelectedDateTime(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                            />

                            {selectedDateTime && (
                                <div className="datetime-preview text">
                                    {t('editNote.willBeDeleted')}{" "}
                                    {new Date(selectedDateTime).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="note-create-wrapper">
                        <button
                            className="button button_primary align-self-center"
                            style={{textAlign: "center"}}
                            onClick={handleCreateNote}
                        >
                            {t('notes.create')}
                        </button>
                    </div>
                </div>
            </div>

            <SimpleModal
                show={modal.show}
                message={modal.message}
                onClose={() => setModal({ ...modal, show: false })}
            />
        </>
    );
};
