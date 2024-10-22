const request = require('supertest');
const express = require('express');
const router = require('../../routes/categories');
const Category = require('../../types/categorySchema');

jest.mock('../../types/categorySchema');

const app = express();
app.use(express.json());
app.use('/categories', router);

describe('Category API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /create', () => {
        it('should create a category', async () => {
            const categoryData = { name: 'Category A', description: 'Description A' };
            Category.mockImplementation(() => ({
                _id: '123456',
                ...categoryData,
                save: jest.fn().mockResolvedValue(categoryData),
            }));

            const response = await request(app).post('/categories/create').send(categoryData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject(categoryData);
            expect(Category).toHaveBeenCalledWith({
                _id: expect.any(String),
                ...categoryData,
            });
        });

        it('should return 400 if name or description is missing', async () => {
            const response = await request(app).post('/categories/create').send({ name: '' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Name and description are required');
        });
    });

    describe('PUT /edit/:id', () => {
        it('should edit a category', async () => {
            const categoryData = { name: 'Updated Category', description: 'Updated Description' };
            const categoryId = '123456';
            Category.findById = jest.fn().mockResolvedValue({
                _id: categoryId,
                name: 'Category A',
                description: 'Description A',
                save: jest.fn().mockResolvedValue({
                    _id: categoryId,
                    ...categoryData,
                }),
            });

            const response = await request(app).put(`/categories/edit/${categoryId}`).send(categoryData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
                _id: categoryId,
                ...categoryData,
            });
        });

        it('should return 404 if category not found', async () => {
            const categoryId = 'non-existent-id';
            Category.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app).put(`/categories/edit/${categoryId}`).send({ name: 'New Name' });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Category not found');
        });
    });

    describe('DELETE /delete/:id', () => {
        it('should delete a category', async () => {
            const categoryId = '123456';
            Category.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: categoryId });

            const response = await request(app).delete(`/categories/delete/${categoryId}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'deleted');
        });

        it('should return 404 if category not found', async () => {
            const categoryId = 'non-existent-id';
            Category.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const response = await request(app).delete(`/categories/delete/${categoryId}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Category not found');
        });
    });

    describe('GET /list', () => {
        it('should list all categories', async () => {
            const categories = [{ _id: '1', name: 'Category A' }, { _id: '2', name: 'Category B' }];
            Category.find = jest.fn().mockResolvedValue(categories);

            const response = await request(app).get('/categories/list');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual(categories);
        });
    });

    describe('GET /list/:search', () => {
        it('should search categories', async () => {
            const categories = [{ _id: '1', name: 'Category A' }];
            Category.find = jest.fn().mockResolvedValue(categories);

            const response = await request(app).get('/categories/list/filter?name=Category');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toEqual(categories);
        });

        it('should return 404 if no categories found', async () => {
            Category.find = jest.fn().mockResolvedValue([]);

            const response = await request(app).get('/categories/list/filter?name=NonExistent');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No categories found');
        });
    });
});