import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0.01)
  price: number;
}

// export class CreateInvoiceItemDto {
//     @IsString()
//     @IsNotEmpty()
//     readonly name: string;

//     @IsNumber()
//     @IsNotEmpty()
//     readonly amount: number;

//     @IsNumber()
//     @IsNotEmpty()
//     readonly quantity: number;
//   }
