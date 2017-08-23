import React, {Component} from 'react';
import Messages from './Messages.jsx'

class MessageList extends Component {
  render() {
    const messages = this.props.messages.map(a => {
      return <Messages
       key={ a.id }
       username={ a.username }
       content={ a.content } />;
    })


    return (
      <div className= "message-list">
        {messages}
      </div>
    )
  }
}

export default MessageList;
