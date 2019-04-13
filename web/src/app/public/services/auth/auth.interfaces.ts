
export interface AuthDef {
    id: number;
    name: string;
    password: string;
}

export interface LoginDef {
    email: string;
    password: string;
}

export interface RegistrationDef {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}