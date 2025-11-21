import {useEffect, useRef, useState} from "react";
import {NoteArea} from "../components/NoteArea";
import {deleteNote, getNote, updateNote} from "../core/api";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {SimpleModal} from "../components/modals/SimpleModal";
import {useTranslation} from "../hooks/useTranslation";
import {tApi} from "../core/translateApi";
import { convertDurationToTime, convertTimeToDuration } from "../core/timeConverter";

const DeleteType = {
    never: "never",
    burnAfterRead: "burn after read",
    burnByPeriod: "burn by period"
}

const expirationTypeToDeleteTypeMap = {
    "NEVER": DeleteType.never,
    "BURN_AFTER_READ": DeleteType.burnAfterRead,
    "BURN_BY_PERIOD": DeleteType.burnByPeriod,
};

const deleteTypeToExpirationTypeMap = {
    [DeleteType.never]: "NEVER",
    [DeleteType.burnAfterRead]: "BURN_AFTER_READ",
    [DeleteType.burnByPeriod]: "BURN_BY_PERIOD",
};

const noteTypeToKey = {
    [DeleteType.never]: 'never',
    [DeleteType.burnAfterRead]: 'burnAfterRead',
    [DeleteType.burnByPeriod]: 'burnByPeriod',
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
    const { t } = useTranslation();

    const location = useLocation();
    const initialNote = location.state?.note;

    useEffect(() => {
        if (initialNote) {
            setTitle(initialNote.title);
            setNoteContent(initialNote.content);
            setNoteType(expirationTypeToDeleteTypeMap[initialNote.expirationType]);

            if (initialNote.expirationPeriod) {
                setSelectedDateTime(convertDurationToTime(initialNote.expirationPeriod / 1000)); // передаем в секундах
            }

            return;
        }

        const fetchNote = async () => {
            const result = await getNote(id, token);

            if (result.data.status === 404) {
                if (result.data.properties.api_error_code === 100) {
                    setModal({show: true, message: t("api.errors.unavailableNote")});
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
                setSelectedDateTime(convertDurationToTime(note.expirationPeriod / 1000));
            } else {
                setSelectedDateTime("");
            }
        };

        void fetchNote();
    }, [id, token]);


    const handleTypeSelect = (type) => {
        setNoteType(type);
        setIsDropdownOpen(false);

        if (type !== DeleteType.burnByPeriod) {
            setSelectedDateTime("");
        }
    };

    const saveNote = async () => {
        if (noteType === DeleteType.burnByPeriod && !selectedDateTime) {
            setModal({ show: true, message: t('editNote.specifyDateTime') });
            return;
        }

        const noteToUpdate = {
            url: id,
            title,
            content: noteContent,
            expirationType: deleteTypeToExpirationTypeMap[noteType],
            expirationPeriod: selectedDateTime ? convertTimeToDuration(selectedDateTime) : null,
        };

        try {
            const updatedNote = await updateNote(noteToUpdate, token);

            if (!updatedNote.ok) {
                setModal({
                    show: true,
                    message: updatedNote.error
                });

                // window.location.reload();
                return;
            }


            setTitle(noteToUpdate.title);
            setNoteContent(noteToUpdate.content);
            setNoteType(expirationTypeToDeleteTypeMap[noteToUpdate.expirationType] || DeleteType.never);

            if (updatedNote.expirationPeriod) {
                setSelectedDateTime(new Date(updatedNote.expirationPeriod).toISOString().slice(0, 16));
            } else {
                setSelectedDateTime("");
            }
            setEditMode(false);
            setModal({ show: true, message: t('editNote.changesSaved') });
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
                        placeholder={t('notes.titlePlaceholder')}
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
                        <label className={"text settings-label"}>{t('expiration.typeOfDelete')}</label>
                        <div className={"dropdown-container"} ref={dropdownRef}>
                            <button
                                className={"dropdown-trigger"}
                                onClick={toggleDropdown}
                                type="button"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="listbox"
                                disabled={!editMode}
                            >
                                <span className="text">{t(`expiration.${noteTypeToKey[noteType]}`)}</span>
                                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {isDropdownOpen && (
                                <div className={"dropdown-menu"} role="listbox">
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

                    {noteType === DeleteType.burnByPeriod && (
                        <div className={"time-settings"}>
                            <label className={"text settings-label"}>{t('editNote.deleteDateTime')}</label>
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
                                    {t('editNote.willBeDeleted')} {new Date(selectedDateTime).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}

                    {!editMode ? (
                        <div className="note-buttons">
                            <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                                {t('notes.edit')}
                            </button>
                            <button className="btn btn-secondary" onClick={handleDeleteNote}>
                                {t('notes.delete')}
                            </button>
                        </div>
                    ) : (
                        <div className="note-buttons">
                            <button className="btn btn-primary" onClick={saveNote}>
                                {t('editNote.save')}
                            </button>
                            <button className="btn btn-secondary" onClick={cancelNote}>
                                {t('modals.cancel')}
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
                    if (modal.message === tApi("api.errors.unavailableNote")) navigate("/");
                }}
            />
        </>
    );
};
