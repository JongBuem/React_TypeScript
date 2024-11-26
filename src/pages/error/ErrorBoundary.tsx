import { Component, ErrorInfo } from "react";
import Error from "pages/error";
import { ErrorBoundaryProps, ErrorBoundaryState } from "./types";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: { message: error.message } };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      // Null-safe 방식으로 Error 컴포넌트에 전달
      return <Error props={{ error: error ?? undefined }} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
