import { IsString, IsNotEmpty, IsUUID, Length } from 'class-validator';

export class AddMemberDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  role: string;
}
