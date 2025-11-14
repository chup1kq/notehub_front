export async function getNote(url: string){

}

export async function getNotes(login: string, page: number) {

}

export async function deleteNote(url: string) {

}

export async function addNote(note: Note) {

}

export async function updateNote(note: Note) {

}

export async function authentication(user: string, password: string) {
    const response = await fetch('http://localhost:8081/api/v1/auth/login', {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
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
        return await response.text();
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
