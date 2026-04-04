import { IsNotEmpty, IsString } from 'class-validator';

export class MetricParamDto {
  @IsString()
  @IsNotEmpty()
  uuid!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;
}
