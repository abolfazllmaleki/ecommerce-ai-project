import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CreateCommentUseCase } from '../application/use-cases/create-comment.usecase';
import { FindCommentsByProductUseCase } from '../application/use-cases/find-comments-by-product.usecase';
import { FindCommentRepliesUseCase } from '../application/use-cases/find-comment-replies.usecase';
import { FindCommentByIdUseCase } from '../application/use-cases/find-comment-by-id.usecase';
import { UpdateCommentUseCase } from '../application/use-cases/update-comment.usecase';
import { DeleteCommentUseCase } from '../application/use-cases/delete-comment.usecase';
import { LikeCommentUseCase } from '../application/use-cases/like-comment.usecase';
import { DislikeCommentUseCase } from '../application/use-cases/dislike-comment.usecase';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly createComment: CreateCommentUseCase,
    private readonly findCommentsByProduct: FindCommentsByProductUseCase,
    private readonly findCommentReplies: FindCommentRepliesUseCase,
    private readonly findCommentById: FindCommentByIdUseCase,
    private readonly updateComment: UpdateCommentUseCase,
    private readonly deleteComment: DeleteCommentUseCase,
    private readonly likeComment: LikeCommentUseCase,
    private readonly dislikeComment: DislikeCommentUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  create(@Body() dto: CreateCommentDto, @Request() req) {
    return this.createComment.execute(dto, req.user.userId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get comments for a product' })
  findAllByProduct(
    @Param('productId') productId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.findCommentsByProduct.execute(productId, page, limit);
  }

  @Get('replies/:commentId')
  findReplies(
    @Param('commentId') commentId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.findCommentReplies.execute(commentId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findCommentById.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @Request() req) {
    return this.updateComment.execute(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.deleteComment.execute(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Request() req) {
    return this.likeComment.execute(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/dislike')
  dislike(@Param('id') id: string, @Request() req) {
    return this.dislikeComment.execute(id, req.user.userId);
  }
}
