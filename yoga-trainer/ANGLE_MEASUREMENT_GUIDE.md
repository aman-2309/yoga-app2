# Angle Measurement Tool - User Guide

## 📐 How to Use the Angle Measurement Tool

This tool helps you manually measure angles in yoga pose images and generate configuration for `pose_angles.py`.

---

## 🚀 Quick Start

### Step 1: Install Required Package

```powershell
# Activate your virtual environment
cd "d:\yoga_webapp\new yoga app"
.\myenv\Scripts\activate

# Install OpenCV (if not already installed)
pip install opencv-python
```

### Step 2: Run the Tool

```powershell
# Basic usage
python scripts/angle_measurement_tool.py "path/to/your/yoga_pose_image.jpg"

# Example with Tree Pose
python scripts/angle_measurement_tool.py "data/reference_poses/images/Tree_Pose_or_Vrksasana__front/tree_pose.jpg"
```

---

## 📖 Detailed Instructions

### Understanding the 3-Point Angle System

To measure an angle, you need to click **3 points**:

```
     Point 1 (shoulder)
         •
          \
           \  ← This angle is measured
            \
             • Point 2 (vertex/elbow) ← MIDDLE POINT (the joint)
              \
               \
                \
                 • Point 3 (wrist)
```

**Example: Measuring a bent elbow**
1. **Point 1**: Click on the shoulder
2. **Point 2 (Vertex)**: Click on the elbow (the joint where angle is formed)
3. **Point 3**: Click on the wrist

---

## 🎯 Step-by-Step Workflow

### 1. **Open Your Image**

Run the command with your yoga pose image:
```powershell
python scripts/angle_measurement_tool.py "data/reference_poses/images/Warrior_I__front/warrior.jpg"
```

### 2. **Measure Each Important Angle**

For each angle you want to measure:

#### Click the 3 Points:
- Green circle = Point 1
- Red circle = Point 2 (Vertex)
- Blue circle = Point 3

#### Enter Angle Details:
After clicking 3 points, you'll be prompted:

```
✓ ANGLE MEASURED: 90.5°
========================================

→ Enter name for this angle: Front Knee (Left)
→ Enter custom tolerance (or press Enter for default): 15
→ Enter custom weight (or press Enter for default): 3.0

✓ Saved: Front Knee (Left) = 90.5° (tolerance: ±15°, weight: 3.0)
```

**Tips for naming angles:**
- Be descriptive: "Front Knee (Left)" not just "knee"
- Specify side: "Left Elbow" vs "Right Elbow"
- Indicate body part: "Torso Alignment", "Hip Angle"

**Tolerance:** How much deviation is acceptable (default: 15°)
- Strict poses: 5-10°
- Moderate: 15°
- Flexible: 20-30°

**Weight:** How important this angle is (default: 1.0)
- Critical angles: 2.5-5.0 (pose-defining, must be correct)
- Important: 1.5-2.5 (significant for pose quality)
- Supporting: 1.0 (helps but not critical)
- Minor: 0.5-0.9 (optional refinement)

**Note:** Weights are relative - an angle with weight 3.0 contributes 3× more to the accuracy score than an angle with weight 1.0. There's no hard limit, but staying in the 0.5-5.0 range keeps scoring balanced.

### 3. **Repeat for All Angles**

Measure all important angles in the pose:
- Joint angles (knees, elbows, hips, shoulders)
- Body alignment angles
- Limb positions

### 4. **Save Your Measurements**

Press **'s'** to save:
- Creates `{image_name}_angles.json` with all measurements
- Creates `{image_name}_annotated.jpg` with visual annotations
- **NEW: Offers to auto-append configuration to `pose_angles.py`**
  - Enter pose details (ID, view, display name)
  - Specify required keypoints (or use defaults)
  - Automatically creates pose configuration skeleton
  - You only need to update the placeholder keypoint names!

---

## ⌨️ Keyboard Commands

| Key | Action |
|-----|--------|
| **Click 3 points** | Measure an angle |
| **r** | Reset current 3 points (before completion) |
| **s** | Save all measurements and optionally append to pose_angles.py |
| **q** | Quit the tool |

