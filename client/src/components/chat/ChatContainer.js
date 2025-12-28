// src/components/chat/ChatContainer.js
import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { List, ListItem, TextField, Button, Box, Typography } from '@mui/material';

export default function ChatContainer() {
    const { conversations, joinConversation, currentConversation, messages, sendMessage } = useChat();
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && currentConversation) {
            sendMessage(message);
            setMessage('');
        }
    };

    return (
        <Box display="flex" height="80vh">
            <Box width="30%" borderRight="1px solid #ccc">
                <Typography variant="h6">Conversations</Typography>
                <List>
                    {conversations.map(conv => (
                        <ListItem
                            button
                            key={conv._id}
                            selected={currentConversation === conv._id}
                            onClick={() => joinConversation(conv._id)}
                        >
                            {conv.participants.map(p => p.name).join(', ')}
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box width="70%" display="flex" flexDirection="column">
                <Box flexGrow={1} overflow="auto">
                    {messages.map((msg, i) => (
                        <div key={i}>
                            <strong>{msg.sender.name}: </strong>
                            <span>{msg.content}</span>
                        </div>
                    ))}
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Send
                    </Button>
                </form>
            </Box>
        </Box>
    );
}