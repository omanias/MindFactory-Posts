import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
    let service: PostsService;
    let repository: Repository<Post>;

    const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
        userId: 1,
        user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
        },
        reactions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findAndCount: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                {
                    provide: getRepositoryToken(Post),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<PostsService>(PostsService);
        repository = module.get<Repository<Post>>(getRepositoryToken(Post));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should successfully create a post', async () => {
            const createPostDto = {
                title: 'Test Post',
                content: 'Test Content',
            };
            const userId = 1;

            mockRepository.create.mockReturnValue(mockPost);
            mockRepository.save.mockResolvedValue(mockPost);

            const result = await service.create(createPostDto, userId);

            expect(result).toEqual(mockPost);
            expect(mockRepository.create).toHaveBeenCalledWith({
                ...createPostDto,
                userId,
                likedBy: [],
                dislikedBy: [],
            });
            expect(mockRepository.save).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('findAll', () => {
        it('should return paginated posts', async () => {
            const posts = [mockPost];
            mockRepository.findAndCount.mockResolvedValue([posts, 1]);

            const result = await service.findAll(1, 10);

            expect(result).toEqual({
                data: posts,
                total: 1,
            });
            expect(mockRepository.findAndCount).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a post by id', async () => {
            mockRepository.findOneBy.mockResolvedValue(mockPost);

            const result = await service.findOne(1);

            expect(result).toEqual(mockPost);
            expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw NotFoundException when post not found', async () => {
            mockRepository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should successfully update a post', async () => {
            const updatePostDto = {
                title: 'Updated Title',
                content: 'Updated Content',
            };

            const updatedPost = { ...mockPost, ...updatePostDto };
            mockRepository.findOneBy.mockResolvedValue(mockPost);
            mockRepository.save.mockResolvedValue(updatedPost);

            const result = await service.update(1, updatePostDto, 1);

            expect(result).toEqual(updatedPost);
            expect(mockRepository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException when updating non-existent post', async () => {
            mockRepository.findOneBy.mockResolvedValue(null);

            await expect(
                service.update(999, { title: 'Test' }, 1),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should successfully remove a post', async () => {
            mockRepository.findOneBy.mockResolvedValue(mockPost);
            mockRepository.remove.mockResolvedValue(mockPost);

            await service.remove(1, 1);

            expect(mockRepository.remove).toHaveBeenCalledWith(mockPost);
        });

        it('should throw NotFoundException when removing non-existent post', async () => {
            mockRepository.findOneBy.mockResolvedValue(null);

            await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
        });
    });
});
