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
    content: string;
    registeredUsers: number;
    anonymousUsers: number
}