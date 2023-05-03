import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  readonly customerName: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsDateString()
  @IsNotEmpty()
  readonly due_date: Date;

  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  readonly items: CreateInvoiceItemDto[];
}

export class CreateInvoiceItemDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsNumber()
  @IsNotEmpty()
  readonly quantity: number;
}
