import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false
            }
        });
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "max-w-md mx-auto text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Something went wrong" }), _jsx("p", { className: "text-gray-600 mb-4", children: "The application encountered an error." }), _jsxs("details", { className: "text-left bg-gray-100 p-4 rounded", children: [_jsx("summary", { className: "cursor-pointer font-semibold", children: "Error Details" }), _jsx("pre", { className: "mt-2 text-sm text-red-600", children: this.state.error?.toString() })] }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Reload Page" })] }) }));
        }
        return this.props.children;
    }
}
