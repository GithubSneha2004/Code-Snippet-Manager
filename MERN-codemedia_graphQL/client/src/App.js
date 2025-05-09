
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Home from './components/home/Home';
import Navbarhome from './components/Navbar';
import { setContext } from '@apollo/client/link/context'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import Dashboard from './components/Dashboard';
import auth from './utils/auth';
import MySnippets from './components/MySnippets';
import LoginReminder from './components/LoginReminder';
import Logoutmsg from './components/Logoutmsg';




const httpLink = createHttpLink({
  uri: '/graphql'
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
          <Routes>
            {auth.loggedIn() ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/snippets" element={<MySnippets />} />
              </>
            ) : (
              <Route path="*" element={<LoginReminder />} />
            )}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/logoutmessage" element={<Logoutmsg />} />
          </Routes>
        </>
      </Router>
</ApolloProvider>
  );
}

export default App;
