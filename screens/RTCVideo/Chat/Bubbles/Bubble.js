import React from 'react';
import SentMessage from './SentMessage';
import RecievedMessage from './RecievedMessage';

const Bubble = ({message}) => {
  if (message.sent) return <SentMessage message={message} />;
  else return <RecievedMessage message={message} />;
};

export default Bubble;
