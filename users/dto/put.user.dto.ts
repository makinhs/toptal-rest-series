export interface PutUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    permissionFlags: number;
}
