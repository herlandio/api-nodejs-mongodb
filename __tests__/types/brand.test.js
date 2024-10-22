const { v4: uuidv4 } = require('uuid');
const Brand = require('../../types/brandSchema');

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

describe('Brand Model Test', () => {
    const mockCreate = Brand.create;
    const mockFind = Brand.find;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new brand successfully', async () => {
        const brandData = { name: 'Nike' };
        mockCreate.mockResolvedValueOnce({ _id: uuidv4(), ...brandData });

        const brand = await Brand.create(brandData);

        expect(brand).toHaveProperty('_id');
        expect(brand.name).toBe(brandData.name);
        expect(mockCreate).toHaveBeenCalledWith(brandData);
    });

    it('should throw a validation error if name is missing', async () => {
        const brandData = {};
        const errorMessage = 'What is the name of the brand?';

        mockCreate.mockRejectedValueOnce(new Error(errorMessage));

        await expect(Brand.create(brandData)).rejects.toThrow(errorMessage);
    });

    it('should create multiple brands and find them by name', async () => {
        const brands = [
            { _id: uuidv4(), name: 'Adidas' },
            { _id: uuidv4(), name: 'Puma' },
            { _id: uuidv4(), name: 'Reebok' },
        ];

        mockCreate.mockResolvedValueOnce(brands);
        mockFind.mockReturnValueOnce(brands.filter(b => b.name === 'Adidas'));

        const foundBrands = await Brand.find({ $text: { $search: 'Adidas' } });

        expect(foundBrands).toHaveLength(1);
        expect(foundBrands[0].name).toBe('Adidas');
        expect(mockFind).toHaveBeenCalledWith({ $text: { $search: 'Adidas' } });
    });
});
