type ClientAnalyticsData = {
  total_files: number;
  total_queries: clientQueriesResult;
  submissions_stats: {
    client_onboarding_form: boolean | QuestionaireEntry;
    advisior_onboarding_form: boolean | QuestionaireEntry;
  };
  ai_query_count: number;
};

export const useAnalyticsController = () => {
  const get_dashboard_startup_analytics = async (client_uid: string) => {
    if (!process.client) return;

    try {
      const axios = (await import("axios")).default;

      let url = `/api/analytics/${client_uid}`;

      const response = await axios.get(url);

      // console.log(response);

      const data = (response.data?.data as ClientAnalyticsData) ?? null;

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || // API-sent error
        error?.message || // Network error, etc.
        "An unknown error occurred";

      throw new Error(message);
    }
  };

  const get_prompt_stats = async (client_uid: string) => {
    if (!process.client) return;

    try {
      const axios = (await import("axios")).default;

      let url = `/api/clients/${client_uid}/prompt-stats`;

      const response = await axios.get(url);

      // console.log("response");
      // console.log(response);

      const data = (response.data.data as prompt_stats[]) ?? null;

      return data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || // API-sent error
        error?.message || // Network error, etc.
        "An unknown error occurred";

      throw new Error(message);
    }
  };

  return {
    get_dashboard_startup_analytics,
    get_prompt_stats,
  };
};
