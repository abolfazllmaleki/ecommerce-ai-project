// import { INestApplication } from '@nestjs/common';
// import { getConnectionToken } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';
// import * as request from 'supertest';

// import { createTestingApp } from '../setup/app.factory';
// import { makeProduct } from '../setup/factories/product.factory';
// import { clearDatabase } from '../setup/database';

// describe('POST /products', () => {
//   let app: INestApplication;
//   let connection: Connection;

//   beforeAll(async () => {
//     app = await createTestingApp();

//     connection = app.get<Connection>(getConnectionToken());
//   });

//   beforeEach(async () => {
//     await clearDatabase(connection);
//   });

//   afterAll(async () => {
//     await app.close();
//   });

//   it('should create a product', async () => {
//     const dto = makeProduct();

//     const response = await request(app.getHttpServer())
//       .post('/api/products')
//       .send(dto);

//     expect(response.status).toBe(201);

//     expect(response.body).toMatchObject({
//       name: dto.name,
//       price: dto.price,
//       brand: dto.brand,
//     });

//     expect(response.body.id || response.body._id).toBeDefined();
//   });
// });
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as request from 'supertest';

import { createTestingApp } from '../setup/app.factory';
import { makeProduct } from '../setup/factories/product.factory';
import { clearDatabase } from '../setup/database';
import { loginAsAdmin } from '../setup/auth';


describe('POST /products', () => {

  let app: INestApplication;

  let connection: Connection;

  let token: string;


  beforeAll(async () => {

    app = await createTestingApp();

    connection = app.get<Connection>(
      getConnectionToken(),
    );

  });


  beforeEach(async () => {

    await clearDatabase(connection);


    token = await loginAsAdmin(app);

  });



  afterAll(async () => {

    await connection.close();

    await app.close();

  });



  it('should create a product', async () => {


    const dto = makeProduct();


    const response = await request(
      app.getHttpServer(),
    )
      .post('/api/products')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .send(dto);



    expect(response.status).toBe(201);



    expect(response.body)
      .toMatchObject({
        name: dto.name,
        price: dto.price,
        brand: dto.brand,
      });



    expect(
      response.body.id ||
      response.body._id,
    )
      .toBeDefined();

  });

});