const mongoose = require("mongoose");
const freelancerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    title: { type: String, default: "Freelancer", maxlength: 150 },
    overview: { type: String, maxlength: 3000, default: "" },
    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "expert"],
          default: "intermediate",
        },
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        from: Date,
        to: Date,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
      },
    ],
    portfolio: [
      {
        title: String,
        description: String,
        images: [String],
        videos: [String],
        githubLink: String,
        liveLink: String,
        technologies: [String],
      },
    ],
    hourlyRate: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ["full-time", "part-time", "not-available"],
      default: "full-time",
    },
    languages: [
      {
        name: String,
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
        },
      },
    ],
    certifications: [
      {
        name: String,
        issuingOrg: String,
        issueDate: Date,
        credentialUrl: String,
      },
    ],
    totalEarnings: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ["rising-talent", "top-rated", "top-rated-plus", "expert"],
      default: "rising-talent",
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);
freelancerProfileSchema.index({ "skills.name": 1 });
freelancerProfileSchema.index({ averageRating: -1 });
module.exports = mongoose.model("FreelancerProfile", freelancerProfileSchema);
