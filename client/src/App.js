import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation } from "@apollo/client";
import DisplayData from "./DisplayData";

function App() {

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql",
  });


  return (
    <ApolloProvider client={client}>
      <div className="m-4">
        <DisplayData/>
      </div>
    </ApolloProvider>
  );
}

export default App;
