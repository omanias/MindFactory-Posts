import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'createdAt'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password'], // Explicitly include password for auth
    });
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: id as any });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number,
  ): Promise<User> {
    if (id !== currentUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
}
