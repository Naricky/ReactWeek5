
import React, {Component} from 'react';
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'
import NavBar from './NavBar.jsx'

const ChattyData = {
 currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
 messages: [
   { id: "1",
     username: "Bob",
     content: "Has anyone seen my marbles?",
   },
   { id: "2",
     username: "Anonymous",
     content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
   }
 ]
}

class App extends Component {
   constructor() {
       super();
       this.state = {
           currentUser: ChattyData.currentUser.name,
           messages: ChattyData.messages
       }
       this.index = 4;
   }

componentDidMount() {

this.socket = new WebSocket('ws://localhost:3001');

this.socket.addEventListener('message', (event) => {
      console.log('Got a message on App.jsx');

      const newMessages = this.state.messages;
      const messageObject = JSON.parse(event.data);
      newMessages.push(messageObject);
      this.setState({messages: newMessages});
      console.log(event.data);
    });


}

sendMessage(text){
  console.log("sending " +text)
  const newMessage = {
    id: this.index,
    username: this.state.currentUser,
    content: text
  }
  this.socket.send(JSON.stringify(newMessage) , 'message');  // Sends the data intake by keyinput to the server
}

changeUsername(newUsername){
  this.setState({currentUser: newUsername});
  const newuser = {
    id: this.index,
    username: newUsername,
    content: this.state.content
  }
  this.socket.send(JSON.stringify(newuser), 'message');
  //TO DO : Send a system message saying that the user changed their name.
}


 render() {
   return (
       <div>
           <NavBar/>
           <MessageList messages={ this.state.messages}/>
           <ChatBar changeUsername={text => this.changeUsername(text)} sendMessage={text => this.sendMessage(text)}/>
       </div>
   );
 }
}
export default App;