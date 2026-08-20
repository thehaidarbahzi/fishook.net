import { TriangleAlert } from "lucide-react";
import { Component, Fragment, type ReactNode } from "react";

import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  resetKey: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReset = () => {
    this.setState((prev) => ({ hasError: false, resetKey: prev.resetKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center p-gutter">
          <EmptyState
            icon={TriangleAlert}
            title="Something went wrong"
            description="An unexpected error occurred while rendering the app"
            action={
              <div className="flex items-center gap-2">
                <Button type="button" onClick={this.handleReset}>
                  Try again
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </Button>
              </div>
            }
          />
        </main>
      );
    }

    return <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>;
  }
}

export default ErrorBoundary;
