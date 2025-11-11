export interface UpdatePasswordPayload {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}



