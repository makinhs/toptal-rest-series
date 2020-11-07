export interface UsersDto {
   id: string;
   username: string;
   password: string;
   email?: string;
   firstName?: string;
   lastName?: string;
   permissionLevel?: number;
}