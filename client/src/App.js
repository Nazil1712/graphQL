import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation } from "@apollo/client";
import DisplayData from "./DisplayData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql",
  });


  return (
    <ApolloProvider client={client}>
      <div className="m-4">
        <DisplayData/>
        <ToastContainer/>
      </div>
    </ApolloProvider>
  );
}

export default App;
