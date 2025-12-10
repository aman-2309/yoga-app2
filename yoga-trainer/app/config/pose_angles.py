"""
Manual angle definitions for each yoga pose.
Each pose specifies which joint angles to measure and their target values.
"""

from typing import Dict, List, Tuple, Optional
from pydantic import BaseModel, Field


class AngleDefinition(BaseModel):
    """Definition of a joint angle to measure"""
    name: str = Field(..., description="Name of the angle (e.g., 'left_elbow')")
    points: Tuple[str, str, str] = Field(..., description="(point1, vertex, point2) landmark names")
    target_angle: float = Field(..., description="Expected angle in degrees")
    tolerance: float = Field(default=15.0, description="Acceptable deviation in degrees")
    weight: float = Field(default=1.0, description="Importance weight (higher = more important)")


class ConnectionDefinition(BaseModel):
    """Definition of a body part connection to check (e.g., hand holds foot)"""
    name: str = Field(..., description="Name of the connection (e.g., 'Left hand holds right foot')")
    point1: str = Field(..., description="First keypoint (e.g., 'left_wrist')")
    point2: str = Field(..., description="Second keypoint (e.g., 'right_ankle')")
    max_distance: float = Field(default=0.1, description="Maximum normalized distance to be considered 'connected'")
    weight: float = Field(default=1.0, description="Importance weight")


class PoseAngleConfig(BaseModel):
    """Angle configuration for a specific pose"""
    pose_name: str = Field(..., description="Base name of the pose")
    view: str = Field(..., description="Camera view: 'front' or 'side'")
    required_angles: List[AngleDefinition] = Field(..., description="List of angles to measure")
    required_keypoints: List[str] = Field(..., description="Only these keypoints will be checked")
    required_connections: Optional[List[ConnectionDefinition]] = Field(default=None, description="Body part connections to check (e.g., hand holds foot)")


