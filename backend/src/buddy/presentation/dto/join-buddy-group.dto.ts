import { IsOptional, IsString, MaxLength } from 'class-validator';

export class JoinBuddyGroupDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  memberName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  sessionId?: string;
}
