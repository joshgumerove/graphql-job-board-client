import {
  companyByIdQuery,
  jobByIdQuery,
  jobsQuery,
  createJobMutation,
} from "./queries";
import { useQuery, useMutation } from "@apollo/client";

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

function useJobs(limit, offset) {
  const { data, loading, error } = useQuery(jobsQuery, {
    variables: {
      limit,
      offset,
    },
    fetchPolicy: "network-only",
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

function useCreateJob() {
  const [mutate, { loading }] = useMutation(createJobMutation);

  const createJob = async (title, description) => {
    const {
      data: { job },
    } = await mutate({
      variables: {
        input: { title, description },
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
    return job;
  };

  return {
    loading,
    createJob,
  };
}

export { useCompany, useJob, useJobs, useCreateJob };
