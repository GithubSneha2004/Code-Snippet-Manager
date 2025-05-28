import AuthService from '../utils/auth';
import decode from 'jwt-decode';

jest.mock('jwt-decode');

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage mocks
    localStorage.clear();
    jest.clearAllMocks();

    // Mock localStorage methods
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();

    // Mock window.location.assign
    delete window.location;
    window.location = { assign: jest.fn() };
  });

  describe('getProfile', () => {
    test('should decode and return token payload', () => {
      Storage.prototype.getItem.mockReturnValue('token123');
      decode.mockReturnValue({ user: 'testUser' });

      const profile = AuthService.getProfile();

      expect(Storage.prototype.getItem).toHaveBeenCalledWith('id_token');
      expect(decode).toHaveBeenCalledWith('token123');
      expect(profile).toEqual({ user: 'testUser' });
    });
  });

  describe('getToken', () => {
    test('should return token from localStorage', () => {
      Storage.prototype.getItem.mockReturnValue('token123');

      const token = AuthService.getToken();

      expect(Storage.prototype.getItem).toHaveBeenCalledWith('id_token');
      expect(token).toBe('token123');
    });
  });

  describe('isTokenExpired', () => {
    test('returns true if token is expired', () => {
      decode.mockReturnValue({ exp: (Date.now() / 1000) - 10 }); // expired 10s ago
      const result = AuthService.isTokenExpired('token123');
      expect(decode).toHaveBeenCalledWith('token123');
      expect(result).toBe(true);
    });

    test('returns false if token is not expired', () => {
      decode.mockReturnValue({ exp: (Date.now() / 1000) + 1000 }); // expires in future
      const result = AuthService.isTokenExpired('token123');
      expect(result).toBe(false);
    });

    test('returns false if decode throws error', () => {
      decode.mockImplementation(() => { throw new Error('invalid token'); });
      const result = AuthService.isTokenExpired('invalidToken');
      expect(result).toBe(false);
    });
  });

  describe('loggedIn', () => {
    test('returns true if token exists and not expired', () => {
      jest.spyOn(AuthService, 'getToken').mockReturnValue('token123');
      jest.spyOn(AuthService, 'isTokenExpired').mockReturnValue(false);

      expect(AuthService.loggedIn()).toBe(true);
    });

    test('returns false if no token', () => {
      jest.spyOn(AuthService, 'getToken').mockReturnValue(null);

      expect(AuthService.loggedIn()).toBe(false);
    });

    test('returns false if token is expired', () => {
      jest.spyOn(AuthService, 'getToken').mockReturnValue('token123');
      jest.spyOn(AuthService, 'isTokenExpired').mockReturnValue(true);

      expect(AuthService.loggedIn()).toBe(false);
    });
  });

  describe('login', () => {
    test('saves token to localStorage and redirects to /dashboard', () => {
      AuthService.login('my-token');

      expect(Storage.prototype.setItem).toHaveBeenCalledWith('id_token', 'my-token');
      expect(window.location.assign).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('logout', () => {
    test('removes token and redirects to /logoutmessage', () => {
      AuthService.logout();

      expect(Storage.prototype.removeItem).toHaveBeenCalledWith('id_token');
      expect(window.location.assign).toHaveBeenCalledWith('/logoutmessage');
    });
  });
});
