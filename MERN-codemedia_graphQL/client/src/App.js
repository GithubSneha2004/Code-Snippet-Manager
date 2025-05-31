
  import Login from './components/Login';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import Signup from './components/Signup';
  import Home from './components/home/Home';
  import Navbarhome from './components/Navbar';
  import { setContext } from '@apollo/client/link/context'
  import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
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







  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:5000/graphql'

  })
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

  function App() {
    return (
      <ApolloProvider client={client}>
  <Router>
          <>
            <Navbarhome />
            <ToastContainer position="bottom-center" autoClose={3000} theme="colored" />
            <Routes>
              {auth.loggedIn() ? (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/snippets" element={<MySnippets />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/create-snippet" element={<CreateSnippet />} />
                </>
              ) : (
                <Route path="*" element={<LoginReminder />} />
              )}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
              <Route path="/logoutmessage" element={<Logoutmsg />} />
              <Route path="/shared/:code" element={<SharedSnippet />} />
            </Routes>
          </>
        </Router>
  </ApolloProvider>
    );
  }

  export default App;
