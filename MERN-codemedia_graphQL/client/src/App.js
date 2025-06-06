import React from 'react';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Home from './components/home/Home';
import Navbarhome from './components/Navbar';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import CreateSnippet from './components/CreateSnippet';
import auth from './utils/auth';
import MySnippets from './components/MySnippets';
import LoginReminder from './components/LoginReminder';
import Logoutmsg from './components/Logoutmsg';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SharedSnippet from './components/SharedSnippet';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoinByCode from './components/JoinByCode';
import StudentRedirectRoute from './components/StudentRedirectRoute';
import EntryPage from './components/EntryPage';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// New inner component inside Router — can safely use useLocation here
function AppContent() {
  const location = useLocation();
  const loggedIn = auth.loggedIn();
  {/*const showNavbar = loggedIn || location.pathname === '/home' || location.pathname === '/loginreminder';*/}
  const hideNavbarPaths = ['/', '/login', '/signup'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);


  return (
    <>
      {showNavbar && <Navbarhome />}

      <ToastContainer position="bottom-center" autoClose={3000} theme="colored" />

      <Routes>
        {/* Default entry page */}
        <Route path="/" element={<EntryPage />} />

        {/* Public routes */}
        <Route path="/login" element={loggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/logoutmessage" element={<Logoutmsg />} />
        <Route path="/join" element={<JoinByCode />} />
        <Route path="/shared/:code" element={<SharedSnippet />} />
        <Route path="/home" element={loggedIn ? <Navigate to="/dashboard" replace /> : <Home />} />

        {/* Protected routes */}
        {loggedIn ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/snippets" element={<MySnippets />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/create-snippet"
              element={
                <StudentRedirectRoute>
                  <CreateSnippet />
                </StudentRedirectRoute>
              }
            />
          </>
        ) : (
          <Route path="*" element={<LoginReminder />} />
        )}
      </Routes>
    </>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AppContent />
      </Router>
    </ApolloProvider>
  );
}

export default App;
