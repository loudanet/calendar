import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}
  
interface State {
    errorMsg: string;
}

class ErrorBoundary extends Component <Props, State> {
    state: { errorMsg: string };
    
    constructor(props: Props) {
        super(props);
        this.state = { errorMsg: "" };
    }

    static getDerivedStateFromError(error: Error): State {
        return { errorMsg: error.message };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        alert("Uncaught error: " + error + "; " + errorInfo);
    }

    render() {
        if (this.state.errorMsg.length > 0) {
            return (<h1>Oh no! My webpage broke. Here is the error message: {this.state.errorMsg}</h1>);
        }
        return this.props.children;
    }
}

export default ErrorBoundary;