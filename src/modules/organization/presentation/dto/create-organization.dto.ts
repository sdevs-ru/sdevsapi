import { IsString, IsUUID, Length } from 'class-validator';

export class CreateOrganizationDto {
  @IsUUID()
  id: string;

  @IsString()
  @Length(2, 300)
  name: string;
}
