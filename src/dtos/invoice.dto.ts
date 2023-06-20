import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateItemDto } from './item.dto';

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
  @Type(() => CreateItemDto)
  readonly items: CreateItemDto[];
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

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDate()
  due_date?: Date;
}
