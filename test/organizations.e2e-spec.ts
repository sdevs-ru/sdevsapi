import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { randomUUID } from 'crypto';

describe('Organizations (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // поднимаем всё приложение
    }).compile();

    app = moduleFixture.createNestApplication();

    // те же пайпы, что и в main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /organizations → creates organization', async () => {
    await request(app.getHttpServer())
      .post('/organizations')
      .send({
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Acme',
      })
      .expect(201);
  });

  it('POST /organizations/:id/members → adds member', async () => {
    const orgId = randomUUID();
    const userId = randomUUID();

    // 1️⃣ создаём организацию
    await request(app.getHttpServer())
      .post('/organizations')
      .send({
        id: orgId,
        name: 'Acme',
      })
      .expect(201);

    // 2️⃣ добавляем участника
    await request(app.getHttpServer())
      .post(`/organizations/${orgId}/members`)
      .send({
        userId,
        role: 'member',
      })
      .expect(201);
  });

  it('DELETE /organizations/:id/members/:userId → removes member', async () => {
    const orgId = randomUUID();
    const userId = randomUUID();

    // создаём организацию
    await request(app.getHttpServer())
      .post('/organizations')
      .send({
        id: orgId,
        name: 'Acme',
      })
      .expect(201);

    // добавляем участника
    await request(app.getHttpServer())
      .post(`/organizations/${orgId}/members`)
      .send({
        userId,
        role: 'member',
      })
      .expect(201);

    // удаляем участника
    await request(app.getHttpServer())
      .delete(`/organizations/${orgId}/members/${userId}`)
      .expect(200);
  });
});
