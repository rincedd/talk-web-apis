import React, { Component, ReactNode } from "react";

type ErrorState = { error: Error | null };

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorState> {
  constructor(props: Readonly<{ children: React.ReactNode }>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { error };
  }

  render() {
    const { error } = this.state;
    return error ? (
      <div className="slide error">
        <h1>Oops: {error.name} - {error.message}</h1>
        {error.stack && <pre>{error.stack}</pre>}
      </div>
    ) : (
      this.props.children
    );
  }
}
