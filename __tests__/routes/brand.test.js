const request = require('supertest');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = require('../../routes/brands');
const Brand = require('../../types/brandSchema');

jest.mock('../../types/brandSchema');

const app = express();
app.use(express.json());
app.use('/brands', router);

describe('Brand API Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a brand', async () => {
        const brandData = { name: 'Brand A' };

        Brand.mockImplementation(() => ({
            _id: uuidv4(),
            name: brandData.name,
            save: jest.fn().mockResolvedValue({ ...brandData, _id: uuidv4() }),
        }));

        const response = await request(app).post('/brands/create').send(brandData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', 'Brand A');
        expect(response.body.data).toHaveProperty('_id');
    });

    it('should return 400 if brand name is missing', async () => {
        const response = await request(app).post('/brands/create').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Brand name is required');
    });

    it('should edit a brand', async () => {
        const brandData = { name: 'Brand A' };
        const updatedBrand = { name: 'Updated Brand A' };

        Brand.findById = jest.fn().mockResolvedValue({
            ...brandData,
            save: jest.fn().mockResolvedValue(updatedBrand),
        });

        const response = await request(app).put('/brands/edit/123').send(updatedBrand);
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(updatedBrand);
    });

    it('should return 400 if brand name is missing on edit', async () => {
        const response = await request(app).put('/brands/edit/123').send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Brand name is required');
    });

    it('should delete a brand', async () => {
        Brand.findByIdAndDelete = jest.fn().mockResolvedValue(true);
        
        const response = await request(app).delete('/brands/delete/123');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('deleted');
    });

    it('should list all brands', async () => {
        const brands = [{ name: 'Brand A' }, { name: 'Brand B' }];
        Brand.find = jest.fn().mockResolvedValue(brands);
        
        const response = await request(app).get('/brands/list');
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(brands);
    });

    it('should search for brands', async () => {
        const brands = [{ name: 'Brand A' }];
        Brand.find = jest.fn().mockResolvedValue(brands);

        const response = await request(app).get('/brands/list/someSearchTerm');
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(brands);
    });
});
