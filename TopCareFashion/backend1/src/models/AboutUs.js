import mongoose from 'mongoose';

const aboutUsSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true, // e.g., 'our-story', 'mission'
  },
  title: {
    type: String,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Accepts array, string, object
    required: true,
  }
}, { timestamps: true });

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);
export default AboutUs;
