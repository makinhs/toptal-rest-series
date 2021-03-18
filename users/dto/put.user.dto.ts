export interface PutUserDto {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    permissionLevel: number;
}