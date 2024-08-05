import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { response } from 'src/helpers/response';

@Controller('user')
export class UsersController {

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createUser(@Body() req, @Res() res) {
        try {
            return res.status(201).json(response(201, 'User created', req));
        } catch (error) {
            return res.status(500).json(response(500, 'something went wrong'));
        }
    }
}
