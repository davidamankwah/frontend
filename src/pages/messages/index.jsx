// MessagePage.js
import React from 'react';
import MessageListWidget from '../widget/MessageListWidget';
import MessageInputWidget from '../widget/MessageInputWidget';

import UserSelectorWidget from '../widget/UserSelectorWidget';

const MessagePage = () => {
  return (
    <div className="message-page">
      <UserSelectorWidget />
      <MessageListWidget />
      <MessageInputWidget />
    </div>
  );
};

export default MessagePage;
