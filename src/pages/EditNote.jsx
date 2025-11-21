import {useEffect, useRef, useState} from "react";
import {NoteArea} from "../components/NoteArea";
import {deleteNote, getNote, updateNote} from "../core/api";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {SimpleModal} from "../components/modals/SimpleModal";

const DeleteType = {
    never: "Never",
    burnAfterRead: "Burn after read",
    burnAfterTime: "Burn after time"
}

const expirationTypeToDeleteTypeMap = {
    "NEVER": DeleteType.never,
    "BURN_AFTER_READ": DeleteType.burnAfterRead,
    "BURN_AFTER_TIME": DeleteType.burnAfterTime,
};

const deleteTypeToExpirationTypeMap = {
    [DeleteType.never]: "NEVER",
    [DeleteType.burnAfterRead]: "BURN_AFTER_READ",
    [DeleteType.burnAfterTime]: "BURN_AFTER_TIME",
};

export const EditNote = () => {
    const {id} = useParams();
    const [noteType, setNoteType] = useState(DeleteType.never);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState("");
    const [title, setTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [editMode, setEditMode] = useState(false);

    const [modal, setModal] = useState({
        show: false,
        message: ""
    });

    const {token} = useAuth();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            const result = await getNote(id, token);

            console.log(result.data);
            if (result.data.status === 404) {
                if (result.data.properties.api_error_code === 100) {
                    setModal({show: true, message: "Извините, заметка больше недоступна"});
                    return;
                }

                setModal({show: true, message: result.error});
                return;
            }
            const note = result.data;

            setTitle(note.title);
            setNoteContent(note.content);

            const mappedNoteType = expirationTypeToDeleteTypeMap[note.expirationType] || DeleteType.never;
            setNoteType(mappedNoteType);

            if (note.expirationPeriod) {
                const date = new Date(note.expirationPeriod);
                if (!isNaN(date.getTime())) {
                    setSelectedDateTime(date.toISOString().slice(0, 16));
                }
            } else {
                setSelectedDateTime("");
            }
        };

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
        if (noteType === DeleteType.burnAfterTime && !selectedDateTime) {
            setModal({show: true, message: "Пожалуйста, укажите дату и время удаления."});
            return;
        }

        const noteToUpdate = {
            url: id,
            title,
            content: noteContent,
            expirationType: deleteTypeToExpirationTypeMap[noteType],
            expirationPeriod: selectedDateTime ? new Date(selectedDateTime).getTime() : null,
        };

        try {
            const updatedNote = await updateNote(noteToUpdate, token);

            if (!updatedNote.ok) {
                setModal({
                    show: true,
                    message: updatedNote.error
                });

                window.location.reload();
                return;
            }


            setTitle(updatedNote.title);
            setNoteContent(updatedNote.content);
            setNoteType(expirationTypeToDeleteTypeMap[updatedNote.expirationType] || DeleteType.never);

            if (updatedNote.expirationPeriod) {
                setSelectedDateTime(new Date(updatedNote.expirationPeriod).toISOString().slice(0, 16));
            } else {
                setSelectedDateTime("");
            }
            setEditMode(false);
            setModal({show: true, message: "Изменения успешно сохранены"});
        } catch (error) {
            setModal({show: true, message: error.message});
        }
    };


    const handleDeleteNote = async () => {
        if (!token) return;

        await deleteNote(id, token);
        navigate("/account");
    };

    const cancelNote = () => {
        setIsDropdownOpen(false);
        setEditMode(false);
        window.location.reload();
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
                                <div className={"dropdown-menu"} role="listbox">
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
                        <div className={"time-settings"}>
                            <label className={"text settings-label"}>Дата и время удаления</label>
                            <input
                                type="datetime-local"
                                className={"datetime-input"}
                                value={selectedDateTime}
                                onChange={handleDateTimeChange}
                                min={new Date().toISOString().slice(0, 16)}
                                disabled={!editMode}
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
                            <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                                Редактировать
                            </button>
                            <button className="btn btn-secondary" onClick={handleDeleteNote}>
                                Удалить
                            </button>
                        </div>
                    ) : (
                        <div className="note-buttons">
                            <button className="btn btn-primary" onClick={saveNote}>
                                Сохранить
                            </button>
                            <button className="btn btn-secondary" onClick={cancelNote}>
                                Отмена
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <SimpleModal
                show={modal.show}
                message={modal.message}
                onClose={() => {
                    setModal({...modal, show: false});
                    if (modal.message === "Извините, заметка больше недоступна") navigate("/");
                }}
            />
        </>
    );
};
