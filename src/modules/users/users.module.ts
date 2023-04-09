import { Module } from '@nestjs/common';
import { UsersController } from 'src/controllers/users/users.controller';

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
