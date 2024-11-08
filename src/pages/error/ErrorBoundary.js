import React from 'react';
import Error from 'pages/error';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo); //error message
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <Error props={this.state} />;
    }

    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.any,
};

export default ErrorBoundary;
