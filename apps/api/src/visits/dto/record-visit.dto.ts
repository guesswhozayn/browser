import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisitVia } from '../../schemas/visit.schema';

export class RecordVisitDto {
  @IsString()
  @IsNotEmpty()
  person: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(['typed', 'link', 'history', 'search', 'back', 'forward'])
  via: VisitVia;

  @IsOptional()
  visitedAt?: string;
}
