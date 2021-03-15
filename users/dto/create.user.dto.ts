export interface CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    permissionLevel?: number;
}
