import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginBodyDto, LoginResponseDto, RegisterUserBodyDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  userLogin(@Body() body: LoginBodyDto) {
    return this.authService.login({ body })
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  register(@Body() body: RegisterUserBodyDto) {
    return this.authService.register(body)
  }
}
