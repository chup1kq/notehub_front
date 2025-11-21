export const ru = {
    notFound: {
        message: "Извините, информация, которую вы ищете, не существует или была удалена."
    },
    auth: {
        login: "Войти",
        logout: "Выйти",
        register: "Зарегистрироваться",
        noAccountYet: "Еще нет аккаунта?",
        alreadyHaveAnAccount: "Уже есть аккаунт?",
        loginPlaceholder: "Логин",
        passwordPlaceholder: "Пароль",
        confirmPasswordPlaceholder: "Подтвердите пароль",
        passwordsNotMatch: "Пароли не совпадают"
    },
    notes: {
        create: "Создать",
        titlePlaceholder: "Введите заголовок заметки",
        contentPlaceholder: "Введите ваш текст",
        numberOfNotes: "Заметок",
        views: "Просмотров",
        noNotes: "Заметок еще нет",
        createNew: "Создайте новую",
        edit: "Редактировать",
        share: "Поделиться",
        delete: "Удалить"
    },
    modals: {
        confirm: "Продолжить",
        cancel: "Отмена"
    },
    expiration: {
        typeOfDelete: "Тип удаления",
        never: "Никогда",
        burnAfterRead: "Сгорает по прочтении",
        burnByPeriod: "Сгорает по времени"
    },
    header: {
        logoutConfirm: "Вы уверены, что хотите выйти из аккаунта?",
        openMenu: "Открыть меню"
    },
    api: {
        errors: {
            unauthorizedAccess: "Неавторизованный доступ. Пожалуйста, войдите в систему.",
            noteNotFound: "Заметка не найдена.",
            serverError: "Ошибка сервера: {status}",
            connectionError: "Ошибка соединения с сервером",
            insufficientPermissions: "Недостаточно прав для удаления заметки",
            deleteNoteError: "Ошибка при удалении заметки",
            invalidData: "Неверные данные",
            specifyTime: "Укажите время для Burn by period",
            invalidTitle: "Недопустимые символы в заголовке. Только английские буквы и цифры.",
            insufficientEditPermissions: "Недостаточно прав для редактирования",
            saveChangesError: "Ошибка при сохранении изменений",
            loadNotesError: "Ошибка загрузки заметок: {status}",
            loginError: "Ошибка входа: проверьте логин и пароль",
            userExists: "Пользователь уже существует",
            registrationError: "Ошибка регистрации",
            logoutError: "Ошибка выхода",
            refreshUnable: "Не удалось обновить токен",
            unavailableNote: "Извините, заметка больше недоступна"
        }
    },
    ui: {
        clipboard: {
            copied: "Ссылка скопирована в буфер обмена!",
            copyFailed: "Не удалось скопировать ссылку",
        },
        auth: {
            required: "Необходима авторизация"
        },
        note: {
            deleteFailed: "Ошибка при удалении заметки",
            deleteError: "Произошла ошибка при удалении"
        }
    },
    editNote: {
        specifyDateTime: "Пожалуйста, укажите дату и время удаления.",
        changesSaved: "Изменения успешно сохранены",
        deleteDateTime: "Дата и время удаления",
        willBeDeleted: "Заметка будет удалена:",
        save: "Сохранить"
    },
    user: {
        loading: "Загрузка...",
        previous: "Назад",
        next: "Вперед",
        page: "Страница",
        of: "из",
        createNewNote: "Создайте новую"
    }
};
