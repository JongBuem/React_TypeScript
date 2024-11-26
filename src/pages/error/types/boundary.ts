import { ReactNode } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: { message?: string } | null;
}
