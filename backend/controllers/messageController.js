import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
// import { MessageDelete } from "../models/messageDelete.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}
export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}


export const delMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        await Conversation.updateOne(
            { messages: messageId },
            { $pull: { messages: messageId } }
        );

        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting message", error: error.message });
    }
};