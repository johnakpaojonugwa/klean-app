import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Error caught by boundary:", error, info);
    this.setState({ errorInfo: info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle size={32} className="text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              An unexpected error occurred. We apologize for the inconvenience. Try refreshing the page or contact support if the problem persists.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 rounded-lg p-3 mb-4 border border-red-200">
                <p className="text-xs font-mono text-gray-700 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors font-medium"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
