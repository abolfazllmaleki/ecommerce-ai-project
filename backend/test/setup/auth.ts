import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../../src/users/domain/user.entity';


export async function loginAsAdmin(
  app: INestApplication,
): Promise<string> {

  const userModel = app.get<Model<User>>(
    getModelToken(User.name),
  );


  const password = 'Password123!';

  const email = `admin-${Date.now()}@test.com`;


  await userModel.create({
    name: 'E2E Admin',
    email,
    password: await bcrypt.hash(password, 12),
    role: 'ADMIN',
  });


  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({
      email,
      password,
    });


  if (response.status !== 200) {
    console.log(response.body);

    throw new Error(
      `Login failed: ${response.status}`,
    );
  }


  return response.body.access_token;
}