# Define angles for each pose
POSE_ANGLE_DEFINITIONS: Dict[str, PoseAngleConfig] = {
    
    # Tree Pose (Front View)
    "Akarna_Dhanurasana_front": PoseAngleConfig(
        pose_name="Akarna_Dhanurasana_",
        view="front",
        required_keypoints=[
            "nose", "left_shoulder", "right_shoulder",
            "left_elbow", "right_elbow",
            "left_wrist", "right_wrist",
            "left_hip", "right_hip",
            "left_knee", "right_knee",
            "left_ankle", "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="Left hand holds right foot",
                point1="left_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="Right hand holds left foot",
                point1="right_wrist",
                point2="left_ankle",
                max_distance=0.35,
                weight=2.0
            )
        ],
        required_angles=[
            AngleDefinition(
                name="Standing Leg (Right Knee)",
                points=("right_hip", "right_knee", "right_ankle"),
                target_angle=56.2,  # Straight standing leg
                tolerance=25.0,
                weight=5.0  # Most critical
            ),
            AngleDefinition(
                name="right hand",
                points=("right_shoulder", "right_elbow", "right_wrist"),
                target_angle=173.9,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left hand",
                points=("left_shoulder", "left_elbow", "left_wrist"),  # TODO: Update with actual keypoint names
                target_angle=39.3,
                tolerance=25.0,
                weight=2.0
            ),
          
        ]
    ),

     "Boat_Pose_or_Paripurna_Navasana__front": PoseAngleConfig(
        pose_name="Boat_Pose_or_Paripurna_Navasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=("left_shoulder", "left_elbow", "left_wrist"),
                target_angle=175.8,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left leg",
                points=("left_hip", "left_knee", "left_ankle"),
                target_angle=179.7,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=("right_hip", "right_knee", "right_ankle"),
                target_angle=179.8,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right hand",
                points=("right_shoulder", "right_elbow", "right_wrist"),
                target_angle=169.2,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left hip",
                points=("left_hip", "left_knee", "left_ankle"),
                target_angle=83.5,
                tolerance=25.0,
                weight=5.0
            ),
        ]
    ),





    # Bound_Angle_Pose_or_Baddha_Konasana__image_179 (Front View)
    "Bound_Angle_Pose_or_Baddha_Konasana__front": PoseAngleConfig(
        pose_name="Bound_Angle_Pose_or_Baddha_Konasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="Left hand holds right foot",
                point1="left_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="Right hand holds left foot",
                point1="right_wrist",
                point2="left_ankle",
                max_distance=0.35,
                weight=2.0
            )
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=("right_shoulder", "right_elbow", "right_wrist"),
                target_angle=175.4,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left hand",
                points=("left_shoulder", "left_elbow", "left_wrist"),
                target_angle=178.4,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=("right_hip", "right_knee", "right_ankle"),
                target_angle=16.9,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=("left_hip", "left_knee", "left_ankle"),
                target_angle=13.2,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Bow_Pose_or_Dhanurasana__ (Side View)
    "Bow_Pose_or_Dhanurasana__side": PoseAngleConfig(
        pose_name="Bow_Pose_or_Dhanurasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
          required_connections=[
            ConnectionDefinition(
                name="Left hand holds left foot",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="Right hand holds right foot",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,
                weight=2.0
            )
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=169.9,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=168.1,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=85.7,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=95.4,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Bridge_Pose_or_Setu_Bandha_Sarvangasana__ (Side View)
    "Bridge_Pose_or_Setu_Bandha_Sarvangasana__front": PoseAngleConfig(
        pose_name="Bridge_Pose_or_Setu_Bandha_Sarvangasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="Left hand holds left foot",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="Right hand holds right foot",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,
                weight=2.0
            )
        ],
        required_angles=[
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=63.5,
                tolerance=20.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=61.1,
                tolerance=20.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=177.8,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.0,
                tolerance=20.0,
                weight=2.0
            ),
        ]
    ),

    # Camel_Pose_or_Ustrasana__ (Side View)
    "Camel_Pose_or_Ustrasana__side": PoseAngleConfig(
        pose_name="Camel_Pose_or_Ustrasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
                required_connections=[
            ConnectionDefinition(
                name="Left hand holds left foot",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="Right hand holds right foot",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,
                weight=2.0
            )
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=171.7,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=169.4,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=93.2,
                tolerance=20.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=88.0,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Cat_Cow_Pose_or_Marjaryasana__ (Side View)
    "Cat_Cow_Pose_or_Marjaryasana__side": PoseAngleConfig(
        pose_name="Cat_Cow_Pose_or_Marjaryasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=179.8,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=179.0,
                tolerance=20.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=105.4,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=103.1,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="shoulder",
                points=("point1_name", "vertex_name", "point2_name"),  # TODO: Update with actual keypoint names
                target_angle=98.9,
                tolerance=30.0,
                weight=3.0
            ),
        ]
    ),

    # Chair_Pose_or_Utkatasana__ (Side View)
    "Chair_Pose_or_Utkatasana__side": PoseAngleConfig(
        pose_name="Chair_Pose_or_Utkatasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=90.5,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(   
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=92.8,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=177.0,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right hand",
                points=("left_shoulder", "left_elbow", "left_wrist"),  # TODO: Update with actual keypoint names
                target_angle=179.4,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="shoulder",
                points=("point1_name", "vertex_name", "point2_name"),  # TODO: Update with actual keypoint names
                target_angle=70.7,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Child_Pose_or_Balasana__ (Side View)
    "Child_Pose_or_Balasana__side": PoseAngleConfig(
        pose_name="Child_Pose_or_Balasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=165.8,
                tolerance=20.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=172.5,
                tolerance=20.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=40.3,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=29.3,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Cobra_Pose_or_Bhujangasana__ (Side View)
    "Cobra_Pose_or_Bhujangasana__side": PoseAngleConfig(
        pose_name="Cobra_Pose_or_Bhujangasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=171.9,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=167.9,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=174.3,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=176.7,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Cockerel_Pose__ (Front View)
    "Cockerel_Pose_front": PoseAngleConfig(
        pose_name="Cockerel_Pose_",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
         required_connections=[
            ConnectionDefinition(
                name="Left hand holds left foot",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.50,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="Right hand holds right foot",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.50,
                weight=2.0
            )
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=176.1,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=180.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=15.3,
                tolerance=30.0,
                weight=5.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=7.2,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Corpse_Pose_or_Savasana__ (Side View)
    "Corpse_Pose_or_Savasana__side": PoseAngleConfig(
        pose_name="Corpse_Pose_or_Savasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=175.1,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=177.4,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=173.4,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=179.1,
                tolerance=25.0,
                weight=3.0
            ),
        ]
    ),

    # Cow_Face_Pose_or_Gomukhasana__ (Front View)
    "Cow_Face_Pose_or_Gomukhasana__front": PoseAngleConfig(
        pose_name="Cow_Face_Pose_or_Gomukhasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
         required_connections=[
            ConnectionDefinition(
                name="Left hand holds right hand",
                point1="left_wrist",
                point2="right_wrist",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=28.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=20.9,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=110.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=106.5,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Crane_(Crow)_Pose_or_Bakasana__ (Side View)
    "Crane_(Crow)_Pose_or_Bakasana__side": PoseAngleConfig(
        pose_name="Crane_(Crow)_Pose_or_Bakasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=126.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=130.3,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=45.0,
                tolerance=30.0,
                weight=5.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=45.5,
                tolerance=30.0,
                weight=5.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"), 
                target_angle=13.5,
                tolerance=35.0,
                weight=6.0
            ),
        ]
    ),

    # Dolphin_Plank_Pose_or_Makara_Adho_Mukha_Svanasana__ (Side View)
    "Dolphin_Plank_Pose_or_Makara_Adho_Mukha_Svanasana__side": PoseAngleConfig(
        pose_name="Dolphin_Plank_Pose_or_Makara_Adho_Mukha_Svanasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=96.8,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=89.2,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=175.0,
                tolerance=25.0,
                weight=5.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.9,
                tolerance=30.0,
                weight=2.0
            ),
        ]
    ),

    # Dolphin_Pose_or_Ardha_Pincha_Mayurasana__ (Side View)
    "Dolphin_Pose_or_Ardha_Pincha_Mayurasana__side": PoseAngleConfig(
        pose_name="Dolphin_Pose_or_Ardha_Pincha_Mayurasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=121.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=123.2,
                tolerance=35.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=176.8,
                tolerance=20.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.9,
                tolerance=35.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=71.5,
                tolerance=20.0,
                weight=5.0
            ),
        ]
    ),

    # Downward-Facing_Dog_pose_or_Adho_Mukha_Svanasana__ (Side View)
    "Downward-Facing_Dog_pose_or_Adho_Mukha_Svanasana__side": PoseAngleConfig(
        pose_name="Downward-Facing_Dog_pose_or_Adho_Mukha_Svanasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=167.1,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=167.7,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=177.9,
                tolerance=20.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=170.0,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  
                target_angle=73.6,
                tolerance=20.0,
                weight=5.0
            ),
        ]
    ),

    # Eagle_Pose_or_Garudasana__ (Front View)
    "Eagle_Pose_or_Garudasana__front": PoseAngleConfig(
        pose_name="Eagle_Pose_or_Garudasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=95.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=83.3,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=148.7,
                tolerance=30.0,
                weight=5.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=129.5,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Eight-Angle_Pose_or_Astavakrasana__ (Front View)
    "Eight-Angle_Pose_or_Astavakrasana__front": PoseAngleConfig(
        pose_name="Eight-Angle_Pose_or_Astavakrasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=101.2,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=113.8,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=176.6,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=172.3,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Extended_Puppy_Pose_or_Uttana_Shishosana__ (Side View)
    "Extended_Puppy_Pose_or_Uttana_Shishosana__side": PoseAngleConfig(
        pose_name="Extended_Puppy_Pose_or_Uttana_Shishosana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=164.8,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=159.8,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=78.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=79.4,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("point1_name", "vertex_name", "point2_name"),  # TODO: Update with actual keypoint names
                target_angle=62.3,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Extended_Revolved_Side_Angle_Pose_or_Utthita_Parsvakonasana__ (Front View)
    "Extended_Revolved_Side_Angle_Pose_or_Utthita_Parsvakonasana__front": PoseAngleConfig(
        pose_name="Extended_Revolved_Side_Angle_Pose_or_Utthita_Parsvakonasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=136.5,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=169.4,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=102.7,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=174.9,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Extended_Revolved_Triangle_Pose_or_Utthita_Trikonasana__ (Front View)
    "Extended_Revolved_Triangle_Pose_or_Utthita_Trikonasana__front": PoseAngleConfig(
        pose_name="Extended_Revolved_Triangle_Pose_or_Utthita_Trikonasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
         required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=163.3,
                tolerance=20.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=174.6,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=179.6,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=173.4,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Firefly_Pose_or_Tittibhasana__ (Side View)
    "Firefly_Pose_or_Tittibhasana__side": PoseAngleConfig(
        pose_name="Firefly_Pose_or_Tittibhasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=157.2,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=164.1,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=173.0,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=177.7,
                tolerance=35.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=21.1,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Four-Limbed_Staff_Pose_or_Chaturanga_Dandasana__ (Side View)
    "Four-Limbed_Staff_Pose_or_Chaturanga_Dandasana__side": PoseAngleConfig(
        pose_name="Four-Limbed_Staff_Pose_or_Chaturanga_Dandasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=105.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=97.3,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=175.2,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=172.5,
                tolerance=30.0,
                weight=2.0
            ),
        ]
    ),

    # Frog_Pose_or_Bhekasana_ (Side View)
    "Frog_Pose_or_Bhekasana_side": PoseAngleConfig(
        pose_name="Frog_Pose_or_Bhekasana_",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
             ConnectionDefinition(
                name="left hand holds left leg",
                point1="leftr_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=82.1,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=78.9,
                tolerance=35.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=21.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=22.0,
                tolerance=35.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=131.3,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Garland_Pose_or_Malasana__ (Front View)
    "Garland_Pose_or_Malasana__front": PoseAngleConfig(
        pose_name="Garland_Pose_or_Malasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=66.9,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=66.2,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=35.5,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=38.4,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Gate_Pose_or_Parighasana__ (Front View)
    "Gate_Pose_or_Parighasana__front": PoseAngleConfig(
        pose_name="Gate_Pose_or_Parighasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
          required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_knee",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=172.2,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=169.1,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=164.5,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=62.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=92.0,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Half_Lord_of_the_Fishes_Pose_or_Ardha_Matsyendrasana__ (Front View)
    "Half_Lord_of_the_Fishes_Pose_or_Ardha_Matsyendrasana__front": PoseAngleConfig(
        pose_name="Half_Lord_of_the_Fishes_Pose_or_Ardha_Matsyendrasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=176.6,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=50.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=89.7,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=22.2,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Half_Moon_Pose_or_Ardha_Chandrasana__ (Side View)
    "Half_Moon_Pose_or_Ardha_Chandrasana__side": PoseAngleConfig(
        pose_name="Half_Moon_Pose_or_Ardha_Chandrasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=175.6,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=173.1,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=179.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=174.6,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Handstand_pose_or_Adho_Mukha_Vrksasana__ (Side View)
    "Handstand_pose_or_Adho_Mukha_Vrksasana__side": PoseAngleConfig(
        pose_name="Handstand_pose_or_Adho_Mukha_Vrksasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=172.2,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=175.5,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=177.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=176.5,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=177.7,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Happy_Baby_Pose_or_Ananda_Balasana__ (Side View)
    "Happy_Baby_Pose_or_Ananda_Balasana__side": PoseAngleConfig(
        pose_name="Happy_Baby_Pose_or_Ananda_Balasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="left hand holds left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=178.9,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.3,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=94.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=86.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=19.9,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Heron_Pose_or_Krounchasana__ (Side View)
    "Heron_Pose_or_Krounchasana__side": PoseAngleConfig(
        pose_name="Heron_Pose_or_Krounchasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=162.2,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=161.4,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=14.0,
                tolerance=35.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=176.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=110.3,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Intense_Side_Stretch_Pose_or_Parsvottanasana__ (Side View)
    "Intense_Side_Stretch_Pose_or_Parsvottanasana__side": PoseAngleConfig(
        pose_name="Intense_Side_Stretch_Pose_or_Parsvottanasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
            required_connections=[
            ConnectionDefinition(
                name="right hand holds left hand",
                point1="right_wrist",
                point2="left_wrist",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=107.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=23.2,
                tolerance=30.0,
                weight=1.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=177.7,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=179.7,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("point1_name", "vertex_name", "point2_name"),  # TODO: Update with actual keypoint names
                target_angle=56.8,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Locust_Pose_or_Salabhasana__ (Side View)
    "Locust_Pose_or_Salabhasana__side": PoseAngleConfig(
        pose_name="Locust_Pose_or_Salabhasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="right hand holds left hand",
                point1="right_wrist",
                point2="left_wrist",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="right leg holds left leg",
                point1="right_ankle",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=174.5,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=151.5,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=160.9,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Lord_of_the_Dance_Pose_or_Natarajasana__ (Side View)
    "Lord_of_the_Dance_Pose_or_Natarajasana__side": PoseAngleConfig(
        pose_name="Lord_of_the_Dance_Pose_or_Natarajasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="right hand holds left leg",
                point1="right_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="left hand holds left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=109.8,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=125.2,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=175.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=85.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=100.7,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Low_Lunge_pose_or_Anjaneyasana__ (Side View)
    "Low_Lunge_pose_or_Anjaneyasana__side": PoseAngleConfig(
        pose_name="Low_Lunge_pose_or_Anjaneyasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
          required_connections=[
            ConnectionDefinition(
                name="right hand holds left hand",
                point1="right_wrist",
                point2="left_wrist",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=160.1,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=168.5,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=130.5,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=80.5,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Peacock_Pose_or_Mayurasana__ (Front View)
    "Peacock_Pose_or_Mayurasana__front": PoseAngleConfig(
        pose_name="Peacock_Pose_or_Mayurasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=81.8,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=90.7,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=169.2,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=159.2,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Pigeon_Pose_or_Kapotasana__ (Side View)
    "Pigeon_Pose_or_Kapotasana__side": PoseAngleConfig(
        pose_name="Pigeon_Pose_or_Kapotasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="left hand holds left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=156.4,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=140.2,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=110.7,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=104.7,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=92.6,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Plank_Pose_or_Kumbhakasana__ (Side View)
    "Plank_Pose_or_Kumbhakasana__side": PoseAngleConfig(
        pose_name="Plank_Pose_or_Kumbhakasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=170.2,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=172.0,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=170.8,
                tolerance=25.0,
                weight=3.0
            ),
        ]
    ),

    # Plow_Pose_or_Halasana__ (Side View)
    "Plow_Pose_or_Halasana__side": PoseAngleConfig(
        pose_name="Plow_Pose_or_Halasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=171.0,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=179.0,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=173.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=174.4,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=53.8,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Rajakapotasana_ (Side View)
    "Rajakapotasana_side": PoseAngleConfig(
        pose_name="Rajakapotasana_",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="right hand holds left leg",
                point1="right_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="left hand holds left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=70.5,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=60.1,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=179.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=65.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=96.4,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Reclining_Hand-to-Big-Toe_Pose_or_Supta_Padangusthasana__ (Side View)
    "Reclining_Hand-to-Big-Toe_Pose_or_Supta_Padangusthasana__side": PoseAngleConfig(
        pose_name="Reclining_Hand-to-Big-Toe_Pose_or_Supta_Padangusthasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=88.0,
                tolerance=20.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=96.8,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=177.5,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=177.5,
                tolerance=30.0,
                weight=3.0
            ),
        ]
    ),

    # Revolved_Head-to-Knee_Pose_or_Parivrtta_Janu_Sirsasana__ (Front View)
    "Revolved_Head-to-Knee_Pose_or_Parivrtta_Janu_Sirsasana__front": PoseAngleConfig(
        pose_name="Revolved_Head-to-Knee_Pose_or_Parivrtta_Janu_Sirsasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="left hand holds right leg",
                point1="left_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=98.8,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.3,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=177.2,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=38.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=21.4,
                tolerance=40.0,
                weight=4.0
            ),
        ]
    ),

    # Scale_Pose_or_Tolasana__ (Front View)
    "Scale_Pose_or_Tolasana__front": PoseAngleConfig(
        pose_name="Scale_Pose_or_Tolasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
         required_connections=[
            ConnectionDefinition(
                name="left leg near right hip",
                point1="left_anke",
                point2="right_hip",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="right leg near left hip",
                point1="right_ankle",
                point2="left_hip",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=177.2,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=180.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=19.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=23.0,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Scorpion_pose_or_vrischikasana_ (Side View)
    "Scorpion_pose_or_vrischikasana_side": PoseAngleConfig(
        pose_name="Scorpion_pose_or_vrischikasana_",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=90.5,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=93.0,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=77.6,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=83.0,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  
                target_angle=104.4,
                tolerance=35.0,
                weight=5.0
            ),
        ]
    ),

    # Seated_Forward_Bend_pose_or_Paschimottanasana__ (Side View)
    "Seated_Forward_Bend_pose_or_Paschimottanasana__side": PoseAngleConfig(
        pose_name="Seated_Forward_Bend_pose_or_Paschimottanasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
          required_connections=[
            ConnectionDefinition(
                name="left hand hold left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="right hand hold right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=116.9,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=130.6,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=175.2,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.2,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  
                target_angle=45.2,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Shoulder-Pressing_Pose_or_Bhujapidasana__ (Front View)
    "Shoulder-Pressing_Pose_or_Bhujapidasana__front": PoseAngleConfig(
        pose_name="Shoulder-Pressing_Pose_or_Bhujapidasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="left leg near right leg",
                point1="left_ankle",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=159.9,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=168.9,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=17.3,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=18.5,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Side_Crane_(Crow)_Pose_or_Parsva_Bakasana__ (Side View)
    "Side_Crane_(Crow)_Pose_or_Parsva_Bakasana__side": PoseAngleConfig(
        pose_name="Side_Crane_(Crow)_Pose_or_Parsva_Bakasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=131.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=113.1,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=159.4,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=78.7,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Side_Plank_Pose_or_Vasisthasana__ (Side View)
    "Side_Plank_Pose_or_Vasisthasana__side": PoseAngleConfig(
        pose_name="Side_Plank_Pose_or_Vasisthasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=174.2,
                tolerance=20.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=172.8,
                tolerance=20.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=179.1,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.1,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Side-Reclining_Leg_Lift_pose_or_Anantasana__ (Side View)
    "Side-Reclining_Leg_Lift_pose_or_Anantasana__side": PoseAngleConfig(
        pose_name="Side-Reclining_Leg_Lift_pose_or_Anantasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
          required_connections=[
            ConnectionDefinition(
                name="left hand holds left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=36.9,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.1,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=179.3,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=179.7,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Split pose_ (Front View)
    "Split pose_front": PoseAngleConfig(
        pose_name="Split pose_",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="left hand holds right hand",
                point1="left_wrist",
                point2="right_wrsit",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=179.6,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=166.8,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=149.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.2,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="leg spacing",
                points=("right_knee", "right_hip", "left_knee"), 
                target_angle=170.5,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Staff_Pose_or_Dandasana__ (Side View)
    "Staff_Pose_or_Dandasana__side": PoseAngleConfig(
        pose_name="Staff_Pose_or_Dandasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=176.5,
                tolerance=20.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=179.7,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=176.9,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=177.1,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  
                target_angle=103.4,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Standing_big_toe_hold_pose_or_Utthita_Padangusthasana_ (Front View)
    "Standing_big_toe_hold_pose_or_Utthita_Padangusthasana_front": PoseAngleConfig(
        pose_name="Standing_big_toe_hold_pose_or_Utthita_Padangusthasana_",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
          required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=169.9,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=104.1,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=176.3,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.9,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Standing_Forward_Bend_pose_or_Uttanasana__ (Side View)
    "Standing_Forward_Bend_pose_or_Uttanasana__side": PoseAngleConfig(
        pose_name="Standing_Forward_Bend_pose_or_Uttanasana__",
        view="side",
        required_keypoints=[  
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="left hand holds left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=164.8,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=166.8,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=166.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=169.4,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),
                target_angle=36.1,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Standing_Split_pose_or_Urdhva_Prasarita_Eka_Padasana__ (Side View)
    "Standing_Split_pose_or_Urdhva_Prasarita_Eka_Padasana__side": PoseAngleConfig(
        pose_name="Standing_Split_pose_or_Urdhva_Prasarita_Eka_Padasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=163.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=144.9,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=177.0,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=169.7,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("left_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=55.7,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Supported_Headstand_pose_or_Salamba_Sirsasana__ (Side View)
    "Supported_Headstand_pose_or_Salamba_Sirsasana__side": PoseAngleConfig(
        pose_name="Supported_Headstand_pose_or_Salamba_Sirsasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=65.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=70.0,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=178.6,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=176.6,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Supported_Shoulderstand_pose_or_Salamba_Sarvangasana__ (Side View)
    "Supported_Shoulderstand_pose_or_Salamba_Sarvangasana__side": PoseAngleConfig(
        pose_name="Supported_Shoulderstand_pose_or_Salamba_Sarvangasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=79.5,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=76.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=176.3,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=176.4,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  
                target_angle=133.8,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Supta_Baddha_Konasana__ (Side View)
    "Supta_Baddha_Konasana__side": PoseAngleConfig(
        pose_name="Supta_Baddha_Konasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=152.1,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=158.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=34.2,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=36.9,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Supta_Virasana_Vajrasana_ (Side View)
    "Supta_Virasana_Vajrasana_side": PoseAngleConfig(
        pose_name="Supta_Virasana_Vajrasana_",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=171.5,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=168.0,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=20.1,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=23.6,
                tolerance=30.0,
                weight=3.0
            ),
        ]
    ),

    # Tree_Pose_or_Vrksasana__ (Front View)
    "Tree_Pose_or_Vrksasana__front": PoseAngleConfig(
        pose_name="Tree_Pose_or_Vrksasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=176.8,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=178.8,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=29.1,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.1,
                tolerance=25.0,
                weight=4.0
            ),
        ]
    ),

    # Upward_Bow_(Wheel)_Pose_or_Urdhva_Dhanurasana__ (Side View)
    "Upward_Bow_(Wheel)_Pose_or_Urdhva_Dhanurasana__side": PoseAngleConfig(
        pose_name="Upward_Bow_(Wheel)_Pose_or_Urdhva_Dhanurasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=153.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=156.1,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=115.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=115.6,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="curve",
                points=("left_shoulder", "left_hip", "left_knee"),  # TODO: Update with actual keypoint names
                target_angle=128.5,
                tolerance=30.0,
                weight=5.0
            ),
        ]
    ),

    # Upward_Facing_Two-Foot_Staff_Pose_or_Dwi_Pada_Viparita_Dandasana__ (Side View)
    "Upward_Facing_Two-Foot_Staff_Pose_or_Dwi_Pada_Viparita_Dandasana__side": PoseAngleConfig(
        pose_name="Upward_Facing_Two-Foot_Staff_Pose_or_Dwi_Pada_Viparita_Dandasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
         required_connections=[
            ConnectionDefinition(
                name="right hand holds left hand ",
                point1="right_wrist",
                point2="left_wrist",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
           
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=42.1,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=42.7,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=95.2,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=86.8,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=134.2,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Upward_Plank_Pose_or_Purvottanasana__ (Side View)
    "Upward_Plank_Pose_or_Purvottanasana__side": PoseAngleConfig(
        pose_name="Upward_Plank_Pose_or_Purvottanasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=172.4,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=173.2,
                tolerance=30.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=177.1,
                tolerance=25.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=179.5,
                tolerance=30.0,
                weight=3.0
            ),
        ]
    ),

    # viparita_virabhadrasana_or_reverse_warrior_pose_ (Front View)
    "viparita_virabhadrasana_or_reverse_warrior_pose_front": PoseAngleConfig(
        pose_name="viparita_virabhadrasana_or_reverse_warrior_pose_",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=150.5,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=173.1,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=103.3,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=168.0,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=122.7,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Warrior_I_Pose_or_Virabhadrasana_I__ (Side View)
    "Warrior_I_Pose_or_Virabhadrasana_I__side": PoseAngleConfig(
        pose_name="Warrior_I_Pose_or_Virabhadrasana_I__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=166.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=167.0,
                tolerance=25.0,
                weight=2.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=166.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=97.8,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=134.4,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Warrior_II_Pose_or_Virabhadrasana_II__ (Side View)
    "Warrior_II_Pose_or_Virabhadrasana_II__side": PoseAngleConfig(
        pose_name="Warrior_II_Pose_or_Virabhadrasana_II__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=172.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.3,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=120.7,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=173.7,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=108.1,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Warrior_III_Pose_or_Virabhadrasana_III__ (Side View)
    "Warrior_III_Pose_or_Virabhadrasana_III__side": PoseAngleConfig(
        pose_name="Warrior_III_Pose_or_Virabhadrasana_III__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
         required_connections=[
            ConnectionDefinition(
                name="right hand holds left hand ",
                point1="right_wrist",
                point2="left_wrist",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=155.5,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=159.9,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=170.9,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=172.5,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("left_shoulder", "right_hip", "right_knee"),  # TODO: Update with actual keypoint names
                target_angle=104.1,
                tolerance=30.0,
                weight=3.0
            ),
        ]
    ),

    # Wide-Angle_Seated_Forward_Bend_pose_or_Upavistha_Konasana__ (Front View)
    "Wide-Angle_Seated_Forward_Bend_pose_or_Upavistha_Konasana__front": PoseAngleConfig(
        pose_name="Wide-Angle_Seated_Forward_Bend_pose_or_Upavistha_Konasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
          required_connections=[
            ConnectionDefinition(
                name="right hand holds right leg",
                point1="right_wrist",
                point2="right_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
            ConnectionDefinition(
                name="left hand holds left leg",
                point1="left_wrist",
                point2="left_ankle",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=175.5,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=171.2,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=176.2,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=179.7,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Wide-Legged_Forward_Bend_pose_or_Prasarita_Padottanasana__ (Front View)
    "Wide-Legged_Forward_Bend_pose_or_Prasarita_Padottanasana__front": PoseAngleConfig(
        pose_name="Wide-Legged_Forward_Bend_pose_or_Prasarita_Padottanasana__",
        view="front",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=90.7,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=82.4,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=171.7,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=176.6,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="curve",
                points=("right_shoulder", "right_hip", "right_knee"),  
                target_angle=32.6,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Wild_Thing_pose_or_Camatkarasana__ (Side View)
    "Wild_Thing_pose_or_Camatkarasana__side": PoseAngleConfig(
        pose_name="Wild_Thing_pose_or_Camatkarasana__",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=176.5,
                tolerance=25.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=160.7,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=178.3,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=102.3,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="curve",
                points=("left_shoulder", "left_hip", "left_knee"),  # TODO: Update with actual keypoint names
                target_angle=130.6,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

    # Wind_Relieving_pose_or_Pawanmuktasana_ (Side View)
    "Wind_Relieving_pose_or_Pawanmuktasana_side": PoseAngleConfig(
        pose_name="Wind_Relieving_pose_or_Pawanmuktasana_",
        view="side",
        required_keypoints=[
            "nose",
            "left_shoulder",
            "right_shoulder",
            "left_elbow",
            "right_elbow",
            "left_wrist",
            "right_wrist",
            "left_hip",
            "right_hip",
            "left_knee",
            "right_knee",
            "left_ankle",
            "right_ankle"
        ],
         required_connections=[
            ConnectionDefinition(
                name="right hand holds left hand",
                point1="right_wrist",
                point2="left_wrist",
                max_distance=0.35,  # 15% of normalized space
                weight=2.0
            ),
        ],
        required_angles=[
            AngleDefinition(
                name="left hand",
                points=('left_shoulder', 'left_elbow', 'left_wrist'),
                target_angle=73.4,
                tolerance=30.0,
                weight=3.0
            ),
            AngleDefinition(
                name="right hand",
                points=('right_shoulder', 'right_elbow', 'right_wrist'),
                target_angle=82.4,
                tolerance=35.0,
                weight=2.0
            ),
            AngleDefinition(
                name="left leg",
                points=('left_hip', 'left_knee', 'left_ankle'),
                target_angle=27.6,
                tolerance=30.0,
                weight=4.0
            ),
            AngleDefinition(
                name="right leg",
                points=('right_hip', 'right_knee', 'right_ankle'),
                target_angle=178.2,
                tolerance=30.0,
                weight=4.0
            ),
        ]
    ),

}


def get_pose_config(pose_id: str) -> PoseAngleConfig:
    
    
    return POSE_ANGLE_DEFINITIONS[pose_id]


def list_configured_poses() -> List[str]:
    """List all poses that have angle configurations"""
    return sorted(list(POSE_ANGLE_DEFINITIONS.keys()))


def has_config(pose_id: str) -> bool:
    """Check if a pose has manual angle configuration"""
    return pose_id in POSE_ANGLE_DEFINITIONS
