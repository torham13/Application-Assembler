import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Use process.env directly
const dataConnectUri = process.env.VITE_FIREBASE_DATACONNECT_URL || 'http://localhost:9010/graphql';

const httpLink = new HttpLink({
  uri: dataConnectUri,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;