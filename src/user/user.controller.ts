import { Controller, Get } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @Get('list')
    getAll(): Promise<any[]> {
        return this.usersService.findAll().then(users => users.map(user => ({ name: user.name, id: user.id })));
    }
}
