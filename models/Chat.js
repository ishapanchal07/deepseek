import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        messages: [
            {
                role: {type: String, requird:true},
                content: {type: String, requird:true},
                timestamps: {type: Number, requird:true},
            },
        ],
        userId: {type: String, requird:true},
    },
    {timestamps: true}
);

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema)

export default Chat;
