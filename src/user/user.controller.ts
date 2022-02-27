import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @Get('list')
    getAll(): Promise<any[]> {
        return this.usersService.findAll().then(users => users.map(user => ({ name: user.name, id: user.id })));
    }

    @Post('join')
    joinRequest(@Req() req: Request, @Body() body: { name: string, socketId: string }) {
        return this.usersService.handleJoin({ name: body.name, id: body.socketId, IP: req.ip, user_agent: req.headers['user-agent'] });
    }
}
