import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import type { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}


  @Post('register')
  register(@Body() request: RegisterUserDto) {
    console.log('Register endpoint hit');
    return this.client.send('auth.register.user', request)
    .pipe(
      catchError(err => {
        throw new RpcException(err);
      })
    );
  }

  @Post('login')
  login(@Body() request: LoginUserDto) {
    return this.client.send('auth.login.user', request);
  }

  @UseGuards( AuthGuard )
  @Get('verify')
  verifyToken( @User() user: CurrentUser, @Token() token: string  ) {

    // const user = req['user'];
    // const token = req['token'];

    // return this.client.send('auth.verify.user', {});
    console.log('Verify endpoint hit');
    return { user, token }
  }

}
