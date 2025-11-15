import {useEffect, useRef, useState} from "react";
import {NoteArea} from "../components/NoteArea";
import {getNote} from "../core/api";
import {useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const DeleteType = {
    default: "Default",
    burnAfterRead: "Burn after read",
    burnAfterTime: "Burn after time"
}

const expirationTypeToDeleteTypeMap: Record<string, string> = {
    "NEVER": DeleteType.default,
    "BURN_AFTER_READ": DeleteType.burnAfterRead,
    "BURN_AFTER_TIME": DeleteType.burnAfterTime,
};

const deleteTypeToExpirationTypeMap: Record<string, ExpirationType> = {
    [DeleteType.default]: "NEVER",
    [DeleteType.burnAfterRead]: "BURN_AFTER_READ",
    [DeleteType.burnAfterTime]: "BURN_AFTER_TIME",
};

export const EditNote = () => {
    const { id } = useParams();
    const [noteType, setNoteType] = useState(DeleteType.default);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState("");
    const [title, setTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [editMode, setEditMode] = useState(false);
    const { token } = useAuth();

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        const fetchNote = async () => {
            try {
                const note = await getNote(id, token);

                console.log(note);

                setTitle(note.title);
                setNoteContent(note.content);

                const mappedNoteType = expirationTypeToDeleteTypeMap[note.expirationType] || DeleteType.default;
                setNoteType(mappedNoteType);

                if (note.expirationPeriod) {
                    const date = new Date(note.expirationPeriod);
                    if (!isNaN(date.getTime())) {
                        setSelectedDateTime(date.toISOString().slice(0, 16));
                    }
                } else {
                    setSelectedDateTime("");
                }
            } catch (error) {
                alert(error.message);
            }
        }

        void fetchNote();
    }, [id, token]);

    const handleTypeSelect = (type) => {
        setNoteType(type);
        setIsDropdownOpen(false);

        if (type !== DeleteType.burnAfterTime) {
            setSelectedDateTime("");
        }
    };

    const saveNote = async () => {

    }

    const deleteNote = async () => {

    }

    const cancelNote = () => {
        setIsDropdownOpen(false);
        setEditMode(false);
    }

    const handleDateTimeChange = (e) => {
        setSelectedDateTime(e.target.value);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <div className={"note-container"}>
                <div className={"col-note"}>
                    <input
                        type="text"
                        className="note-area note-title-input"
                        placeholder="Введите заголовок заметки"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={!editMode}
                    />
                    <NoteArea
                        content={noteContent}
                        onContentChange={setNoteContent}
                        disabled={!editMode}
                    />
                </div>
                <div className={"note-settings-container"}>
                    <div className={"note-settings"} id={"note-settings"}>
                        <label className={"text settings-label"}>Тип удаления</label>
                        <div className={"dropdown-container"} ref={dropdownRef}>
                            <button
                                className={"dropdown-trigger"}
                                onClick={toggleDropdown}
                                type="button"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="listbox"
                                disabled={!editMode}
                            >
                                <span className={"text"}>{noteType}</span>
                                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
                                    ▼
                                </span>
                            </button>
                            {isDropdownOpen && (
                                <div
                                    className={"dropdown-menu"}
                                    role="listbox"
                                    aria-labelledby="dropdown-trigger"
                                >
                                    {Object.values(DeleteType).map((type) => (
                                        <button
                                            key={type}
                                            className={`dropdown-item ${noteType === type ? 'active' : ''}`}
                                            onClick={() => handleTypeSelect(type)}
                                            type="button"
                                            role="option"
                                            aria-selected={noteType === type}
                                        >
                                            <span className={"text"}>{type}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {noteType === DeleteType.burnAfterTime && (
                        <div className={"time-settings"} id={"time-settings"}>
                            <label className={"text settings-label"}>Дата и время удаления</label>
                            <input
                                type="datetime-local"
                                className={"datetime-input"}

                                value={selectedDateTime}
                                onChange={handleDateTimeChange}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            {selectedDateTime && (
                                <div className={"datetime-preview text"}>
                                    Заметка будет удалена: {new Date(selectedDateTime).toLocaleString('ru-RU')}
                                </div>
                            )}
                        </div>
                    )}
                    {!editMode ? (
                        <div className="note-buttons">
                            <button className="btn btn-primary"
                                    onClick={() => {
                                        setEditMode(!editMode);
                                    }}
                            >
                                Редактировать
                            </button>
                            <button className="btn btn-secondary"
                                    onClick={deleteNote}
                            >
                                Удалить
                            </button>
                        </div>
                    ) : (
                        <div className="note-buttons">
                            <button className="btn btn-primary"
                                    onClick={saveNote}
                            >
                                Сохранить
                            </button>
                            <button className="btn btn-secondary"
                                    onClick={cancelNote}
                            >
                                Отмена
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
