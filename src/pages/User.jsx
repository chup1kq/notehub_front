import {useAuth} from "../context/AuthContext";
import {IoMdEye} from "react-icons/io";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getNotes} from "../core/api";
import { SimpleModal } from "../components/modals/SimpleModal";
import { NoteDropdown } from "../components/NoteDropdown";
import { useTranslation } from "../hooks/useTranslation";

export const User = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { page = 1 } = useParams();
    const [notesPage, setNotesPage] = useState(null);
    const { t } = useTranslation();

    const [modal, setModal] = useState({
        show: false,
        message: ""
    });

    useEffect(() => {
        if (!user || !token) {
            navigate("/login");
            return;
        }

        const loadNotes = async () => {
            const result = await getNotes(token, page-1);

            if (!result.ok) {
                setModal({
                    show: true,
                    message: result.error
                });
                return;
            }

            setNotesPage(result.data);
        };

        void loadNotes();
    }, [user, token, page]);

    if (!notesPage) {
        return <div className="text-center mt-5 text">{t('user.loading')}</div>;
    }

    const notes = notesPage.content;

    const handlePageChange = (newPage) => {
        navigate(`/account/${newPage}`);
    };

    return (
        <>
            <div className={"container d-flex justify-content-center"}>
                <div className={"row custom-row"}>
                    <div className={"container user-info col-md-3 text px-sm-4"}>
                        <h1>{user}</h1>
                        <p>{t('notes.numberOfNotes')}: {notesPage.totalElements}</p>
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
                                                        setModal={setModal}
                                                        token={token}
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
                                                onClick={() => handlePageChange(Number(page) - 1)}
                                            >
                                                {t('user.previous')}
                                            </button>
                                        )}
                                        <span className="pagination-number">
                                            {t('user.page')} {notesPage.currentPage} {t('user.of')} {notesPage.totalPages}
                                        </span>
                                        {notesPage.currentPage < notesPage.totalPages && (
                                            <button
                                                className="pagination-btn"
                                                onClick={() => handlePageChange(Number(page) + 1)}
                                            >
                                                {t('user.next')}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="d-flex justify-content-center">
                                    <a
                                        className="btn btn-primary text-center"
                                        href={"/"}
                                        style={{marginBottom: "20px"}}
                                    >
                                        {t('notes.createNew')}
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="alert alert-info text-center" role="alert">
                                {t('notes.noNotes')}. <a href={"/"}>{t('user.createNewNote')}</a>
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
