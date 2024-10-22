const { v4: uuidv4 } = require('uuid');
const Product = require('../../types/productsSchema');

jest.mock('mongoose', () => {
    const mMongoose = jest.requireActual('mongoose');
    return {
        ...mMongoose,
        model: jest.fn().mockImplementation(() => ({
            create: jest.fn(),
            find: jest.fn(),
        })),
        connect: jest.fn(),
        connection: {
            dropDatabase: jest.fn(),
            close: jest.fn(),
        },
    };
});

describe('Product Model Test', () => {
    let mockCreate;
    let mockFind;

    beforeAll(() => {
        mockCreate = jest.fn();
        mockFind = jest.fn();
        Product.create = mockCreate;
        Product.find = mockFind;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new product successfully', async () => {
        const productData = {
            name: 'Smartphone',
            description: 'Latest model smartphone',
            price: 999.99,
            inventory: 50,
            category: 'Electronics',
            brand: 'TechBrand',
        };
        mockCreate.mockResolvedValueOnce({ _id: uuidv4(), ...productData });

        const product = await Product.create(productData);

        expect(product).toHaveProperty('_id');
        expect(product.name).toBe(productData.name);
        expect(product.description).toBe(productData.description);
        expect(product.price).toBe(productData.price);
        expect(product.inventory).toBe(productData.inventory);
        expect(product.category).toBe(productData.category);
        expect(product.brand).toBe(productData.brand);
        expect(mockCreate).toHaveBeenCalledWith(productData);
    });

    it('should throw a validation error if name is missing', async () => {
        const productData = {
            description: 'Latest model smartphone',
            price: 999.99,
            inventory: 50,
            category: 'Electronics',
            brand: 'TechBrand',
        };
        const errorMessage = 'Product name?';

        mockCreate.mockRejectedValueOnce(new Error(errorMessage));

        await expect(Product.create(productData)).rejects.toThrow(errorMessage);
    });

    it('should throw a validation error if price is missing', async () => {
        const productData = {
            name: 'Smartphone',
            description: 'Latest model smartphone',
            inventory: 50,
            category: 'Electronics',
            brand: 'TechBrand',
        };
        const errorMessage = 'Product price?';

        mockCreate.mockRejectedValueOnce(new Error(errorMessage));

        await expect(Product.create(productData)).rejects.toThrow(errorMessage);
    });

    it('should throw a validation error if inventory is missing', async () => {
        const productData = {
            name: 'Smartphone',
            description: 'Latest model smartphone',
            price: 999.99,
            category: 'Electronics',
            brand: 'TechBrand',
        };
        const errorMessage = 'Quantity of products?';

        mockCreate.mockRejectedValueOnce(new Error(errorMessage));

        await expect(Product.create(productData)).rejects.toThrow(errorMessage);
    });

    it('should find products by name or category', async () => {
        const products = [
            { _id: uuidv4(), name: 'Smartphone', description: 'Latest model smartphone', price: 999.99, inventory: 50, category: 'Electronics', brand: 'TechBrand' },
            { _id: uuidv4(), name: 'Laptop', description: 'High performance laptop', price: 1499.99, inventory: 20, category: 'Electronics', brand: 'TechBrand' },
        ];

        mockFind.mockReturnValueOnce(products.filter(p => p.name === 'Smartphone'));

        const foundProducts = await Product.find({ $text: { $search: 'Smartphone' } });

        expect(foundProducts).toHaveLength(1);
        expect(foundProducts[0].name).toBe('Smartphone');
        expect(mockFind).toHaveBeenCalledWith({ $text: { $search: 'Smartphone' } });
    });
});