---

## 📝 Example: Measuring Tree Pose

Let's measure all angles for Tree Pose (Front View):

### 1. Run the tool
```powershell
python scripts/angle_measurement_tool.py "data/reference_poses/images/Tree_Pose_or_Vrksasana__front/tree.jpg"
```

### 2. Measure Standing Leg (Right Knee)
- Click: Right hip → Right knee → Right ankle
- Name: `Standing Leg (Right Knee)`
- Target: 180° (straight leg)
- Tolerance: 5°
- Weight: 3.0 (very important)

### 3. Measure Bent Leg (Left Hip)
- Click: Left shoulder → Left hip → Left knee
- Name: `Bent Leg (Left Hip)`
- Target: 135° (leg raised to side)
- Tolerance: 20°
- Weight: 2.5

### 4. Measure Bent Knee
- Click: Left hip → Left knee → Left ankle
- Name: `Bent Knee`
- Target: 90°
- Tolerance: 15°
- Weight: 2.0

### 5. Continue for other angles...
- Arms (if relevant)
- Hip alignment
- Shoulder alignment

### 6. Press 's' to save

---

## 📋 Adding Measurements to Your App

After measuring, the tool will:

1. **Generate JSON and annotated image**
2. **Print the configuration code** (for manual copying if needed)
3. **Ask if you want to auto-append to `pose_angles.py`**

### Auto-Append Workflow (Recommended):

When you press **'s'** to save, you'll be prompted:

```
💾 AUTO-APPEND TO pose_angles.py
========================================

Do you want to add this pose configuration to pose_angles.py? (y/n): y

----------------------------------------------------------------------
POSE CONFIGURATION
----------------------------------------------------------------------
Enter pose ID (default: Tree_Pose_front): 
Enter view (front/side) (default: front): 
Enter display name (default: Tree_Pose): Tree Pose
📍 Required keypoints (used in angles):
   Standard: nose, left_shoulder, right_shoulder, left_elbow, right_elbow,
            left_wrist, right_wrist, left_hip, right_hip, left_knee,
            right_knee, left_ankle, right_ankle

Enter required keypoints (comma-separated) or press Enter for defaults:

========================================
✅ SUCCESS!
========================================
✓ Added 'Tree_Pose_front' to pose_angles.py
✓ Location: d:\yoga_webapp\new yoga app\app\config\pose_angles.py

📝 NEXT STEPS:
----------------------------------------------------------------------
1. Open pose_angles.py and find your new pose configuration
2. Update the placeholder keypoint names:
   Replace ("point1_name", "vertex_name", "point2_name")
   with actual MediaPipe keypoint names like:
   ("left_hip", "left_knee", "left_ankle")
3. Restart your backend server
4. Test the pose in your web app!
========================================
```

### What Gets Auto-Generated:

The tool creates a complete `PoseAngleConfig` skeleton:

```python
# Tree Pose (Front View)
"Tree_Pose_front": PoseAngleConfig(
    pose_name="Tree_Pose",
    view="front",
    required_keypoints=[
        "nose", "left_shoulder", "right_shoulder",
        # ... all your selected keypoints
    ],
    required_angles=[
        AngleDefinition(
            name="Standing Leg (Right Knee)",
            points=("point1_name", "vertex_name", "point2_name"),  # ← Update these!
            target_angle=180.0,
            tolerance=5.0,
            weight=3.0
        ),
        # ... all your measured angles
    ]
),
```

### Your Only Manual Task:

Open `app/config/pose_angles.py` and update the placeholder keypoint names:

```python
# BEFORE (auto-generated):
points=("point1_name", "vertex_name", "point2_name"),

# AFTER (you update):
points=("right_hip", "right_knee", "right_ankle"),
```

### MediaPipe Keypoint Names:

