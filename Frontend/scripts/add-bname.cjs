const fs = require('fs');
const path = require('path');

// Read exercises
const exercisesPath = path.join(__dirname, '..', 'yogaExercises.json');
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Mapping from exercise name to backend pose name (base pattern)
// Backend uses patterns like: "Bow_Pose_or_Dhanurasana" for "Bow Pose or Dhanurasana"
const nameMapping = {
  "Adho Mukha Svanasana": "Downward_Facing_Dog",
  "Adho Mukha Vrksasana": "Handstand",
  "Akarna Dhanurasana": "Akarna_Dhanurasana",
  "Ananda Balasana": "Happy_Baby",
  "Anantasana": "Sleeping_Vishnu",
  "Anjaneyasana": "Low_Lunge",
  "Ardha Chandrasana": "Half_Moon",
  "Ardha Matsyendrasana": "Half_Lord_of_the_Fishes",
  "Ardha Pincha Mayurasana": "Dolphin",
  "Astavakrasana": "Eight_Angle",
  "Baddha Konasana": "Bound_Angle_Pose_or_Baddha_Konasana",
  "Bakasana": "Crane_(Crow)_Pose_or_Bakasana",
  "Balasana": "Child_Pose_or_Balasana",
  "Bharadvajasana I": "Bharadvajas_Twist_pose_or_Bharadvajasana_I",
  "Bhekasana": "Frog",
  "Bhujangasana": "Cobra_Pose_or_Bhujangasana",
  "Bhujapidasana": "Shoulder_Pressing",
  "Camatkarasana": "Wild_Thing",
  "Cockerel Pose": "Cockerel_Pose",
  "Dandasana": "Staff",
  "Bow Pose or Dhanurasana": "Bow_Pose_or_Dhanurasana",
  "Dwi Pada Viparita Dandasana": "Two_Legged_Inverted_Staff",
  "Garudasana": "Eagle",
  "Gomukhasana": "Cow_Face_Pose_or_Gomukhasana",
  "Halasana": "Plow",
  "Janu Sirsasana": "Head_to_Knee",
  "Kapotasana": "Pigeon",
  "Kraunchasana": "Heron",
  "Kumbhakasana": "Plank",
  "Legs Up The Wall Pose or Viparita Karani": "Legs_Up_Wall",
  "Makarasana": "Crocodile",
  "Malasana": "Garland",
  "Marjaryasana": "Cat_Cow_Pose_or_Marjaryasana",
  "Matsyasana": "Fish",
  "Mayurasana": "Peacock",
  "Natarajasana": "Dancer",
  "Parighasana": "Gate",
  "Boat Pose or Paripurna Navasana": "Boat_Pose_or_Paripurna_Navasana",
  "Revolved Head-to-Knee Pose or Parivrtta Janu Sirsasana": "Revolved_Head_to_Knee",
  "Parsva Bakasana": "Side_Crow",
  "Parsvottanasana": "Pyramid",
  "Pasasana": "Noose",
  "Paschimottanasana": "Seated_Forward_Bend",
  "Pavanamuktasana": "Wind_Relieving",
  "Pincha Mayurasana": "Forearm_Stand",
  "Prasarita Padottanasana": "Wide_Legged_Forward_Fold",
  "Purvottanasana": "Upward_Plank",
  "Rajakapotasana": "King_Pigeon",
  "Salabhasana": "Locust",
  "Salamba Sarvangasana": "Supported_Shoulderstand",
  "Salamba Sirsasana": "Supported_Headstand",
  "Savasana": "Corpse_Pose_or_Savasana",
  "Bridge Pose or Setu Bandha Sarvangasana": "Bridge_Pose_or_Setu_Bandha_Sarvangasana",
  "Sitting Pose": "Sitting_Pose",
  "Split Pose": "Split",
  "Supta Baddha Konasana": "Reclining_Bound_Angle",
  "Supta Padangusthasana": "Reclining_Hand_to_Big_Toe",
  "Supta Virasana or Vajrasana": "Reclining_Hero",
  "Tittibhasana": "Firefly",
  "Tolasana": "Scale",
  "Upavistha Konasana": "Wide_Angle_Seated_Forward_Bend",
  "Urdhva Dhanurasana": "Upward_Bow",
  "Urdhva Prasarita Eka Padasana": "Standing_Split",
  "Ustrasana": "Camel_Pose_or_Ustrasana",
  "Utkatasana": "Chair_Pose_or_Utkatasana",
  "Uttana Shishosana": "Extended_Puppy",
  "Uttanasana": "Standing_Forward_Bend",
  "Utthita Padangusthasana": "Extended_Hand_to_Big_Toe",
  "Extended Side Angle Pose or Utthita Parsvakonasana": "Extended_Side_Angle_Pose_or_Utthita_Parsvakonasana",
  "Extended Triangle Pose or Utthita Trikonasana": "Extended_Triangle_Pose_or_Utthita_Trikonasana",
  "Vajrasana": "Thunderbolt",
  "Vasisthasana": "Side_Plank",
  "Viparita Virabhadrasana": "Reverse_Warrior",
  "Virabhadrasana I": "Warrior_Pose_I_or_Virabhadrasana_I",
  "Virabhadrasana II": "Warrior_Pose_II_or_Virabhadrasana_II",
  "Virabhadrasana III": "Warrior_Pose_III_or_Virabhadrasana_III",
  "Vrksasana": "Tree",
  "Vrschikasana": "Scorpion",
  "Yoganidrasana": "Yogic_Sleep"
};

// Add bName to each exercise
exercises.forEach(ex => {
  const bName = nameMapping[ex.name];
  if (bName) {
    ex.bName = bName;
  } else {
    console.warn(`No backend name mapping for: ${ex.name}`);
    // Fallback: convert name to snake_case
    ex.bName = ex.name.replace(/\s+or\s+/gi, '_or_').replace(/[()]/g, '').replace(/\s+/g, '_');
  }
});

// Write back
fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2), 'utf8');
console.log('✅ Added bName to all exercises!');
