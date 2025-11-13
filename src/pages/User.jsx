import {useAuth} from "../context/AuthContext";
import {IoMdEye} from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const nts: Array<Note> = [
    {
        id: 1,
        createdAt: Date,
        title: "first",
        content: "string",
        registeredUsers: 1,
        anonymousUsers: 2
    },
    {
        id: "2",
        createdAt: Date,
        title: "second",
        content: "string",
        registeredUsers: 3,
        anonymousUsers: 4
    },
    {
        id: "3",
        createdAt: Date,
        title: "second",
        content: "string",
        registeredUsers: 3,
        anonymousUsers: 4
    }
]

export const User = () => {
    const notes: Array<Note> = nts;
    const {user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const countViews = () => {
        let count = 0;

        notes.forEach(note => {
            count += note.registeredUsers + note.anonymousUsers
        });
        return count;
    }

    return (
        <div className={"container"}>
            <div className={"row"}>
                <div className={"container user-info col-md-3 text px-sm-4"}>
                    <h1>{user}</h1>
                    <p>Заметок: {notes.length}</p>
                    <p>Просмотров: {countViews()}</p>
                </div>
                <div className={"col-md-9"}>
                    {notes.length > 0 ? (
                        <div className={"container-fluid"}>
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                                {notes.map((note) => (
                                    <div id={note.id}
                                         className="col"
                                         key={note.id}
                                         onClick={() => {
                                             navigate(`/note/${note.id}`)
                                         }}
                                        >
                                        <div className={"card mb-3 text card-cur"}>
                                            <div className="card-header back-header">
                                                <div>
                                                    <IoMdEye/>
                                                    {" "}{note.registeredUsers + note.anonymousUsers}
                                                </div>
                                                {note.createdAt}
                                            </div>
                                            <div className={"card-body back-body"}>
                                                <h2 className={"card-title"}>{note.title}</h2>
                                                <p className={"card-text"}>{note.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={"d-flex justify-content-center"}>
                                <a className={"btn btn-primary"}
                                   href={"/"}
                                >
                                    Создать новую заметку
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-info text-center" role="alert">
                            Заметок еще нет. <a href={"/"}>Создайте новую</a>, чтобы она отображалась здесь.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}