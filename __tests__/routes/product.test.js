const request = require('supertest');
const express = require('express');
const productRoutes = require('../../routes/products');
const Product = require('../../types/productsSchema');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

jest.mock('../../types/productsSchema');

describe('Product Routes', () => {
    
    describe('POST /api/products/create', () => {
        it('should create a product successfully', async () => {
            const productData = {
                name: 'New Product',
                description: 'This is a new product',
                price: 50,
                inventory: 100,
                category: 'New Category',
                brand: 'New Brand',
            };

            Product.prototype.save = jest.fn().mockResolvedValue(productData);

            const response = await request(app)
                .post('/api/products/create')
                .send(productData);

            expect(response.body).toHaveProperty('message', 'created');
        });

        it('should return 400 if there is a validation error', async () => {
            const invalidProductData = {
                name: 'Invalid Product',
                description: 'This is an invalid product',
                price: null,
                inventory: 100,
                category: 'Invalid Category',
                brand: 'Invalid Brand',
            };

            const response = await request(app)
                .post('/api/products/create')
                .send(invalidProductData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'All fields are required');
        });
    });
    
    describe('GET /api/products/list', () => {
        it('should list all products', async () => {
            const productData = [
                {
                    name: 'Test Product',
                    description: 'This is a test product',
                    price: 99.99,
                    inventory: 100,
                    category: 'Test Category',
                    brand: 'Test Brand',
                },
            ];

            Product.find = jest.fn().mockResolvedValue(productData);

            const response = await request(app).get('/api/products/list').expect(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0]).toHaveProperty('name', productData[0].name);
        });
    });

    describe('PUT /api/products/edit/:id', () => {
        it('should edit a product', async () => {
            const productData = {
                _id: '12345',
                name: 'Old Product',
                description: 'Old Description',
                price: 50,
                inventory: 100,
                category: 'Old Category',
                brand: 'Old Brand',
                save: jest.fn()
            };

            const updatedData = {
                name: 'Updated Product',
                price: 75
            };

            Product.findById = jest.fn().mockResolvedValue(productData);

            Product.prototype.save = jest.fn().mockResolvedValue(productData);

            const response = await request(app)
                .put(`/api/products/edit/${productData._id}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe(updatedData.name);
            expect(Product.findById).toHaveBeenCalledWith(productData._id);
        });
    });

    describe('DELETE /api/products/delete/:id', () => {
        it('should delete a product', async () => {
            const productData = {
                _id: '12345',
                name: 'Test Product',
                description: 'This is a test product',
                price: 99.99,
                inventory: 100,
                category: 'Test Category',
                brand: 'Test Brand',
            };

            Product.findByIdAndDelete = jest.fn().mockResolvedValue(productData);

            const response = await request(app)
                .delete(`/api/products/delete/${productData._id}`)
                .expect(200);

            expect(response.body.message).toBe('deleted');
        });

        it('should return 404 if product is not found', async () => {
            Product.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .delete(`/api/products/delete/invalid-id`)
                .expect(404);

            expect(response.body.message).toBe('Product not found');
        });
    });
});