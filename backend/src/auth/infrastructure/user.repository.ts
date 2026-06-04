import { Injectable } from "@nestjs/common";
import { UserRepositoryPort } from "../../domain/repositories/user.repository.port";
import { User } from "../../domain/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class UserRepository implements UserRepositoryPort {

  constructor(
    @InjectModel('User')
    private readonly userModel: Model<any>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel
      .findOne({ email })
      .lean();

    return doc ? UserMapper.toDomain(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel
      .findById(id)
      .lean();

    return doc ? UserMapper.toDomain(doc) : null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    const doc = await this.userModel
      .findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      })
      .lean();

    return doc ? UserMapper.toDomain(doc) : null;
  }

  async save(user: User): Promise<User> {
    const persistence = UserMapper.toPersistence(user);

    await this.userModel.updateOne(
      { _id: user.id },
      persistence,
      { upsert: true }
    );

    return user;
  }
}
