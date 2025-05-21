// __tests__/resolvers.test.js
const resolvers = require('../schemas/resolvers');
const User = require('../models/User');
const { AuthenticationError } = require('apollo-server-express');

jest.mock('../models/User');

describe('Resolvers', () => {
  describe('Query.me', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return user data when context has valid user', async () => {
      const context = {
        user: { _id: '123' },
      };

      const mockUser = {
        _id: '123',
        username: 'Sneha',
        email: 'sneha@example.com',
        savedSnippets: [],
      };

      // Mock chained methods findById().select().populate()
      const populateMock = jest.fn().mockResolvedValue(mockUser);
      const selectMock = jest.fn(() => ({ populate: populateMock }));
      User.findById.mockReturnValue({ select: selectMock });

      const result = await resolvers.Query.me(null, {}, context);

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(selectMock).toHaveBeenCalledWith('-__v -password');
      expect(populateMock).toHaveBeenCalledWith('savedSnippets');
      expect(result).toEqual(mockUser);
    });

    it('should throw AuthenticationError if context.user is missing', async () => {
      await expect(resolvers.Query.me(null, {}, {})).rejects.toThrow(
        'Not logged in'
      );
    });

    it('should throw AuthenticationError if context.user._id is missing', async () => {
      const context = { user: {} };
      await expect(resolvers.Query.me(null, {}, context)).rejects.toThrow(
        'Not logged in'
      );
    });

    it('should handle user with populated savedSnippets', async () => {
      const context = { user: { _id: '123' } };
      const mockUser = {
        _id: '123',
        username: 'Sneha',
        email: 'sneha@example.com',
        savedSnippets: [
          {
            _id: 'snippet1',
            title: 'Sample Snippet',
            code: 'console.log("Hello World");',
          },
        ],
      };

      const populateMock = jest.fn().mockResolvedValue(mockUser);
      const selectMock = jest.fn(() => ({ populate: populateMock }));
      User.findById.mockReturnValue({ select: selectMock });

      const result = await resolvers.Query.me(null, {}, context);

      expect(result.savedSnippets.length).toBe(1);
      expect(result.savedSnippets[0].title).toBe('Sample Snippet');
    });

    it('should propagate errors from User.findById().select().populate()', async () => {
      const context = { user: { _id: '123' } };
      const errorMsg = 'Database failure';

      const populateMock = jest.fn().mockRejectedValue(new Error(errorMsg));
      const selectMock = jest.fn(() => ({ populate: populateMock }));
      User.findById.mockReturnValue({ select: selectMock });

      await expect(resolvers.Query.me(null, {}, context)).rejects.toThrow(errorMsg);
    });
  });

  // Example Mutation Tests - adjust according to your schema

  describe('Mutation.addUser', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create and return new user on valid input', async () => {
      const userInput = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const mockCreatedUser = {
        _id: '456',
        username: 'newuser',
        email: 'newuser@example.com',
        // Assuming your resolver returns a token as well:
        token: 'mockedtoken',
      };

      // Mock User.create to return the mockCreatedUser
      User.create.mockResolvedValue(mockCreatedUser);

      const args = { input: userInput };
      const context = {};

      const result = await resolvers.Mutation.addUser(null, args, context);

      expect(User.create).toHaveBeenCalledWith(userInput);
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw error when User.create fails', async () => {
      const userInput = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const errorMsg = 'User creation failed';

      User.create.mockRejectedValue(new Error(errorMsg));

      const args = { input: userInput };
      const context = {};

      await expect(resolvers.Mutation.addUser(null, args, context)).rejects.toThrow(
        errorMsg
      );
    });
  });

  // Add more resolver tests here as needed...
});
