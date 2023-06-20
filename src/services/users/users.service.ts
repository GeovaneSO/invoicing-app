import { MailerService } from '@nestjs-modules/mailer';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import * as cache from 'memory-cache';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  RecoverPassDto,
  UserListResponseDto,
  UserRecoveryPasswordDto,
  UserResponseDto,
} from 'src/dtos/user.dto';
import { User } from 'src/schemas/user.schema';
import { EmailService } from '../emails/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<User>,
    private mailerService: MailerService,
    private emailService: EmailService,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const hashPassword = await bcryptjs.hash(data.password, 10);

    const createdUser = await new this.model({
      password: hashPassword,
      name: data.name,
      email: data.email,
    }).save();

    // to: createdUser.email,
    // subject: 'Email de confirmação',
    // template: 'email_confirmation',
    // context: {
    //   token: createdUser.confirmationToken,
    // },
    await this.emailService.sendEmail(
      createdUser.email,
      'Email de confirmação',
      'email_confirmation',
      {
        token: createdUser.confirmationToken,
      },
    );
    // const mail = {
    //   to: createdUser.email,
    //   from: process.env.EMAIL_APPLICATION,
    //   subject: 'Email de confirmação',
    //   template: 'email_confirmation',
    //   context: {
    //     token: createdUser.confirmationToken,
    //   },
    // };

    // await this.mailerService.sendMail(mail);

    return new UserResponseDto(createdUser);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.model.findOne({ email }).exec();
  }

  async confirmEmailWithToken(confirmationToken: string): Promise<object> {
    const user = await this.model
      .findOneAndUpdate(
        { confirmationToken },
        { confirmationToken: null },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('Invalid token');
    }

    return {
      message: 'Email confirmado',
    };
  }

  async sendEmailRecoverPassword(data: RecoverPassDto): Promise<object> {
    let pin = Math.floor(Math.random() * (80000 - 99999 + 1)) + 80000;

    if (pin < 0) {
      pin = pin * -1;
    }

    const hashPin = await bcryptjs.hash(pin.toString(), 10);

    const user = await this.findByEmail(data.email);

    cache.put('EMAIL_USER', user?.email, 600000);

    await this.model
      .findOneAndUpdate({ email: data.email }, { pin: hashPin }, { new: true })
      .exec();

    await this.emailService.sendEmail(
      data.email,
      'Recuperação de senha',
      'recover_pass',
      {
        pin,
      },
    );

    // const mail = {
    //   to: data.email,
    //   from: process.env.EMAIL_APPLICATION,
    //   subject: 'Recuperação de senha',
    //   template: 'recover_pass',
    //   context: {
    //     pin: pin,
    //   },
    // };

    // await this.mailerService.sendMail(mail);

    return {
      message: 'Pin code sent to email',
    };
  }

  async recoverPass(data: UserRecoveryPasswordDto): Promise<object> {
    const valorCache = cache.get('EMAIL_USER');

    const valorString = valorCache !== undefined ? valorCache : '';

    if (!valorString) {
      throw new NotFoundException('Invalid token');
    }

    await this.model
      .findOneAndUpdate(
        { pin: data.pin },
        {
          password: data.password && (await bcryptjs.hash(data.password, 10)),
          pin: null,
        },
        { new: true },
      )
      .exec();
    const userFromEmailCache = await this.findByEmail(valorString);

    if (!userFromEmailCache) {
      throw new HttpException(
        `Invalid email or password`,
        HttpStatus.BAD_REQUEST,
      );
    }

    cache.del('EMAIL_USER');

    return { message: 'Password changed successfully!' };
  }

  async findAll(): Promise<UserListResponseDto> {
    const users = await this.model.find().exec();

    return new UserListResponseDto(users);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.model.findOne({ id }).exec();

    return new UserResponseDto(user);
  }

  async updateUser(
    id: string,
    { name, password }: Partial<User>,
  ): Promise<UserResponseDto> {
    const userFromUpdate = await this.model.findOne({ id }).exec();

    const user = await this.model
      .findOneAndUpdate(
        { id },
        {
          name: name ? name : userFromUpdate.name,
          password: password
            ? await bcryptjs.hash(password, 10)
            : userFromUpdate.password,
        },
        { new: true },
      )
      .exec();
    return new UserResponseDto(user);
  }

  async deleteUser(id: string): Promise<object> {
    const user = await this.model.findOneAndDelete({ id: id }).exec();

    return user;
  }
}
