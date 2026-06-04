import { User } from "./user.entity"

export interface UserRepositoryPort {

  findByEmail(email: string): Promise<User | null>

  findById(id: string): Promise<User | null>

  save(user: User): Promise<User>

  findByResetToken(token: string): Promise<User | null>

}
