import { tApi } from "./translateApi";

const NoteApi = "http://localhost:8080/api/v1";
const UserApi = "http://localhost:8081/api/v1";

function getHeaders(token: string) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

//-------------------- API for note service --------------------

export async function getNote(url, token = null) {
    async function fetchNote() {
        return fetch(`${NoteApi}/note/${url}`, {
            method: "GET",
            headers: getHeaders(token)
        });
    }

    try {
        let response = await fetchNote();

        if (response.status === 401) {
            const refreshResponse: RefreshTokenApi = await refresh();

            if (!refreshResponse.ok) {
                void reLogin();
                return { ok: false, error: tApi("api.errors.refreshUnable") };
            }

            token = refreshResponse.token;
            response = await fetchNote();
        }

        if (response.ok) {
            return { ok: true, data: await response.json() };
        }

        if (response.status === 401) {
            return { ok: false, error: tApi("api.errors.unauthorizedAccess") };
        }

        if (response.status === 404) {
            const json = await response.json();
            return {ok: false, data: json, error: tApi("api.errors.noteNotFound") };
        }

        return {
            ok: false,
            error: tApi("api.errors.serverError", { status: response.status })
        };
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

export async function getNotes(token, page = 0) {
    async function fetchNotes() {
        return fetch(`${NoteApi}/note/list/me?page=${page}`, {
            method: "GET",
            headers: getHeaders(token)
        });
    }

    try {
        let response = await fetchNotes();

        if (response.status === 401) {
            const refreshResponse: RefreshTokenApi = await refresh();

            if (!refreshResponse.ok) {
                void reLogin();
                return { ok: false, error: tApi("api.errors.refreshUnable") };
            }

            token = refreshResponse.token;
            response = await fetchNotes();
        }

        const data = await response.json();
        const urls = data.page.content.map(n => n.url);

        const analyticsResponse = await fetch(`${NoteApi}/analytics/view-notes`, {
            method: "POST",
            headers: getHeaders(token),
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
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

export async function deleteNote(url, token) {
    async function fetchDelete() {
        return fetch(`${NoteApi}/note/${url}`, {
            method: "PATCH",
            headers: getHeaders(token)
        });
    }
    try {
        let response = await fetchDelete();

        if (response.status === 401) {
            const refreshResponse: RefreshTokenApi = await refresh();

            if (!refreshResponse.ok) {
                void reLogin();
                return { ok: false, error: tApi("api.errors.refreshUnable") };
            }

            token = refreshResponse.token;
            response = await deleteNote();
        }

        if (response.status === 204) {
            return { ok: true };
        }

        if (response.status === 403) {
            return { ok: false, error: tApi("api.errors.insufficientPermissions") };
        }

        const err = await response.json();
        return {
            ok: false,
            error: err.message || tApi("api.errors.deleteNoteError")
        };
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

export async function createNote(note, token) {
    async function fetchCreate() {
        return fetch(`${NoteApi}/note`, {
            method: 'POST',
            headers: getHeaders(token),
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
    }

    try {
        let response = await fetchCreate();

        if (response.status === 401) {
            const refreshResponse: RefreshTokenApi = await refresh();

            if (!refreshResponse.ok) {
                void reLogin();
                return { ok: false, error: tApi("api.errors.refreshUnable") };
            }

            token = refreshResponse.token;
            response = await fetchCreate();
        }

        if (response.status === 200) {
            return { ok: true, data: await response.json() };
        }

        if (response.status === 400) {
            return { ok: false, error: tApi("api.errors.invalidData") };
        }

        return {
            ok: false,
            error: tApi("api.errors.serverError", { status: response.status })
        };
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

export async function updateNote(note, token) {
    if (note.expirationType === "BURN_AFTER_TIME" && !note.expirationPeriod) {
        return { ok: false, error: tApi("api.errors.specifyTime") };
    }

    async function fetchNotes() {
        return fetch(`${NoteApi}/note/${note.url}`, {
            method: "PUT",
            headers: getHeaders(token),
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
    }

    try {
        let response = await fetchNotes();

        if (response.status === 401) {
            const refreshResponse: RefreshTokenApi = await refresh();

            if (!refreshResponse.ok) {
                void reLogin();
                return { ok: false, error: tApi("api.errors.refreshUnable") };
            }

            token = refreshResponse.token;
            response = await fetchNotes();
        }

        if (response.status === 200) {
            return { ok: true, data: await response.json() };
        }

        if (response.status === 400) {
            return { ok: false, error: tApi("api.errors.invalidTitle") };
        }

        if (response.status === 403) {
            return { ok: false, error: tApi("api.errors.insufficientEditPermissions") };
        }

        const err = await response.json();
        return {
            ok: false,
            error: err.message || tApi("api.errors.saveChangesError")
        };
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

//-------------------- API for user service --------------------

let setTokenRef = null;
let setUserRef = null;
let setNavigatedRef = null;

export function initAuthApi(setToken, setUser) {
    setTokenRef = setToken;
    setUserRef = setUser;
}

export function initNavigate(navigate) {
    setNavigatedRef = navigate;
}

export async function authentication(user, password) {
    try {
        const response = await fetch(`${UserApi}/auth/login`, {
            method: "PATCH",
            headers: getHeaders(null),
            credentials: "include",
            body: JSON.stringify({ login: user, password }),
        });

        if (response.ok) {
            const token = await response.text();
            return { ok: true, data: token };
        }

        return { ok: false, error: tApi("api.errors.loginError") };
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

export async function register(user, password) {
    try {
        const response = await fetch(`${UserApi}/user/register`, {
            method: "POST",
            headers: getHeaders(null),
            body: JSON.stringify({ login: user, password })
        });

        if (response.ok) {
            return await authentication(user, password);
        }

        if (response.status === 409) {
            return { ok: false, error: tApi("api.errors.userExists") };
        }

        return { ok: false, error: tApi("api.errors.registrationError") };
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

async function refresh(): Promise<RefreshTokenApi> {
    try {
        const response = await fetch(`${UserApi}/auth/refresh`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            await reLogin();
            return {ok: false};
        }

        const newToken = await response.text();
        if (setTokenRef) setTokenRef(newToken);
        return {ok: true, token: newToken};

    } catch (e) {
        await reLogin();
        return { ok: false, error: "Ошибка соединения" };
    }
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

        return { ok: false, error: tApi("api.errors.logoutError") };
    } catch {
        return { ok: false, error: tApi("api.errors.connectionError") };
    }
}

async function reLogin(): void {
    if (setTokenRef) setTokenRef(null);
    if (setUserRef) setUserRef(null);

    if (setNavigatedRef) setNavigatedRef('/login');
}