import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    const sanitizedError = {
      message: error.message?.replace(/[\r\n\t]/g, ' ') || 'Unknown error',
      stack: error.stack?.replace(/[\r\n\t]/g, ' ') || 'No stack trace'
    };
    console.error('ErrorBoundary caught an error:', sanitizedError.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
          <div className="max-w-md mx-auto text-center p-6 bg-white rounded-2xl shadow-lg border border-pink-100">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-2xl font-bold text-pink-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We're having trouble loading your beauty services. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-pink-600 to-blue-600 text-white px-6 py-3 rounded-full hover:from-pink-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md min-h-[44px]"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
