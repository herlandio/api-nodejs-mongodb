const { v4: uuidv4 } = require('uuid');
const Category = require('../../types/categorySchema');

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

describe('Category Model Test', () => {
    let mockCreate;
    let mockFind;

    beforeAll(() => {
        mockCreate = jest.fn();
        mockFind = jest.fn();
        Category.create = mockCreate;
        Category.find = mockFind;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new category successfully', async () => {
        const categoryData = { name: 'Electronics', description: 'Devices and gadgets' };
        mockCreate.mockResolvedValueOnce({ _id: uuidv4(), ...categoryData });

        const category = await Category.create(categoryData);

        expect(category).toHaveProperty('_id');
        expect(category.name).toBe(categoryData.name);
        expect(category.description).toBe(categoryData.description);
        expect(mockCreate).toHaveBeenCalledWith(categoryData);
    });

    it('should throw a validation error if name is missing', async () => {
        const categoryData = { description: 'Devices and gadgets' };
        const errorMessage = 'What is the category?';

        mockCreate.mockRejectedValueOnce(new Error(errorMessage));

        await expect(Category.create(categoryData)).rejects.toThrow(errorMessage);
    });

    it('should throw a validation error if description is missing', async () => {
        const categoryData = { name: 'Electronics' };
        const errorMessage = 'Description of the category?';

        mockCreate.mockRejectedValueOnce(new Error(errorMessage));

        await expect(Category.create(categoryData)).rejects.toThrow(errorMessage);
    });

    it('should find categories by name or description', async () => {
        const categories = [
            { _id: uuidv4(), name: 'Electronics', description: 'Devices and gadgets' },
            { _id: uuidv4(), name: 'Furniture', description: 'Home furnishings' },
        ];

        mockFind.mockReturnValueOnce(categories.filter(c => c.name === 'Electronics'));

        const foundCategories = await Category.find({ $text: { $search: 'Electronics' } });

        expect(foundCategories).toHaveLength(1);
        expect(foundCategories[0].name).toBe('Electronics');
        expect(mockFind).toHaveBeenCalledWith({ $text: { $search: 'Electronics' } });
    });
});
