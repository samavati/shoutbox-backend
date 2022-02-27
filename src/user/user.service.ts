import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async add(user: Omit<User, 'messages'>): Promise<User> {
        return this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    findByName(name: string): Promise<User> {
        return this.usersRepository.findOne({ name });
    }

    async handleJoin(user: Omit<User, 'messages'>){
        const presentUser = await this.findByName(user.name);
        if (!presentUser) {
            return this.add(user);
        }

        throw new BadRequestException(`${user.name} is taken. try another name.`)
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }
}