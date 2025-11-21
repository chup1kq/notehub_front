import { deleteNote } from "../core/api";

const baseNoteUrl = "http://localhost:3000/note";

export const handleNoteDropdownAction = async (action, noteUrl, setModal, token, navigate) => {
    switch (action) {
        case 'share':
            try {
                const noteUrlFull = `${baseNoteUrl}/${noteUrl}`;
                await navigator.clipboard.writeText(noteUrlFull);
                setModal({
                    show: true,
                    message: "Ссылка скопирована в буфер обмена!"
                });
            } catch (err) {
                console.error('Ошибка копирования: ', err);
                setModal({
                    show: true,
                    message: "Не удалось скопировать ссылку"
                });
            }
            break;
        case 'delete':
            try {
                if (!token) {
                    setModal({
                        show: true,
                        message: "Необходима авторизация"
                    });
                    return;
                }

                const result = await deleteNote(noteUrl, token);

                if (result.ok) {
                    window.location.reload();
                } else {
                    setModal({
                        show: true,
                        message: result.error || "Ошибка при удалении заметки"
                    });
                }
            } catch (err) {
                console.error('Ошибка удаления: ', err);
                setModal({
                    show: true,
                    message: "Произошла ошибка при удалении"
                });
            }
            break;
        default:
            break;
    }
};
