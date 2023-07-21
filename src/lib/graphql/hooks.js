import { companyByIdQuery, jobByIdQuery, jobsQuery } from "./queries";
import { useQuery } from "@apollo/client";

function useCompany(id) {
  const { loading, error, data } = useQuery(companyByIdQuery, {
    variables: {
      id,
    },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

function useJob(id) {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: {
      id,
    },
  });
  return { job: data?.job, loading, error: Boolean(error) };
}

function useJobs() {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export { useCompany, useJob, useJobs };
