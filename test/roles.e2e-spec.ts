import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Roles (e2e)', () => {
    let app: INestApplication;
    let httpServer: any;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        httpServer = app.getHttpServer();

        dataSource = app.get(DataSource);
        await dataSource.synchronize(true); 
    });

    afterAll(async () => {
        await app.close();
    });

    let createdRoleId: string;

    it('POST /roles — create role', async () => {
        const res = await request(httpServer)
            .post('/roles')
            .send({
                code: 'ADMIN',
                name: 'Administrator',
            })
            .expect(201);

        expect(res.body.id).toBeDefined();
        expect(res.body.code).toBe('ADMIN');

        createdRoleId = res.body.id;
    });

    it('GET /roles — list roles', async () => {
        const res = await request(httpServer)
            .get('/roles')
            .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('POST /roles — duplicate code should fail', async () => {
        await request(httpServer)
            .post('/roles')
            .send({
                code: 'ADMIN',
                name: 'Duplicate',
            })
            .expect(400);
    });

    it('DELETE /roles/:id — delete role', async () => {
        await request(httpServer)
            .delete(`/roles/${createdRoleId}`)
            .expect(200);
    });

    it('DELETE /roles/:id — not found', async () => {
        await request(httpServer)
            .delete(`/roles/${createdRoleId}`)
            .expect(404);
    });
});
