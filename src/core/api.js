import {Note} from "../pages/Note";

export async function getNote(url: string, token: string | null) {
    try {
        console.log("Sending request with token:", token);

        const response = await fetch(`http://localhost:8080/api/v1/note/${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        });

        if (response.ok) {
            return await response.json();
        } else if (response.status === 401) {
            throw new Error("Неавторизованный доступ. Пожалуйста, войдите в систему.");
        } else if (response.status === 404) {
            throw new Error("Заметка не найдена.");
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getNotes(token: string) {
    try {
        const response = await fetch("http://localhost:8080/api/v1/note/list/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Ошибка загрузки заметок: ${response.status}`);
        }

        const data = await response.json();

        // получаем только URL заметок
        const urls = data.page.content.map(note => note.url);

        // запрашиваем просмотры
        const analyticsResponse = await fetch("http://localhost:8080/api/v1/analytics/view-notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ urls }),
        });

        const analytics = await analyticsResponse.json();

        // Объединяем заметки и просмотры
        const enrichedNotes = data.page.content.map(note => ({
            ...note,
            views: analytics[note.url]
                ? analytics[note.url].userViews + analytics[note.url].anonymousViews
                : 0
        }));

        return {
            content: enrichedNotes,
            totalPages: data.page.totalPages,
            currentPage: data.page.page + 1,
            totalElements: data.page.totalElements
        };

    } catch (error) {
        console.error("Ошибка при запросе заметок:", error);
        throw error;
    }
}

export async function deleteNote(url: string, token: string): Promise<void> {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/note/${url}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 204) {
            alert("Заметка успешно удалена");
        } else if (response.status === 403) {
            alert("Недостаточно прав на удаление заметки");
        } else {
            const errorData = await response.json();
            alert(`Ошибка при удалении заметки: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Ошибка при удалении заметки:", error);
        alert("Произошла ошибка при удалении заметки");
    }
}

export async function createNote(note: NoteCreate, token: string | null) {
    try {
        const response = await fetch('http://localhost:8080/api/v1/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
                title: note.title,
                content: note.content,
                expirationType: note.expirationType,
                expirationPeriod: note.expirationType === 'BURN_BY_PERIOD' ? new Date(note.expirationPeriod) : null,
            }),
        });

        if (response.status === 200) {
            alert('Заметка успешно создана!');
            return await response.json();
        }
    } catch (error) {
        console.error("Ошибка при запросе заметок:", error);
    }
}

export async function updateNote(note: Note, token: string) {
    if (note.expirationType === "BURN_AFTER_TIME" && !note.expirationPeriod) {
        throw new Error("Пожалуйста, укажите время для Burn by period.");
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/note/${note.url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: note.title,
                content: note.content,
                expirationType: note.expirationType,
                expirationPeriod:
                    note.expirationType === "BURN_AFTER_TIME"
                        ? new Date(note.expirationPeriod).getTime()
                        : null,
            }),
        });

        if (response.status === 200) {
            const updatedNote = await response.json();
            return updatedNote;
        } else if (response.status === 400) {
            throw new Error("Недопустимые символы в заголовке. Используйте только английские буквы и цифры.");
        } else if (response.status === 403) {
            throw new Error("Недостаточно прав на редактирование заметки");
        } else {
            const errorData = await response.json();
            throw new Error(`Ошибка при сохранении изменений: ${errorData.message}`);
        }
    } catch (err) {
        console.error("Ошибка при обновлении заметки:", err);
        throw err;
    }
}

export async function authentication(user: string, password: string) {
    const response = await fetch('http://localhost:8081/api/v1/auth/login', {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({login: user, password: password}),
    });

    if (response.ok) {
        return await response.text();
    } else {
        throw new Error("Ошибка входа: проверьте логин и пароль.");
    }
}

export async function register(user: string, password: string) {
    const response = await fetch('http://localhost:8081/api/v1/user/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({login: user, password: password}),
    });

    if (response.ok) {
        alert("Регистрация успешна!");
        return await authentication(user, password);
    } else if (response.status === 409) {
        alert("Ошибка регистрации: пользователь с таким логином уже есть.")
        throw new Error("Ошибка регистрации: пользователь с таким логином уже есть.");
    } else {
        alert("Ошибка регистрации: попробуйте ещё раз.");
        throw new Error("Ошибка регистрации: попробуйте ещё раз.");
    }
}

export function logout() {

}
