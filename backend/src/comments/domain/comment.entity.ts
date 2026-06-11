export interface CommentProps {
  id?: string | null;
  userId: string;
  productId: string;
  content: string;
  likes?: number;
  dislikes?: number;
  isActive?: boolean;
  likedBy?: string[];
  dislikedBy?: string[];
  parentCommentId?: string | null;
  depth?: number;
  replyCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Comment {
  public readonly id: string | null;
  public userId: string;
  public productId: string;
  public content: string;
  public likes: number;
  public dislikes: number;
  public isActive: boolean;
  public likedBy: string[];
  public dislikedBy: string[];
  public parentCommentId: string | null;
  public depth: number;
  public replyCount: number;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: CommentProps) {
    if (!props.content?.trim()) {
      throw new Error('متن نظر الزامی است.');
    }
    if (props.content.length > 1000) {
      throw new Error('متن نظر نباید بیشتر از ۱۰۰۰ کاراکتر باشد.');
    }

    this.id = props.id ?? null;
    this.userId = props.userId;
    this.productId = props.productId;
    this.content = props.content;
    this.likes = props.likes ?? 0;
    this.dislikes = props.dislikes ?? 0;
    this.isActive = props.isActive ?? true;
    this.likedBy = props.likedBy ?? [];
    this.dislikedBy = props.dislikedBy ?? [];
    this.parentCommentId = props.parentCommentId ?? null;
    this.depth = props.depth ?? 0;
    this.replyCount = props.replyCount ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  updateContent(content: string, isActive?: boolean): void {
    if (!content?.trim()) {
      throw new Error('متن نظر الزامی است.');
    }
    this.content = content;
    if (isActive !== undefined) this.isActive = isActive;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  toPlainObject(): Record<string, unknown> {
    return {
      _id: this.id,
      id: this.id,
      userId: this.userId,
      productId: this.productId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      isActive: this.isActive,
      likedBy: this.likedBy,
      dislikedBy: this.dislikedBy,
      parentCommentId: this.parentCommentId,
      depth: this.depth,
      replyCount: this.replyCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromPersistence(data: any): Comment {
    return new Comment({
      id: data?._id?.toString?.() ?? data?.id ?? null,
      userId: data.userId?.toString?.() ?? data.userId,
      productId: data.productId?.toString?.() ?? data.productId,
      content: data.content,
      likes: data.likes,
      dislikes: data.dislikes,
      isActive: data.isActive,
      likedBy: (data.likedBy ?? []).map((id: any) => id?.toString?.() ?? id),
      dislikedBy: (data.dislikedBy ?? []).map((id: any) => id?.toString?.() ?? id),
      parentCommentId: data.parentCommentId?.toString?.() ?? data.parentCommentId ?? null,
      depth: data.depth,
      replyCount: data.replyCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
