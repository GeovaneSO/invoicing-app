import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateInvoiceDto } from 'src/dtos/invoice.dto';
import { InvoicesService } from '../../services/invoices/invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesServices: InvoicesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public async create(@Body() data: CreateInvoiceDto, @Request() req) {
    return await this.invoicesServices.create(data, req.user.id);
  }
}
