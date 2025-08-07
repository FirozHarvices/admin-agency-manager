import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { loginWithPasswordApi } from "../api";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../lib/errorUtils";
import { LoginCredentials } from "../types"; // Assuming types are defined

export const useLoginWithPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      loginWithPasswordApi(credentials),
    onSuccess: (response) => {
      if (response.status === true && response.token) {
        dispatch(
          setUser({
            user: response.data,
            token: response.token,
          })
        );

        toast.success("Login successful!");
        queueMicrotask(() => {
      navigate("/user-master", { replace: true });
    });

      } else {
        const errorMessage =
          response.message || "Login failed. Please try again.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, (err) => {
          if (err?.response?.status === 401) {
            return "Invalid email or password. Please try again.";
          }
          return null;
        })
      );
    },
  });
};
