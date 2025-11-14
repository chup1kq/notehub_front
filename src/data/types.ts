type ExpirationType =
    | "Default"
    | "Burn after read"
    | "Burn after time";

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