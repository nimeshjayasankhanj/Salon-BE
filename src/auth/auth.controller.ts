import { Controller, Post, Body, UseGuards, Request, UsePipes, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { response } from 'src/helpers/response';
import { SignUpValidation } from 'src/schema/user/sign-up.validation';
import { YupValidationPipe } from 'src/schema/validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() req, @Res() res) {
        try {
            const user = await this.authService.validateUser(req.email, req.password);
            if (user === null) {
                return res.status(400).json(response(400, 'Invalid username or password'));
            }
            const data = await this.authService.login(user);
            return res.status(200).json(response(200, 'User log successfully', data));
        } catch (error) {
            return response(500, 'Something went wrong', error);
        }
    }

    @Post('signup')
    @UsePipes(new YupValidationPipe(SignUpValidation)) //for validations
    async signup(@Body() req, @Res() res) {
        try {
            const isEmailUsed = this.authService.checkEmailUsed(req);
            if (isEmailUsed) {
                return res.status(400).json(response(400, 'Email already used'));
            }
            this.authService.signup(req);
            return res.status(201).json(response(201, 'User created'));
        } catch (error) {
            return response(500, 'Something went wrong', error);
        }
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Request() req) {
        const refreshToken = req.body.refresh_token;
        return this.authService.refresh(refreshToken);
    }
}
