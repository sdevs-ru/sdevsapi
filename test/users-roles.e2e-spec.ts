import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Users + Roles (e2e)', () => {
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

    let userId: string;
    let roleId: string;

    it('Create role', async () => {
        const res = await request(httpServer)
            .post('/roles')
            .send({
                code: 'MANAGER',
                name: 'Manager',
            })
            .expect(201);

        roleId = res.body.id;
    });

    it('Create user', async () => {
        const res = await request(httpServer)
            .post('/users')
            .send({
                email: 'user@test.com',
            })
            .expect(201);

        userId = res.body.id;
    });

    it('Assign role to user', async () => {
        await request(httpServer)
            .post(`/users/${userId}/roles/${roleId}`)
            .expect(200);
    });

    it('User should contain role', async () => {
        const res = await request(httpServer)
            .get(`/users/${userId}`)
            .expect(200);

        expect(res.body.roleIds).toContain(roleId);
    });

    it('Assign same role twice — should be idempotent', async () => {
        await request(httpServer)
            .post(`/users/${userId}/roles/${roleId}`)
            .expect(200);
    });

    it('Remove role from user', async () => {
        await request(httpServer)
            .delete(`/users/${userId}/roles/${roleId}`)
            .expect(200);
    });

    it('User should not contain role anymore', async () => {
        const res = await request(httpServer)
            .get(`/users/${userId}`)
            .expect(200);

        expect(res.body.roleIds).not.toContain(roleId);
    });

    it('Assign role that does not exist', async () => {
        await request(httpServer)
            .post(`/users/${userId}/roles/00000000-0000-0000-0000-000000000000`)
            .expect(404);
    });
});
