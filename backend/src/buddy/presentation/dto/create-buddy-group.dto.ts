import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateBuddyGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  route: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  time: string;

  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(50)
  maxMembers: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  startPoint: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  endPoint: string;

  @IsOptional()
  verified?: boolean;
}
