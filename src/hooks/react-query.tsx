import {
  type MutationFunctionContext,
  type MutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * A higher-order function that wraps a React Query mutation hook to automatically display success and error toasts.
 */
export const useAddToasts = <
  TData = unknown,
  TError = Error,
  TVariables = void,
  TOnMutationResult = unknown,
>(
  useMutationFactory: () => UseMutationResult<
    TData,
    TError,
    TVariables,
    TOnMutationResult
  >,
  options: {
    successMessage?:
      | string
      | ((
          data: TData,
          variables: TVariables,
          onMutateResult: TOnMutationResult | undefined,
          context: MutationFunctionContext,
        ) => string);
    errorMessage?:
      | string
      | ((
          error: TError,
          variables: TVariables,
          onMutateResult: TOnMutationResult | undefined,
          context: MutationFunctionContext,
        ) => string);
  },
) => {
  const mutation = useMutationFactory();
  const mutate = (
    variables: TVariables,
    _options?:
      | MutationOptions<TData, TError, TVariables, TOnMutationResult>
      | undefined,
  ) => {
    mutation.mutate(variables, {
      ..._options,
      onSuccess: (...args) => {
        if (_options?.onSuccess) {
          _options.onSuccess(...args);
        }
        if (typeof options?.successMessage === "string") {
          toast.success(options.successMessage);
        } else if (typeof options?.successMessage === "function") {
          toast.success(options.successMessage(...args));
        }
      },
      onError: (...args) => {
        if (_options?.onError) {
          _options.onError(...args);
        }
        if (typeof options?.errorMessage === "string") {
          toast.error(options.errorMessage);
        } else if (typeof options?.errorMessage === "function") {
          toast.error(options.errorMessage(...args));
        }
      },
    });
  };
  return { ...mutation, mutate };
};
