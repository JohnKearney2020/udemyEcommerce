import React from 'react';
import { Alert } from 'react-bootstrap';

//children prop is the text that we want inside
const Message = ({ variant, children }) => {
  return (
    <Alert variant={variant}>
      {children}
    </Alert>
  )
}

Message.defaultProps = {
  variant: 'info'
}

export default Message;
