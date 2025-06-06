const { User, Snippet } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const generateCode = require('../utils/generateCode');

const SHARE_CODE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findById(context.user._id)
          .select('-__v -password')
          .populate('savedSnippets');
      }
      throw new AuthenticationError('Not logged in');
    },

    getAllSnippets: async () => {
      return await Snippet.find().populate('createdBy', 'username');
    },

    getSnippetsByUser: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await Snippet.find({ createdBy: context.user._id });
    },

    getSnippetById: async (parent, { snippetId }) => {
      return await Snippet.findById(snippetId).populate('createdBy', 'username');
    },

    getSnippetsBySearch: async (parent, { searchText }) => {
      return await Snippet.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { description: { $regex: searchText, $options: 'i' } },
          { language: { $regex: searchText, $options: 'i' } },
        ]
      }).populate('createdBy', 'username');
    },

    getSnippetByShareCode: async (_, { code }) => {
      const snippet = await Snippet.findOne({ "shared.code": code, "shared.isShared": true })
        .populate('createdBy', 'username');

      if (!snippet) {
        throw new Error("Shared snippet not found or no longer available.");
      }

      const now = new Date();
      const shareCreatedAt = snippet.shared.createdAt;

      if (!shareCreatedAt || (now - shareCreatedAt) > SHARE_CODE_EXPIRY_MS) {
        // Expired → clear it
        snippet.shared = {
          isShared: false,
          code: null,
          createdAt: null,
          codeExpiresAt: null,
        };
        await snippet.save();
        throw new Error("Shared code has expired.");
      }

      return snippet;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Incorrect credentials');
      const valid = await user.isCorrectPassword(password);
      if (!valid) throw new AuthenticationError('Incorrect credentials');
      const token = signToken({
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken({
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      });
      return { token, user };
    },

    saveSnippet: async (parent, { title, code, description, language }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const snippet = await Snippet.create({
        title,
        code,
        description,
        language,
        createdBy: context.user._id,
      });
      await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedSnippets: snippet._id } },
        { new: true }
      );
      return snippet;
    },

    deleteSnippet: async (parent, { snippetId }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      if (context.user.role !== 'professor') throw new AuthenticationError('Only professors can delete snippets');
      const snippet = await Snippet.findOne({ _id: snippetId, createdBy: context.user._id });
      if (!snippet) throw new AuthenticationError('Snippet not found or not authorized');
      await Snippet.deleteOne({ _id: snippetId });
      return snippet;
    },

    editSnippet: async (parent, { snippetId, code }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      if (context.user.role !== 'professor') throw new AuthenticationError('Only professors can edit snippets');
      const snippet = await Snippet.findOneAndUpdate(
        { _id: snippetId, createdBy: context.user._id },
        { $set: { code } },
        { new: true }
      );
      if (!snippet) throw new AuthenticationError('Snippet not found or not authorized');
      return snippet;
    },

    shareSnippet: async (_, { snippetId }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      if (context.user.role !== 'professor') throw new AuthenticationError('Only professors can share snippets');

      const snippet = await Snippet.findById(snippetId);
      if (!snippet) throw new Error('Snippet not found');

      if (snippet.createdBy.toString() !== context.user._id.toString()) {
        throw new Error('Not authorized to share this snippet');
      }

      const now = new Date();

      // Clear expired share
      if (snippet.shared?.isShared && (now - snippet.shared.createdAt > SHARE_CODE_EXPIRY_MS)) {
        snippet.shared = {
          isShared: false,
          code: null,
          createdAt: null,
          codeExpiresAt: null,
        };
      }

      // If not shared, generate new code
      if (!snippet.shared?.isShared) {
        let newCode;
        let existing;
        do {
          newCode = generateCode();
          existing = await Snippet.findOne({ "shared.code": newCode });
        } while (existing);

        snippet.shared = {
          isShared: true,
          code: newCode,
          createdAt: now,
          codeExpiresAt: new Date(now.getTime() + SHARE_CODE_EXPIRY_MS),
        };
        await snippet.save();
      }

      return await Snippet.findById(snippetId).populate('createdBy', 'username');
    },

    deleteUser: async (parent, args, context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in.');
      const userId = context.user._id;

      await Snippet.deleteMany({ createdBy: userId });
      await User.findByIdAndDelete(userId);

      return {
        success: true,
        message: "User and all associated snippets deleted successfully.",
      };
    },
  },
};

module.exports = resolvers;
