type ExpirationType =
    | "DEFAULT"
    | "BURN_AFTER_READ"
    | "BURN_AFTER_TIME";


type Page = {
    currentPage: number;
    totalPages: number;
    contentOnPage: number;
    totalContent: number;
    content: Array<Note>;
}

type Note = {
        id: string;
        createdAt: Date;
        title: string;
        expirationType: ExpirationType;
        expirationPeriod: string;
        content: string;
        registeredUsers: number;
        anonymousUsers: number;
}

type NoteCreate = {
    title: string;
    content: string;
    expirationType: ExpirationType;
    expirationPeriod?: string | null;
}

type RefreshTokenApi =
    | { ok: true; token: string }
    | { ok: false };