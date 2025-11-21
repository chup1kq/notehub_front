const NoteApi = "http://localhost:8080/api/v1";
const UserApi = "http://localhost:8081/api/v1";

export async function getNote(url, token) {
    console.log("Sending request with token:", token);

    try {
        const response = await fetch(`${NoteApi}/note/${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });

        if (response.ok) {
            return { ok: true, data: await response.json() };
        }

        if (response.status === 401) {
            return { ok: false, error: "Неавторизованный доступ. Пожалуйста, войдите в систему." };
        }

        if (response.status === 404) {
            return { ok: false, error: "Заметка не найдена." };
        }

        return { ok: false, error: `Ошибка сервера: ${response.status}` };

    } catch (err) {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}

export async function getNotes(token) {
    try {
        const response = await fetch(`${NoteApi}/note/list/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            credentials: "include"
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { ok: false, error: "Неавторизованный доступ" };
            }
            return { ok: false, error: `Ошибка загрузки заметок: ${response.status}` };
        }

        const data = await response.json();
        const urls = data.page.content.map(n => n.url);

        const analyticsResponse = await fetch(`${NoteApi}/analytics/view-notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ urls }),
        });

        const analytics = analyticsResponse.ok ? await analyticsResponse.json() : {};

        const enrichedNotes = data.page.content.map(note => ({
            ...note,
            views: analytics[note.url]
                ? analytics[note.url].userViews + analytics[note.url].anonymousViews
                : 0
        }));

        return {
            ok: true,
            data: {
                content: enrichedNotes,
                totalPages: data.page.totalPages,
                currentPage: data.page.page + 1,
                totalElements: data.page.totalElements
            }
        };

    } catch (error) {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}

export async function deleteNote(url, token) {
    try {
        const response = await fetch(`${NoteApi}/note/${url}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.status === 204) {
            return { ok: true };
        }

        if (response.status === 403) {
            return { ok: false, error: "Недостаточно прав для удаления заметки" };
        }

        const err = await response.json();
        return { ok: false, error: err.message || "Ошибка при удалении заметки" };

    } catch (error) {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}

export async function createNote(note, token) {
    try {
        const response = await fetch(`${NoteApi}/note`, {
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
                expirationPeriod:
                    note.expirationType === 'BURN_BY_PERIOD'
                        ? new Date(note.expirationPeriod)
                        : null,
            }),
        });

        if (response.status === 200) {
            return { ok: true, data: await response.json() };
        }

        if (response.status === 400) {
            return { ok: false, error: "Неверные данные" };
        }

        return { ok: false, error: `Ошибка сервера: ${response.status}` };

    } catch (error) {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}

export async function updateNote(note, token) {
    if (note.expirationType === "BURN_AFTER_TIME" && !note.expirationPeriod) {
        return { ok: false, error: "Укажите время для Burn by period" };
    }

    try {
        const response = await fetch(`${NoteApi}/note/${note.url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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
            return { ok: true, data: await response.json() };
        }

        if (response.status === 400) {
            return { ok: false, error: "Недопустимые символы в заголовке. Только английские буквы и цифры." };
        }

        if (response.status === 403) {
            return { ok: false, error: "Недостаточно прав для редактирования" };
        }

        const err = await response.json();
        return { ok: false, error: err.message || "Ошибка при сохранении изменений" };

    } catch (err) {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}

//-------------------- API for user service --------------------

let setTokenRef = null;
let setUserRef = null;

export function initAuthApi(setToken, setUser) {
    setTokenRef = setToken;
    setUserRef = setUser;
}

export async function authentication(user, password) {
    try {
        const response = await fetch(`${UserApi}/auth/login`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ login: user, password }),
        });

        if (response.ok) {
            const token = await response.text();
            return { ok: true, data: token };
        }

        return { ok: false, error: "Ошибка входа: проверьте логин и пароль" };

    } catch {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}

export async function register(user, password) {
    try {
        const response = await fetch(`${UserApi}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: user, password }),
        });

        if (response.ok) {
            return await authentication(user, password);
        }

        if (response.status === 409) {
            return { ok: false, error: "Пользователь уже существует" };
        }

        return { ok: false, error: "Ошибка регистрации" };

    } catch {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}

export async function refresh() {
    const response = await fetch(`${UserApi}/auth/refresh`, {
        method: "GET",
        credentials: "include"
    });

    if (response.ok) {
        const newToken = await response.text();
        if (setTokenRef) setTokenRef(newToken);
        return newToken;
    }

    return null;
}


export async function logout() {
    try {
        const response = await fetch(`${UserApi}/auth/logout`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (response.status === 200) {
            setTokenRef(null);
            setUserRef(null);

            return { ok: true };
        }

        return { ok: false, error: "Ошибка выхода" };

    } catch {
        return { ok: false, error: "Ошибка соединения с сервером" };
    }
}
