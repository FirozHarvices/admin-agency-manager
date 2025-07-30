import toast from "react-hot-toast";
import axiosClient from "../../../api/axiosClient";

import { DashboardApiResponse } from "../types";

export const fetchDashboardData = async (
  userId: number
): Promise<DashboardApiResponse> => {
  try {
    const response = await axiosClient.get<DashboardApiResponse>(
      `/user/getCustomer/${userId}`
    );

    if (response.data && !response.data.status && response.data.message) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    if (error.message && !error.response) {
      toast.error(error.message);
      throw error;
    }

    if (error.response) {
      const apiError = error.response.data;

      if (apiError && apiError.message) {
        throw new Error(apiError.message);
      }

      throw new Error("Something went wrong. Please try again.");
    } else if (error.request) {
      throw new Error(
        "Unable to connect to the server. Please check your internet connection."
      );
    } else {
      toast.error(error.message || "An unexpected error occurred.");
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};
