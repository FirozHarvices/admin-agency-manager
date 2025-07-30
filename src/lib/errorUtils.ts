interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

type MessageOverrideFn = (error: ApiError) => string | null;

export const getErrorMessage = (
  error: unknown,
  overrideMessage?: MessageOverrideFn
): string => {
  try {
    const err = error as ApiError;

    const custom = overrideMessage?.(err);
    if (custom) return custom;

    const message = err?.response?.data?.message || err?.message;
    return message || 'Something went wrong. Please try again.';
  } catch {
    return 'An unknown error occurred.';
  } 
};


export const getErrorMessageWithCustom = (
  error: unknown,
  customMessages: Record<string, string>,
  fallbackMessage = 'Something went wrong. Please try again.'
): string => {
  try {
    const err = error as ApiError;
    const message = err?.response?.data?.message || err?.message;

    if (message && customMessages[message]) {
      return customMessages[message];
    }

    return message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};
