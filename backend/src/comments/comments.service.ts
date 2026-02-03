import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(
    postId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const newComment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
      userId,
    });
    return this.commentsRepository.save(newComment);
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { postId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number, userId: number): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
  }

  async countByPost(postId: number): Promise<number> {
    return this.commentsRepository.count({ where: { postId } });
  }
}
