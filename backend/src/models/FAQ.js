import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: {type: String, required: true },
    answer: {type: String, required: true}
},
{timestamps: true}//To know the time create and updated
);

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;