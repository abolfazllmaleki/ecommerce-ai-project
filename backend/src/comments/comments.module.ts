import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsController } from './interface/comments.controller';
import { CommentRepository } from './infrastructure/comment.repository';
import { ProductsModule } from '../products/products.module';
import { CreateCommentUseCase } from './application/use-cases/create-comment.usecase';
import { FindCommentsByProductUseCase } from './application/use-cases/find-comments-by-product.usecase';
import { FindCommentRepliesUseCase } from './application/use-cases/find-comment-replies.usecase';
import { FindCommentByIdUseCase } from './application/use-cases/find-comment-by-id.usecase';
import { UpdateCommentUseCase } from './application/use-cases/update-comment.usecase';
import { DeleteCommentUseCase } from './application/use-cases/delete-comment.usecase';
import { LikeCommentUseCase } from './application/use-cases/like-comment.usecase';
import { DislikeCommentUseCase } from './application/use-cases/dislike-comment.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    ProductsModule,
  ],
  controllers: [CommentsController],
  providers: [
    { provide: 'ICommentRepository', useClass: CommentRepository },
    CreateCommentUseCase,
    FindCommentsByProductUseCase,
    FindCommentRepliesUseCase,
    FindCommentByIdUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    LikeCommentUseCase,
    DislikeCommentUseCase,
  ],
  exports: ['ICommentRepository'],
})
export class CommentsModule {}
