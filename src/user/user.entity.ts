import { Message } from 'src/message/message.entity';
import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn({ unique: true })
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    user_agent: string;

    @Column()
    IP: string;

    @OneToMany(type => Message, message => message.user)
    messages: Message[];

}