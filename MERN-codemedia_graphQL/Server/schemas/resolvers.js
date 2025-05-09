const { User, Snippet } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        // Populate the savedSnippets field to return all saved snippets for the logged-in user
        return await User.findById(context.user._id)
          .select('-__v -password')  // Exclude unnecessary fields
          .populate('savedSnippets');  // Populate the savedSnippets field
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
    // Move getSnippetsBySearch here as a query
    getSnippetsBySearch: async (parent, { searchText }) => {
      return await Snippet.find({
        $or: [
          { title: { $regex: searchText, $options: 'i' } },
          { description: { $regex: searchText, $options: 'i' } },
          { language: { $regex: searchText, $options: 'i' } },
        ]
      }).populate('createdBy', 'username');
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new AuthenticationError('Incorrect credentials');
      const valid = await user.isCorrectPassword(password);
      if (!valid) throw new AuthenticationError('Incorrect credentials');
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    saveSnippet: async (parent, { title, code, description, language }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      // Save the snippet
      const snippet = await Snippet.create({
        title,
        code,
        description,
        language,
        createdBy: context.user._id,
      });
      // Add the snippet to the savedSnippets field of the user
      await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedSnippets: snippet._id } },
        { new: true }
      );
      return snippet;
    },

    deleteSnippet: async (parent, { snippetId }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const snippet = await Snippet.findOne({ _id: snippetId, createdBy: context.user._id });
      if (!snippet) throw new AuthenticationError('Snippet not found or not authorized');
      await Snippet.deleteOne({ _id: snippetId });
      return snippet;
    },

    editSnippet: async (parent, { snippetID, code }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      const snippet = await Snippet.findOneAndUpdate(
        { _id: snippetID, createdBy: context.user._id },
        { $set: { code } },
        { new: true }
      );
      if (!snippet) throw new AuthenticationError('Snippet not found or not authorized');
      return snippet;
    },
  },
};

module.exports = resolvers;
