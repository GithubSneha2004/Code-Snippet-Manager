// schemas/index.test.js

describe("schemas/index.js", () => {
  it("should export both typeDefs and resolvers", () => {
    const schemas = require("../schemas");

    expect(schemas).toHaveProperty("typeDefs");
    expect(schemas).toHaveProperty("resolvers");
    expect(typeof schemas.typeDefs).toBe("object"); // or 'string' depending on your format
    expect(typeof schemas.resolvers).toBe("object");
  });
});
