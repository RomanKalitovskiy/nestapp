import {
  IsNumber,
  IsString,
  Min,
  Max,
  IsNotEmpty,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }: { value: string }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
