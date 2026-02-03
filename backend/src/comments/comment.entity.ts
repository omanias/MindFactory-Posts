import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne('User', 'comments')
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne('Post', 'comments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}
