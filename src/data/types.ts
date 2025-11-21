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
    url: string;
    title: string;
    content: string;
    createdAt: Date;
    expirationType: ExpirationType;
    expirationPeriod: string;
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