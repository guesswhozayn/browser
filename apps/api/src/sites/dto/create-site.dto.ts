import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+(\.[a-z0-9-]+)+$/, {
    message: 'address must be a valid host format (e.g. androon-lahore.zz)',
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  html: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}

