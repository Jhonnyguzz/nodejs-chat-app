const Message = require('../db/mongo');

let pendingMessages = []

const addMessage = (message) => {
    pendingMessages.push(message) //from, to, text
    const msgdb = new Message({text: message.text, from: message.from, to: message.to, createdAt: new Date().getTime()});
    msgdb.save().then(() => console.log("Msg saved")).catch((error) => {console.log("Error saving message!", error)});
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

const findMessagesForMeFromSomeone = async (me, someone) => {
    let allMessages = await getFromDb();
    allMessages.sort((m1, m2) => m1.createdAt < m2.createdAt? -1 : 1);
    return allMessages.filter(user => (user.to === me && user.from === someone) 
        || (user.to === someone && user.from === me));
};

const findMessagesForMeFromSomeone2 = (me, someone) => {
    return pendingMessages.filter(user => (user.to === me && user.from === someone) 
        || (user.to === someone && user.from === me));
};

const getAllMessages = () => {
    return pendingMessages;
};

const getFromDb = async () => {
    return Message.find({});
};

module.exports = {
    addMessage,
    getPendingMessagesForUsername,
    generateMessage,
    generateLocationMessage,
    generatePrivateMessage,
    findMessagesForUsername,
    findMessagesForMeFromSomeone,
    getAllMessages,
    getFromDb
};