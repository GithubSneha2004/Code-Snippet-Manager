const resolvers = require('../schemas/resolvers');
const User = require('../models/User');
const Snippet = require('../models/Snippet');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

jest.mock('../models/User');
jest.mock('../models/Snippet');
jest.mock('../utils/auth');

describe('Resolvers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ----------------- QUERY -----------------
  describe('Query.me', () => {
    it('returns user data with populated savedSnippets when context has user', async () => {
      const context = { user: { _id: '123' } };
      const mockUser = { _id: '123', username: 'Sneha', savedSnippets: [] };
      const populateMock = jest.fn().mockResolvedValue(mockUser);
      const selectMock = jest.fn(() => ({ populate: populateMock }));
      User.findById.mockReturnValue({ select: selectMock });

      const result = await resolvers.Query.me(null, {}, context);

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(selectMock).toHaveBeenCalledWith('-__v -password');
      expect(populateMock).toHaveBeenCalledWith('savedSnippets');
      expect(result).toEqual(mockUser);
    });

    it('throws AuthenticationError if context.user is missing', async () => {
      await expect(resolvers.Query.me(null, {}, {})).rejects.toThrow('Not logged in');
    });

    it('propagates errors from User.findById().select().populate()', async () => {
      const context = { user: { _id: '123' } };
      const errorMsg = 'DB failure';
      const populateMock = jest.fn().mockRejectedValue(new Error(errorMsg));
      const selectMock = jest.fn(() => ({ populate: populateMock }));
      User.findById.mockReturnValue({ select: selectMock });

      await expect(resolvers.Query.me(null, {}, context)).rejects.toThrow(errorMsg);
    });
  });

  describe('Query.getAllSnippets', () => {
    it('returns all snippets with createdBy username populated', async () => {
      const mockSnippets = [{ _id: '1', title: 'Test', createdBy: { username: 'Sneha' } }];
      Snippet.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSnippets),
      });

      const result = await resolvers.Query.getAllSnippets();
      expect(Snippet.find).toHaveBeenCalled();
      expect(result).toEqual(mockSnippets);
    });
  });

  describe('Query.getSnippetsByUser', () => {
    it('returns snippets created by logged-in user', async () => {
      const context = { user: { _id: '123' } };
      const mockSnippets = [{ _id: '1', title: 'User snippet' }];
      Snippet.find.mockResolvedValue(mockSnippets);

      const result = await resolvers.Query.getSnippetsByUser(null, {}, context);
      expect(Snippet.find).toHaveBeenCalledWith({ createdBy: '123' });
      expect(result).toEqual(mockSnippets);
    });

    it('throws AuthenticationError if user not logged in', async () => {
      await expect(resolvers.Query.getSnippetsByUser(null, {}, {})).rejects.toThrow('Not logged in');
    });
  });

  describe('Query.getSnippetById', () => {
    it('returns snippet by ID with createdBy username populated', async () => {
      const snippetId = 'abc123';
      const mockSnippet = { _id: snippetId, title: 'Snippet', createdBy: { username: 'Sneha' } };
      Snippet.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSnippet),
      });

      const result = await resolvers.Query.getSnippetById(null, { snippetId });
      expect(Snippet.findById).toHaveBeenCalledWith(snippetId);
      expect(result).toEqual(mockSnippet);
    });
  });

  describe('Query.getSnippetsBySearch', () => {
    it('returns snippets matching searchText in title, description, or language', async () => {
      const searchText = 'console';
      const mockSnippets = [{ _id: '1', title: 'Test snippet' }];
      Snippet.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSnippets),
      });

      const result = await resolvers.Query.getSnippetsBySearch(null, { searchText });
      expect(Snippet.find).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { description: { $regex: searchText, $options: 'i' } },
          { language: { $regex: searchText, $options: 'i' } },
        ],
      });
      expect(result).toEqual(mockSnippets);
    });
  });

  // ----------------- MUTATION -----------------
  describe('Mutation.login', () => {
    it('returns token and user on successful login', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = {
        _id: 'user123',
        email,
        isCorrectPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      signToken.mockReturnValue('token123');

      const result = await resolvers.Mutation.login(null, { email, password });
      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(mockUser.isCorrectPassword).toHaveBeenCalledWith(password);
      expect(signToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ token: 'token123', user: mockUser });
    });

    it('throws AuthenticationError if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      await expect(resolvers.Mutation.login(null, { email: 'a', password: 'b' })).rejects.toThrow(
        'Incorrect credentials'
      );
    });

    it('throws AuthenticationError if password is invalid', async () => {
      const mockUser = {
        _id: 'user123',
        isCorrectPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      await expect(resolvers.Mutation.login(null, { email: 'a', password: 'b' })).rejects.toThrow(
        'Incorrect credentials'
      );
    });
  });

  describe('Mutation.addUser', () => {
    it('creates user and returns token with user', async () => {
      const args = { username: 'newuser', email: 'newuser@example.com', password: 'pass123' };
      const mockUser = { _id: 'u123', username: 'newuser', email: 'newuser@example.com' };
      User.create.mockResolvedValue(mockUser);
      signToken.mockReturnValue('token123');

      const result = await resolvers.Mutation.addUser(null, args);
      expect(User.create).toHaveBeenCalledWith(args);
      expect(signToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ token: 'token123', user: mockUser });
    });

    it('throws error if User.create fails', async () => {
      const args = { username: 'failuser', email: 'fail@example.com', password: 'pass' };
      User.create.mockRejectedValue(new Error('Creation failed'));

      await expect(resolvers.Mutation.addUser(null, args)).rejects.toThrow('Creation failed');
    });
  });

  describe('Mutation.saveSnippet', () => {
    it('creates a snippet and updates user savedSnippets', async () => {
      const context = { user: { _id: 'user123' } };
      const args = {
        title: 'Title',
        code: 'code here',
        description: 'desc',
        language: 'JavaScript',
      };
      const mockSnippet = { _id: 'snippet123', ...args, createdBy: 'user123' };
      Snippet.create.mockResolvedValue(mockSnippet);
      User.findByIdAndUpdate.mockResolvedValue(true);

      const result = await resolvers.Mutation.saveSnippet(null, args, context);
      expect(Snippet.create).toHaveBeenCalledWith({
        ...args,
        createdBy: context.user._id,
      });
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        context.user._id,
        { $push: { savedSnippets: mockSnippet._id } },
        { new: true }
      );
      expect(result).toEqual(mockSnippet);
    });

    it('throws AuthenticationError if user not logged in', async () => {
      await expect(
        resolvers.Mutation.saveSnippet(null, {}, {})
      ).rejects.toThrow('Not logged in');
    });
  });

  describe('Mutation.deleteSnippet', () => {
    it('deletes snippet if owned by user', async () => {
      const context = { user: { _id: 'user123' } };
      const snippetId = 'snippet123';
      const mockSnippet = { _id: snippetId, createdBy: 'user123' };
      Snippet.findOne.mockResolvedValue(mockSnippet);
      Snippet.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await resolvers.Mutation.deleteSnippet(null, { snippetId }, context);
      expect(Snippet.findOne).toHaveBeenCalledWith({ _id: snippetId, createdBy: 'user123' });
      expect(Snippet.deleteOne).toHaveBeenCalledWith({ _id: snippetId });
      expect(result).toEqual(mockSnippet);
    });

    it('throws AuthenticationError if user not logged in', async () => {
      await expect(
        resolvers.Mutation.deleteSnippet(null, { snippetId: 'id' }, {})
      ).rejects.toThrow('Not logged in');
    });

    it('throws AuthenticationError if snippet not found or unauthorized', async () => {
      const context = { user: { _id: 'user123' } };
      Snippet.findOne.mockResolvedValue(null);

      await expect(
        resolvers.Mutation.deleteSnippet(null, { snippetId: 'id' }, context)
      ).rejects.toThrow('Snippet not found or not authorized');
    });
  });

  describe('Mutation.editSnippet', () => {
    it('updates snippet code if owned by user', async () => {
      const context = { user: { _id: 'user123' } };
      const snippetId = 'snippet123';
      const newCode = 'console.log("edited")';
      const mockSnippet = { _id: snippetId, code: newCode, createdBy: 'user123' };
      Snippet.findOneAndUpdate.mockResolvedValue(mockSnippet);

      const result = await resolvers.Mutation.editSnippet(null, { snippetId, code: newCode }, context);
      expect(Snippet.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: snippetId, createdBy: 'user123' },
        { $set: { code: newCode } },
        { new: true }
      );
      expect(result).toEqual(mockSnippet);
    });

    it('throws AuthenticationError if user not logged in', async () => {
      await expect(
        resolvers.Mutation.editSnippet(null, { snippetId: 'id', code: 'code' }, {})
      ).rejects.toThrow('Not logged in');
    });

    it('throws AuthenticationError if snippet not found or unauthorized', async () => {
      const context = { user: { _id: 'user123' } };
      Snippet.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        resolvers.Mutation.editSnippet(null, { snippetId: 'id', code: 'code' }, context)
      ).rejects.toThrow('Snippet not found or not authorized');
    });
  });
});
