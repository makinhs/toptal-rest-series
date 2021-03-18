import { PutUserDto } from './put.user.dto';

export interface PatchUserDto extends Partial<PutUserDto> {}