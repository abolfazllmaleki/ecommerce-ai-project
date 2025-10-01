// src/comments/comments.controller.ts
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
  DefaultValuePipe 
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/schemas/user.schema';
@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')

export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user.userId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get comments for a product' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  findAllByProduct(
    @Param('productId') productId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Request() req
  ) {
    // return this.commentsService.findAllByProduct(productId, page, limit, req.user.userId);
    return this.commentsService.findAllByProduct(productId, page, limit);
  }

  @Get('replies/:commentId')
  @ApiOperation({ summary: 'Get replies for a comment' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully' })
  findReplies(
    @Param('commentId') commentId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Request() req
  ) {
    return this.commentsService.findReplies(commentId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific comment' })
  @ApiResponse({ status: 200, description: 'Comment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    return this.commentsService.update(id, updateCommentDto, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(id, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiOperation({ summary: 'Like/unlike a comment' })
  @ApiResponse({ status: 200, description: 'Like status updated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  likeComment(@Param('id') id: string, @Request() req) {
    return this.commentsService.likeComment(id, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/dislike')
  @ApiOperation({ summary: 'Dislike/undislike a comment' })
  @ApiResponse({ status: 200, description: 'Dislike status updated successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  dislikeComment(@Param('id') id: string, @Request() req) {
    return this.commentsService.dislikeComment(id, req.user.userId);
  }
}