import { Exercise } from "../types";

export const PREDEFINED_PLANS: Record<string, Record<string, { title: string, exercises: Exercise[] }[]>> = {
  "Beginner": {
    "Shoulders": [
      {
        title: "Basic Shoulder Mobility",
        exercises: [
          { name: "Dynamic Arm Swings", duration: 60, sets: 2, description: "Controlled horizontal and vertical arm swings.", category: "WARMUP" },
          { name: "Scapular Pulls", reps: "15", sets: 3, duration: 0, description: "Small movements focusing on shoulder blade retraction.", category: "SPT" },
          { name: "External Rotations", reps: "12", sets: 3, duration: 0, description: "Using a light band, rotate arm outwards.", category: "SPT" },
          { name: "Overhead Reach", duration: 45, sets: 2, description: "Reach high and hold while maintaining core stability.", category: "STRETCH" }
        ]
      },
      {
        title: "Foundation Stability",
        exercises: [
          { name: "Plank Shoulder Taps", reps: "20", sets: 3, duration: 0, description: "In plank position, tap opposite shoulder.", category: "CORE" },
          { name: "Wall Slides", reps: "15", sets: 3, duration: 0, description: "Keep back and arms against wall while sliding.", category: "SPT" },
          { name: "Isometric Bow Hold", duration: 30, sets: 4, description: "Hold bow at full draw (no arrow/light bow).", category: "SPT" }
        ]
      },
      {
        title: "Deltoid Activation",
        exercises: [
          { name: "Front Raises", reps: "15", sets: 3, description: "Raise light weights or bands to the front.", category: "SPT" },
          { name: "Lateral Raises", reps: "15", sets: 3, description: "Raise light weights or bands to the sides.", category: "SPT" },
          { name: "Rear Delt Fly", reps: "15", sets: 3, description: "Hinge forward and raise arms out to sides.", category: "SPT" }
        ]
      },
      {
        title: "YPW Raises",
        exercises: [
          { name: "Y-Raises", reps: "12", sets: 3, description: "Raise arms in a Y shape.", category: "SPT" },
          { name: "T-Raises", reps: "12", sets: 3, description: "Raise arms in a T shape.", category: "SPT" },
          { name: "W-Raises", reps: "12", sets: 3, description: "Raise arms in a W shape.", category: "SPT" }
        ]
      },
      {
        title: "Shoulder Endurance I",
        exercises: [
          { name: "Hold for 10, Rest for 10", duration: 120, sets: 3, description: "Hold bow at full draw for 10s, rest 10s, repeat.", category: "SPT" },
          { name: "Slow Tempo Draws", reps: "10", sets: 3, description: "Draw the bow very slowly over 5 seconds.", category: "SPT" }
        ]
      }
    ],
    "Back": [
      {
        title: "Back Engagement 101",
        exercises: [
          { name: "Scapular Squeeze", duration: 30, sets: 4, description: "Squeeze shoulder blades together and hold.", category: "SPT" },
          { name: "Band Pull Aparts", reps: "20", sets: 3, description: "Pull band across chest.", category: "SPT" },
          { name: "Seated Rows (Band)", reps: "15", sets: 3, description: "Pull band towards abdomen.", category: "SPT" }
        ]
      },
      {
        title: "Rhomboid Focus",
        exercises: [
          { name: "Superman Holds", duration: 30, sets: 3, description: "Lift chest and legs off floor while lying prone.", category: "CORE" },
          { name: "Prone Y-Lifts", reps: "15", sets: 3, description: "Lying prone, lift arms in Y shape.", category: "SPT" },
          { name: "Scapular Pushups", reps: "15", sets: 3, description: "Pushup movement using only shoulder blades.", category: "SPT" }
        ]
      },
      {
        title: "Lat Activation",
        exercises: [
          { name: "Straight Arm Pulldowns", reps: "15", sets: 3, description: "Push band down with straight arms.", category: "SPT" },
          { name: "Single Arm Lat Pull", reps: "15", sets: 3, description: "Focus on one side at a time.", category: "SPT" }
        ]
      }
    ],
    "Core": [
      {
        title: "Archery Core Foundations",
        exercises: [
          { name: "Dead Bug", reps: "16", sets: 3, description: "Slow, controlled limb movements.", category: "CORE" },
          { name: "Bird Dog", reps: "12", sets: 3, description: "Extend opposite arm and leg.", category: "CORE" },
          { name: "Side Plank Hold", duration: 30, sets: 3, description: "Hold side plank on each side.", category: "CORE" }
        ]
      },
      {
        title: "Stability Sprint",
        exercises: [
          { name: "Plank Hold", duration: 60, sets: 3, description: "Standard forearm plank.", category: "CORE" },
          { name: "Russian Twists", reps: "30", sets: 3, description: "Rotate torso side to side.", category: "CORE" },
          { name: "Leg Raises", reps: "15", sets: 3, description: "Lift straight legs while lying on back.", category: "CORE" }
        ]
      },
      {
        title: "Lower Back Strength",
        exercises: [
          { name: "Glute Bridges", reps: "20", sets: 3, description: "Lift hips while lying on back.", category: "CORE" },
          { name: "Cat-Cow Stretch", duration: 60, sets: 2, description: "Move between arching and rounding back.", category: "WARMUP" },
          { name: "Cobra Stretch", duration: 30, sets: 3, description: "Lift chest using arms while prone.", category: "STRETCH" }
        ]
      }
    ],
    "Full Body": [
       {
          title: "Total Body Warmup",
          exercises: [
             { name: "Jumping Jacks", duration: 60, sets: 2, description: "Full body cardio movement.", category: "WARMUP" },
             { name: "Bodyweight Squats", reps: "20", sets: 3, description: "Basic squat movement.", category: "LEGS" },
             { name: "Pushups (Knees)", reps: "12", sets: 3, description: "Modified pushup for beginners.", category: "SPT" },
             { name: "Plank", duration: 45, sets: 3, description: "Core stability.", category: "CORE" }
          ]
       }
    ]
  },
  "Intermediate": {
    "Shoulders": [
      {
        title: "Elite Shoulder Stability",
        exercises: [
          { name: "Face Pulls", reps: "20", sets: 4, description: "Pull band towards face, separating hands.", category: "SPT" },
          { name: "Shoulder Over-Unders", reps: "15", sets: 3, description: "Move band from front to back over head.", category: "WARMUP" },
          { name: "High-Volume Bow Holds", duration: 60, sets: 6, description: "Hold full draw for 60s.", category: "SPT" }
        ]
      }
    ],
    "Back": [
      {
        title: "Scapular Control Power",
        exercises: [
          { name: "Band Pull-Aparts", reps: "20", sets: 4, description: "Pull band apart at chest level.", category: "SPT" },
          { name: "Single Arm Rows", reps: "12", sets: 3, description: "Focus on pulling with the elbow.", category: "SPT" },
          { name: "Long Hold Drawing", duration: 45, sets: 5, description: "Hold full draw for extended period.", category: "SPT" }
        ]
      },
      {
        title: "Back Endurance II",
        exercises: [
           { name: "Renegade Rows", reps: "16", sets: 4, description: "Row weights in plank position.", category: "SPT" },
           { name: "Inverse Flys", reps: "15", sets: 4, description: "Focus on upper back squeeze.", category: "SPT" }
        ]
      }
    ],
    "Arms": [
       {
          title: "Draw Arm Strength",
          exercises: [
             { name: "Hammer Curls", reps: "15", sets: 3, description: "Vertical grip curls.", category: "SPT" },
             { name: "Tricep Pushdowns", reps: "15", sets: 3, description: "Extended arm focus.", category: "SPT" },
             { name: "Forearm Curls", reps: "20", sets: 3, description: "Wrist strength for release.", category: "SPT" }
          ]
       }
    ]
  },
  "Advanced": {
     "Full Body": [
        {
           title: "Olympian Conditioning",
           exercises: [
              { name: "Burpees", reps: "20", sets: 5, description: "High intensity full body.", category: "CARDIO" },
              { name: "Weighted Pull-ups", reps: "10", sets: 4, description: "Strength focus.", category: "SPT" },
              { name: "Hollow Body Holds", duration: 60, sets: 4, description: "Advanced core.", category: "CORE" },
              { name: "100 Arrow Simulation", duration: 300, sets: 1, description: "Draw and hold simulation.", category: "SPT" }
           ]
        }
     ]
  }
};
