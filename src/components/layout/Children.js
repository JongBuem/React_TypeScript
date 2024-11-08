import React from 'react';
import PropTypes from 'prop-types';

Children.propTypes = {
  props: PropTypes.object,
};

export default function Children(props) {
  return <div style={{ minHeight: '80vh' }}>{props.props}</div>;
}
