  import decode from 'jwt-decode';

  class AuthService {
    // retrieve data saved in token
    getProfile() {
      return decode(this.getToken());
    }

    loggedIn() {
      // check if the user is still logged in
      const token = this.getToken(); // Checks if there is a saved token and it's still valid
      // use type coersion to check if token is NOT undefined and the token is NOT expired
      return !!token && !this.isTokenExpired(token)
    }

    // check if the token has expired
    isTokenExpired(token) {
      try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }

    // retrieve token from localStorage
    getToken() {
      // Retrieves the user token from localStorage
      return localStorage.getItem('id_token');
    }

    // set token to localStorage and reload page to homepage
    login(idToken) {
      // Saves user token to localStorage
      localStorage.setItem('id_token', idToken);

      window.location.assign('/dashboard');
    }

    // clear token from localStorage and force logout with reload
    logout() {
      // Clear user token and profile data from localStorage
      localStorage.removeItem('id_token')

      // this will reload the page and reset the state of the application
      window.location.assign('/logoutmessage');
    }
  }
  export default new AuthService();