```
Face: nose, left_eye, right_eye, left_ear, right_ear, mouth_left, mouth_right
Upper Body: left_shoulder, right_shoulder, left_elbow, right_elbow
Hands: left_wrist, right_wrist, left_pinky, right_pinky, left_index, right_index
Lower Body: left_hip, right_hip, left_knee, right_knee
Feet: left_ankle, right_ankle, left_heel, right_heel, left_foot_index, right_foot_index
```

---

## 🎨 Understanding the Output

### JSON File (`tree_pose_angles.json`):
```json
{
  "image": "path/to/image.jpg",
  "total_angles": 5,
  "measurements": [
    {
      "name": "Standing Leg (Right Knee)",
      "target_angle": 180.0,
      "tolerance": 5.0,
      "weight": 3.0,
      "points": [...]
    }
  ]
}
```

### Annotated Image (`tree_pose_annotated.jpg`):
- Shows all measured angles visually
- Numbered points (1, 2, 3)
- Colored lines connecting points
- Angle arcs and degree values
- Use this to verify measurements!

---

## 💡 Pro Tips

### 1. **Using Auto-Append Feature**
- **Saves time:** No more manual copying/pasting into `pose_angles.py`
- **Reduces errors:** Automatically formats the configuration correctly
- **Easy updates:** If a pose already exists, you'll be asked if you want to overwrite it
- **Review before committing:** Always check the generated configuration and update keypoint names

### 2. **Measure from Good Reference Images**
- Clear, well-lit photos
- Full body visible
- Correct pose form
- Front or side view (not diagonal)

### 2. **Be Consistent**
- Measure the same angles for front and side views
- Use similar tolerance values for similar joints
- Higher weights for critical pose-defining angles

### 3. **Common Angles to Measure**

**Standing Poses:**
- Knee angles (bent vs straight legs)
- Hip angles (body position)
- Shoulder alignment
- Arm positions

**Balance Poses:**
- Standing leg (should be straight: 180°)
- Bent leg angle
- Hip alignment
- Torso position

**Floor Poses:**
- Hip flexion
- Knee bends
- Arm extensions
- Body alignment

### 4. **Test Your Measurements**
After adding to `pose_angles.py`:
1. Restart your server
2. Test the pose in the web app
3. Verify accuracy calculations make sense
4. Adjust tolerance/weights if needed

---

## 🚀 Quick Workflow Example

Here's a complete workflow from start to finish:

```powershell
# 1. Run the tool
python scripts/angle_measurement_tool.py "data/reference_poses/images/Warrior_I__front/warrior.jpg"

# 2. Measure all angles by clicking 3 points for each
#    - Front leg knee: hip → knee → ankle
#    - Back leg knee: hip → knee → ankle  
#    - Arms: shoulder → elbow → wrist
#    - etc.

# 3. Press 's' to save

# 4. Answer the prompts:
#    Do you want to add this pose configuration to pose_angles.py? y
#    Enter pose ID: Warrior_I_front
#    Enter view: front
#    Enter display name: Warrior I
#    Required keypoints: [press Enter for defaults]

# 5. Open pose_angles.py and update placeholder names:
#    points=("point1_name", "vertex_name", "point2_name")
#    becomes
#    points=("right_hip", "right_knee", "right_ankle")

# 6. Restart server and test!
```

The tool now does 90% of the work - you just update the keypoint names!

---

## 🔧 Troubleshooting

### Image Won't Load
- Check file path is correct
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Try using absolute path

### Window Too Small/Large
- Tool auto-resizes images > 1200px
- You can manually resize the window

### Points Not Registering
- Make sure to left-click directly on the image
- Window must have focus

### Wrong Angle Calculated
- Press 'r' to reset before clicking the 3rd point
- Make sure vertex (middle point) is the actual joint

---

## 📞 Need Help?

If you run into issues:
1. Check the annotated image to verify measurements
2. Review the JSON file for accuracy
3. Test one angle at a time in your app
4. Adjust tolerance if users struggle to match exactly

---

## 🎯 Next Steps

1. Measure angles for all your yoga poses
2. Update `app/config/pose_angles.py` with the measurements
3. Restart your backend server
4. Test in the web app!

Happy measuring! 📐🧘‍♀️
