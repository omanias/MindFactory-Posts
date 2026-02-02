import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postsRepository: Repository<Post>,
    ) { }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Post[], total: number }> {
        const [data, total] = await this.postsRepository.findAndCount({
            order: { createdAt: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });
        return { data, total };
    }

    create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
        const newPost = this.postsRepository.create({
            ...createPostDto,
            userId,
            likedBy: [],
            dislikedBy: [],
        });
        return this.postsRepository.save(newPost);
    }

    async findOne(id: number): Promise<Post> {
        const post = await this.postsRepository.findOneBy({ id: id as any });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    async like(id: number, userId: number): Promise<Post> {
        const post = await this.findOne(id);

        // Remove from dislike if exists
        post.dislikedBy = post.dislikedBy.filter(uid => uid !== userId);

        if (post.likedBy.includes(userId)) {
            // Toggle off
            post.likedBy = post.likedBy.filter(uid => uid !== userId);
        } else {
            post.likedBy.push(userId);
        }

        return this.postsRepository.save(post);
    }

    async dislike(id: number, userId: number): Promise<Post> {
        const post = await this.findOne(id);

        // Remove from like if exists
        post.likedBy = post.likedBy.filter(uid => uid !== userId);

        if (post.dislikedBy.includes(userId)) {
            // Toggle off
            post.dislikedBy = post.dislikedBy.filter(uid => uid !== userId);
        } else {
            post.dislikedBy.push(userId);
        }

        return this.postsRepository.save(post);
    }

    async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
        const post = await this.findOne(id);

        if (post.userId !== userId) {
            throw new ForbiddenException('You can only edit your own posts');
        }

        Object.assign(post, updatePostDto);
        return this.postsRepository.save(post);
    }

    async remove(id: number, userId: number): Promise<void> {
        const post = await this.findOne(id);

        if (post.userId !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        await this.postsRepository.remove(post);
    }
}
