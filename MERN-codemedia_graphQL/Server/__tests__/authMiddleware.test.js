const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../utils/auth');

jest.mock('jsonwebtoken');

describe('JWT Auth Middleware', () => {
  const userData = { _id: '123', email: 'sneha@example.com' };
  const token = 'mockedtoken';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to build req with token in different places
  const buildReq = (tokenLocation, tokenValue) => {
    switch (tokenLocation) {
      case 'headerBearer':
        return { headers: { authorization: `Bearer ${tokenValue}` }, body: {}, query: {} };
      case 'headerTokenOnly':
        return { headers: { authorization: tokenValue }, body: {}, query: {} };
      case 'body':
        return { headers: {}, body: { token: tokenValue }, query: {} };
      case 'query':
        return { headers: {}, body: {}, query: { token: tokenValue } };
      case 'none':
      default:
        return { headers: {}, body: {}, query: {} };
    }
  };

  describe.each([
    ['Authorization header with "Bearer <token>"', 'headerBearer'],
    ['Authorization header with token only', 'headerTokenOnly'],
    ['req.body.token', 'body'],
    ['req.query.token', 'query'],
  ])('Valid token from %s', (_desc, tokenLocation) => {
    it('should attach user info from valid token', () => {
      const req = buildReq(tokenLocation, token);

      jwt.verify.mockReturnValue({ data: userData });

      const result = authMiddleware({ req });

      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String), expect.any(Object));
      expect(result.user).toEqual(userData);
    });
  });

  it('should not attach user if no token provided', () => {
    const req = buildReq('none');

    const result = authMiddleware({ req });

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(result.user).toBeUndefined();
  });

  it('should not attach user if token is invalid', () => {
    const req = buildReq('headerBearer', token);

    // Suppress console.log temporarily during this test
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const result = authMiddleware({ req });

    expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String), expect.any(Object));
    expect(result.user).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
