import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary] ${this.props.fallback || "Section"} crashed:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackRender) return this.props.fallbackRender(this.state.error);
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[#8C8C8C] text-[1rem]">{this.props.message || "Something went wrong loading this section."}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 text-[0.875rem] bg-[#2A2A2A] text-white rounded-[4px] hover:bg-[#202020]"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
