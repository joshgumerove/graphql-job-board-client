import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
});

const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      id
      date
      title
      company {
        id
        name
      }
      description
    }
  }
`;

async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        date
        title
        company {
          id
          name
        }
        description
      }
    }
  `;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: {
      input: {
        title,
        description,
      },
    },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: {
          id: data.job.id,
        },
        data,
      });
    },
  });

  return data.job;
}

async function getJob(id) {
  const { data } = await apolloClient.query({
    query: jobByIdQuery,
    variables: {
      id,
    },
  });

  return data.job;
}

async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });
  return data.jobs;
}

async function getCompany(id) {
  const query = gql`
    query CompanyById($id: ID!) {
      company(id: $id) {
        description
        name
        id
        jobs {
          id
          title
          description
          date
        }
      }
    }
  `;

  const { data } = await apolloClient.query({
    query,
    variables: {
      id,
    },
  });

  return data.company;
}

export { getJobs, getJob, getCompany, createJob };
