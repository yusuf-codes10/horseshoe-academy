type User = {
    id: number,
    username: string,
    email: string,
    fullName?: string | null,
    role: string,
    gender: string,
    createdAt: Date,
}

export type {User};