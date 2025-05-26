const mongoose = require("mongoose");
const User = require("../models/User");

beforeAll(async () => {
  const dbUri = "mongodb://127.0.0.1:27017/testDB";
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("User Model Test Suite", () => {
  it("should create a user successfully", async () => {
    const user = new User({
      username: "testuser1",
      email: "testuser1@example.com",
      password: "Password123!",
    });
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe("testuser1");
    expect(savedUser.email).toBe("testuser1@example.com");
    expect(savedUser.password).not.toBe("Password123!"); // Hashed
  });

  it("should not create a user without a username", async () => {
    const user = new User({
      email: "nousername@example.com",
      password: "Password123!",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not create a user without an email", async () => {
    const user = new User({
      username: "noemailuser",
      password: "Password123!",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not create a user without a password", async () => {
    const user = new User({
      username: "nopassworduser",
      email: "nopassword@example.com",
    });
    await expect(user.save()).rejects.toThrow();
  });

  it("should not create a user with invalid email", async () => {
    const user = new User({
      username: "invalidemailuser",
      email: "invalid-email",
      password: "Password123!",
    });
    await expect(user.save()).rejects.toThrow(/valid email address/);
  });

  it("should reject password not meeting strength requirements", async () => {
    const user = new User({
      username: "weakpassuser",
      email: "weakpass@example.com",
      password: "weak", // Too weak
    });

    await expect(user.save()).rejects.toThrow(
      /Password must be at least 8 characters/
    );
  });

  it("should not allow duplicate usernames", async () => {
    const user1 = new User({
      username: "duplicateuser",
      email: "unique1@example.com",
      password: "Password123!",
    });
    const user2 = new User({
      username: "duplicateuser",
      email: "unique2@example.com",
      password: "Password123!",
    });

    await user1.save();
    await expect(user2.save()).rejects.toThrow();
  });

  it("should not allow duplicate emails", async () => {
    const user1 = new User({
      username: "uniqueuser1",
      email: "duplicate@example.com",
      password: "Password123!",
    });
    const user2 = new User({
      username: "uniqueuser2",
      email: "duplicate@example.com",
      password: "Password123!",
    });

    await user1.save();
    await expect(user2.save()).rejects.toThrow();
  });

  it("should hash password before saving", async () => {
    const user = new User({
      username: "hashuser",
      email: "hashuser@example.com",
      password: "SecretPass1!",
    });

    const savedUser = await user.save();
    expect(savedUser.password).not.toBe("SecretPass1!");
    expect(savedUser.password.length).toBeGreaterThan(20);
  });

  it("should compare password correctly", async () => {
    const user = new User({
      username: "compareuser",
      email: "compare@example.com",
      password: "MatchMe123!",
    });
    await user.save();

    const foundUser = await User.findOne({ username: "compareuser" });
    const isCorrect = await foundUser.isCorrectPassword("MatchMe123!");
    const isIncorrect = await foundUser.isCorrectPassword("WrongPassword!");

    expect(isCorrect).toBe(true);
    expect(isIncorrect).toBe(false);
  });

  it("should allow adding to savedSnippets", async () => {
    const user = new User({
      username: "snippetuser",
      email: "snippet@example.com",
      password: "SnippetPass1!",
    });

    const savedUser = await user.save();
    savedUser.savedSnippets.push(new mongoose.Types.ObjectId());
    const updatedUser = await savedUser.save();

    expect(Array.isArray(updatedUser.savedSnippets)).toBe(true);
    expect(updatedUser.savedSnippets.length).toBe(1);
  });

  it("should output virtuals in JSON", async () => {
    const user = new User({
      username: "virtualtest",
      email: "virtual@example.com",
      password: "VirtualPass1!",
    });
    const savedUser = await user.save();
    const json = savedUser.toJSON();

    expect(json).toHaveProperty("username", "virtualtest");
    expect(json).toHaveProperty("email", "virtual@example.com");
    expect(json).toHaveProperty("savedSnippets");
  });

    it("should fail password validation for short length", async () => {
    const user = new User({
      username: "shortpassuser",
      email: "shortpass@example.com",
      password: "P1!", // Too short
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should fail password validation for missing special character", async () => {
    const user = new User({
      username: "nospecialchar",
      email: "nospecial@example.com",
      password: "Password123", // Missing special char
    });
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should skip hashing if password is not modified", async () => {
    const user = new User({
      username: "notmodifieduser",
      email: "notmod@example.com",
      password: "Password123!",
    });
    const savedUser = await user.save();
    const originalHashed = savedUser.password;

    savedUser.email = "newemail@example.com"; // Only update email
    const updatedUser = await savedUser.save();

    expect(updatedUser.password).toBe(originalHashed); // Should remain the same
  });

});
