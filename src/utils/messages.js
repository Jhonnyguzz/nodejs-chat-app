let pendingMessages = []

const addMessage = (message) => {
    pendingMessages.push(message) //from, to, text
};

const getPendingMessagesForUsername = (username) => {
    return pendingMessages.filter(m => m.to === username);
};

const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
};

const generatePrivateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
};

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
};

const findMessagesForUsername = (username) => {
    return pendingMessages.filter(user => user.to === username);
};

module.exports = {
    addMessage,
    getPendingMessagesForUsername,
    generateMessage,
    generateLocationMessage,
    generatePrivateMessage,
    findMessagesForUsername
};