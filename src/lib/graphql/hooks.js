import { companyByIdQuery } from "./queries";
import { useQuery } from "@apollo/client";

function useCompany(id) {
  const { loading, error, data } = useQuery(companyByIdQuery, {
    variables: {
      id,
    },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

export { useCompany };
