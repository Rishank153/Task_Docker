import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';
import api from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const { user } = useAuth();

    // Fetch conversations when user changes
    useEffect(() => {
        const fetchConversations = async () => {
            if (user?.id) {
                try {
                    const response = await api.get(`/conversations?userId=${user.id}`);
                    setConversations(response.data);
                } catch (error) {
                    console.error('Error fetching conversations:', error);
                }
            }
        };

        fetchConversations();
    }, [user]);

    // Fetch messages when conversation changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentConversation) {
                try {
                    const response = await api.get(`/messages?conversationId=${currentConversation}`);
                    setMessages(response.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [currentConversation]);

    const joinConversation = (conversationId) => {
        setCurrentConversation(conversationId);
    };

    const sendMessage = async (content) => {
        if (!currentConversation || !user?.id) return;

        const newMessage = {
            conversationId: currentConversation,
            senderId: user.id,
            content,
            timestamp: new Date().toISOString()
        };

        // Save the current messages for potential rollback
        const previousMessages = [...messages];

        try {
            // Optimistic update
            setMessages(prev => [...prev, newMessage]);

            // Send to server
            await api.post('/messages', newMessage);

            // Refresh messages to get server-generated ID/timestamp
            const response = await api.get(`/messages?conversationId=${currentConversation}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error sending message:', error);
            // Revert optimistic update on error
            setMessages(previousMessages);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                conversations,
                currentConversation,
                messages,
                joinConversation,
                sendMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};