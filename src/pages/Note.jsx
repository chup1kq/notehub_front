import {NoteArea} from "../components/NoteArea";
import {useState, useRef, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const DeleteType = {
    default: "Default",
    burnAfterRead: "Burn after read",
    burnAfterTime: "Burn after time"
};

export const Note = () => {
    const [noteType, setNoteType] = useState(DeleteType.default);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

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

    const createNote = () => {
        const id = 1;
        navigate(`/notes/${id}`);
    };

    return (
        <div className="note-container">
            <NoteArea
                content={noteContent}
                onContentChange={setNoteContent}
            />
            <div className="note-settings-container">
                <div className="note-settings" id="note-settings">
                    <label className="text settings-label">Тип удаления</label>
                    <div className="dropdown-container" ref={dropdownRef}>
                        <button
                            className="dropdown-trigger"
                            onClick={toggleDropdown}
                            type="button"
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="listbox"
                        >
                            <span className="text">{noteType}</span>
                            <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
                                ▼
                            </span>
                        </button>
                        {isDropdownOpen && (
                            <div
                                className="dropdown-menu"
                                role="listbox"
                                aria-labelledby="dropdown-trigger"
                            >
                                {Object.values(DeleteType).map((type) => (
                                    <button
                                        key={type}
                                        className={`dropdown-item ${noteType === type ? "active" : ""}`}
                                        onClick={() => handleTypeSelect(type)}
                                        type="button"
                                        role="option"
                                        aria-selected={noteType === type}
                                    >
                                        <span className="text">{type}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {noteType === DeleteType.burnAfterTime && (
                    <div className="time-settings" id="time-settings">
                        <label className="text settings-label">Дата и время удаления</label>
                        <input
                            type="datetime-local"
                            className="datetime-input"
                            value={selectedDateTime}
                            onChange={(e) => setSelectedDateTime(e.target.value)}

                            min={new Date().toISOString().slice(0, 16)}
                        />
                        {selectedDateTime && (
                            <div className="datetime-preview text">
                                Заметка будет удалена:{" "}
                                {new Date(selectedDateTime).toLocaleString("ru-RU")}
                            </div>
                        )}
                    </div>
                )}
                <button
                    className="button button_primary align-self-center"
                    style={{ textAlign: "center" }}
                    onClick={createNote}
                >
                    Создать
                </button>
            </div>
        </div>
    );
};
