import io from 'socket.io-client'
import React from 'react'
import ReactDOM from 'react-dom'

// const config = require('../config')

const socket = io.connect('localhost' + ':' + '8888')
class ChatApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {messages: []}
    }
    componentDidMount() {
        socket.on('messages', messages => {
            if(messages.length > 7)
                messages = messages.slice(messages.length - 7, messages.length)
            this.setState({messages: messages})
            const list = document.getElementsByClassName("messageList")[0]
            list.scrollTop = list.scrollHeight
        })
        socket.on('newMessage', message => {
            console.log('got message:' + message.message)
            this.addMessage(message)
        })
        socket.emit('register')
        socket.emit('fetchMessages')
        console.log('AAAAAAAA')
        
    }
    addMessage(message) { 
        message = JSON.parse(message)
        let newMessages
        if(this.state.messages.length > 7)
            newMessages = this.state.messages.slice(1)
        else
            newMessages = this.state.messages.slice(0)
        newMessages = newMessages.concat(message)
        console.log(newMessages)
        this.setState({
            messages: newMessages
        })
    }
    render() {
        return (
            <div className="Comments">
                <MessageList messages={this.state.messages} />
            </div>
        )
    }
}

class MessageList extends React.Component {
    render() {
        let Messages = <div>Loading Messages...</div>
        if(this.props.messages) {
            Messages = this.props.messages.map((message, index) => {
                return <Message message={message} key={index} />
            })
        }
        return (
            <div className="messageList">
                {Messages}
            </div>
        )
    }
}

class Message extends React.Component {
    render() {
        const time = new Date(this.props.message.date)
        var name = (this.props.message.from.last_name == undefined ? '' : this.props.message.from.last_name)
        name += (this.props.message.from.first_name == undefined ? '' : this.props.message.from.first_name)
        
        return (
            <li className="mdl-list__item">
                <span className="mdl-list__item-primary-content">
                    <span>{name}</span>
                    <div className="mdl-grid">
                        <div className="mdl-cell mdl-cell--9-col">
                            <span className="mdl-list__item-text-body">{this.props.message.text}</span>
                        </div>
                    </div>
                </span>
            </li>
        )
    }
}

ReactDOM.render(
    <ChatApp />,
    document.getElementById("content")
)