import { IsNotEmpty, IsString } from 'class-validator';

export class UuidParamDto {
  @IsString()
  @IsNotEmpty()
  uuid!: string;
}
