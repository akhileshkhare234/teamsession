import React, { useState, useEffect } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

const ErrorBoundary = ({ children }: any) => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
  });

  useEffect(() => {
    const componentDidCatch: any = (
      error: Error,
      errorInfo: React.ErrorInfo
    ) => {
      // You can log or handle the error here
      console.error("Error caught by error boundary:", error, errorInfo);
      setErrorState({ hasError: true });
    };

    // Add the error boundary here
    window.addEventListener("error", componentDidCatch);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("error", componentDidCatch);
    };
  }, []);

  if (errorState.hasError) {
    return <div>Something went wrong!</div>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
