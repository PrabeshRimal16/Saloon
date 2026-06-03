import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) {
    // could log to external service here
    try { console.error('ErrorBoundary caught', error, info); } catch (e) {}
  }
  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-700">Something went wrong</h2>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg">
          Reload page
        </button>
      </div>
    );
    return this.props.children;
  }
}
