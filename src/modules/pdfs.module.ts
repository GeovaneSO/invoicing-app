import { Module } from '@nestjs/common';
import { PdfsController } from '../controllers/pdfs/pdfs.controller';

@Module({
  controllers: [PdfsController],
})
export class PdfsModule {}
