import {useAuth} from "../context/AuthContext";
import {IoMdEye} from "react-icons/io";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getNotes} from "../core/api";
import { SimpleModal } from "../components/modals/SimpleModal";
import { NoteDropdown } from "../components/NoteDropdown";
import { handleNoteDropdownAction } from "../handlers/noteDropdownHandler.js";

export const User = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { page = 1 } = useParams();
    const [notesPage, setNotesPage] = useState(null);

    const [modal, setModal] = useState({
        show: false,
        message: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!token) return;

        const loadNotes = async () => {
            const result = await getNotes(token);

            if (!result.ok) {
                setModal({
                    show: true,
                    message: result.error
                });
                return;
            }

            setNotesPage(result.data);
        };

        loadNotes();
    }, [user, token, page]);

    const handleNoteAction = async (action, noteUrl) => {
        await handleNoteDropdownAction(action, noteUrl, setModal, token, navigate);
    };

    if (!notesPage) {
        return <div className="text-center mt-5 text">Загрузка...</div>;
    }

    const notes = notesPage.content.filter(note => note.available);

    const handlePageChange = (newPage) => {
        navigate(`/album/${newPage}`);
    };

    return (
        <>
            <div className={"container d-flex justify-content-center"}>
                <div className={"row custom-row"}>
                    <div className={"container user-info col-md-3 text px-sm-4"}>
                        <h1>{user}</h1>
                        <p>Заметок: {notesPage.totalElements}</p>
                        <p>
                            Просмотров:{" "}
                            {notes.reduce((sum, n) => sum + (n.views || 0), 0)}
                        </p>
                    </div>

                    <div className={"col-md-9"}>
                        {notes.length > 0 ? (
                            <div className={"container-fluid"}>
                                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                                    {notes.map((note) => (
                                        <div
                                            key={note.url}
                                            className="col"
                                            onClick={() => navigate(`/note/${note.url}`)}
                                        >
                                            <div className="card mb-3 text card-cur">
                                                <div
                                                    className="card-header back-header"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "right",
                                                        alignItems: "center",
                                                        gap: "0.5rem",
                                                    }}
                                                >
                                                    <div style={{display: "flex", alignItems: "center", gap: "4px", marginRight: "auto"}}>
                                                        <IoMdEye/> {note.views || 0}
                                                    </div>
                                                    <div>{formatDate(note.createdAt)}</div>
                                                    <NoteDropdown
                                                        noteUrl={note.url}
                                                        onAction={handleNoteAction}
                                                    />
                                                </div>
                                                <div className="card-body back-body">
                                                    <h2 className="card-title">{note.title}</h2>
                                                    <p className="card-text">{note.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {notesPage.totalPages > 1 && (
                                    <div className="pagination-toolbar">
                                        {notesPage.currentPage > 1 && (
                                            <button
                                                className="pagination-btn"
                                                onClick={() => handlePageChange(notesPage.currentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                        )}
                                        <span className="pagination-number">
                                            Page {notesPage.currentPage} of {notesPage.totalPages}
                                        </span>
                                        {notesPage.currentPage < notesPage.totalPages && (
                                            <button
                                                className="pagination-btn"
                                                onClick={() => handlePageChange(notesPage.currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="d-flex justify-content-center">
                                    <a className="btn btn-primary" href={"/"}>
                                        Создать новую заметку
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info text-center" role="alert">
                                Заметок еще нет. <a href={"/"}>Создайте новую</a>
                            </div>
                        )}
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

function formatDate(arr) {
    if (!Array.isArray(arr)) return "";

    const [y, m, d] = arr;

    return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}
