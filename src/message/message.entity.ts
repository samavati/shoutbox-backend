import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  date: number;

  @Column('longtext')
  message: string;

  @ManyToOne(type => User, user => user.messages, { onDelete: "SET NULL" })
  user: User;
}