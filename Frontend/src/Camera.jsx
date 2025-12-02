import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { detectPose, videoFrameToBase64 } from "./services/poseDetection";
import { calculateManualAccuracy } from "./services/accuracy";
import { listReferencePoses, getReferencePose } from "./services/reference";
import exercises from "../yogaExercises.json";
import {
  calculateAngle,
  calculateAngleScore,
  getColorForScore,
  keypointsToDict,
  isKeypointVisible,
} from "./utils/accuracyCalculator";

const Camera = forwardRef(function Camera(
  { open, selectedPoseId, onPoseChange },
  ref
) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [poses, setPoses] = useState([]);
  const [selectedPose, setSelectedPose] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [angleFeedback, setAngleFeedback] = useState([]);
  const [generalFeedback, setGeneralFeedback] = useState("");

  // Refs for continuous loop
  const animationFrameRef = useRef(null);
  const lastAccuracyCheckTime = useRef(0);
  const isProcessingRef = useRef(false);
  const currentPoseRef = useRef(null);
  const smoothedKeypointsRef = useRef(null);
  const smoothedAccuracyRef = useRef(null);
  const lastAccuracyDataRef = useRef(null);

  // Constants matching original
  const ACCURACY_CHECK_INTERVAL = 500; // 500ms between API calls
  const SMOOTHING_FACTOR = 0.3; // Lower = more smoothing
  const MIN_CONFIDENCE_THRESHOLD = 0.5;

  // Load available poses on mount
  useEffect(() => {
    loadReferencePoses();
  }, []);

  // Auto-select pose when selectedPoseId changes and poses are loaded
  useEffect(() => {
    if (selectedPoseId && poses.length > 0) {
      console.log("Camera: Attempting to match pose:", selectedPoseId);

      let matchingPose = null;

      // Strategy 1: Try bName first (direct match with pose_id)
      matchingPose = poses.find((p) => {
        const poseId = (p.pose_id || "").toLowerCase();
        return poseId.startsWith(selectedPoseId.toLowerCase());
      });

      if (matchingPose) {
        console.log("✅ Camera: Matched via bName:", matchingPose.pose_id);
      }

      // Strategy 2: Fallback to exercise name matching if bName doesn't work
      if (!matchingPose) {
        // Find the exercise that has this bName to get its name
        const exercise = exercises.find((ex) => ex.bName === selectedPoseId);

        if (exercise) {
          const searchName = exercise.name.toLowerCase();
          console.log(
            "⚠️ Camera: bName failed, trying exercise.name:",
            exercise.name
          );

          matchingPose = poses.find((p) => {
            const poseName = (p.name || "").toLowerCase();
            const baseName = (p.base_pose_name || "").toLowerCase();
            const poseId = (p.pose_id || "").toLowerCase();

            // Remove common words and punctuation for better matching
            const cleanSearch = searchName
              .replace(/\s+or\s+/gi, " ")
              .replace(/[()]/g, "")
              .trim();
            const cleanPoseName = poseName
              .replace(/\s+or\s+/gi, " ")
              .replace(/[()]/g, "")
              .trim();

            return (
              cleanPoseName.includes(cleanSearch) ||
              cleanSearch.includes(cleanPoseName) ||
              baseName.includes(cleanSearch) ||
              poseId.includes(searchName.replace(/\s+/g, "_"))
            );
          });

          if (matchingPose) {
            console.log(
              "✅ Camera: Matched via exercise.name:",
              matchingPose.pose_id
            );
          }
        }
      }

      if (matchingPose) {
        setSelectedPose(matchingPose.pose_id);
        loadReferenceImage(matchingPose.pose_id);
      } else {
        console.log("❌ Camera: No matching pose found for:", selectedPoseId);
      }
    }
  }, [selectedPoseId, poses]);

  // Start/restart continuous loop when camera is on and pose is selected
  useEffect(() => {
    if (isCameraOn && selectedPose) {
      // Start continuous loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(checkPoseContinuously);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isCameraOn, selectedPose]);

  // Load reference poses from backend
  const loadReferencePoses = async () => {
    try {
      const response = await listReferencePoses();
      if (response.success && response.poses) {
        setPoses(response.poses);
      }
    } catch (error) {
      console.error("Failed to load reference poses:", error);
    }
  };

  // Load reference image
  const loadReferenceImage = async (poseId) => {
    if (!poseId) {
      setReferenceImage(null);
      return;
    }

    try {
      console.log("Loading reference image for pose:", poseId);
      const response = await getReferencePose(poseId);
      console.log("Reference pose response:", response);

      if (response.success && response.pose) {
        // Backend returns 'thumbnail' which already includes data:image prefix
        const imageData = response.pose.thumbnail;
        if (imageData) {
          setReferenceImage(imageData);
          console.log("Reference image loaded successfully");
        } else {
          console.log("No thumbnail found in pose data");
        }
      }
    } catch (error) {
      console.error("Failed to load reference pose:", error);
    }
  };

  // Handle pose selection
  const handlePoseChange = async (e) => {
    const poseId = e.target.value;
    setSelectedPose(poseId);
    loadReferenceImage(poseId);

    // Notify parent about pose change
    if (onPoseChange) {
      console.log("🔄 Camera: Dropdown changed to poseId:", poseId);

      // Strategy 1: Try matching by bName first (fastest and most accurate)
      let matchingExercise = exercises.find((ex) => {
        if (!ex.bName) return false;
        const bNameLower = ex.bName.toLowerCase();
        const poseIdLower = poseId.toLowerCase();
        // Remove view suffixes for comparison
        const cleanBName = bNameLower
          .replace(/__front$/i, "")
          .replace(/__side$/i, "")
          .replace(/_front$/i, "")
          .replace(/_side$/i, "");
        const cleanPoseId = poseIdLower
          .replace(/__front$/i, "")
          .replace(/__side$/i, "")
          .replace(/_front$/i, "")
          .replace(/_side$/i, "");

        return cleanBName === cleanPoseId || poseIdLower.startsWith(bNameLower);
      });

      // Strategy 2: Fallback to name-based matching
      if (!matchingExercise) {
        const selectedPoseData = poses.find((p) => p.pose_id === poseId);
        if (selectedPoseData) {
          matchingExercise = exercises.find((ex) => {
            const exName = ex.name.toLowerCase();
            const poseName = (selectedPoseData.name || "").toLowerCase();
            const baseName = (
              selectedPoseData.base_pose_name || ""
            ).toLowerCase();

            const cleanEx = exName
              .replace(/\s+or\s+/gi, " ")
              .replace(/[()]/g, "")
              .trim();
            const cleanPoseName = poseName
              .replace(/\s+or\s+/gi, " ")
              .replace(/[()]/g, "")
              .trim();

            return (
              cleanPoseName === cleanEx ||
              baseName === exName ||
              poseId
                .toLowerCase()
                .startsWith(exName.replace(/\s+/g, "_").toLowerCase())
            );
          });
        }
      }

      if (matchingExercise) {
        console.log(
          "✅ Camera: Matched exercise:",
          matchingExercise.name,
          "ID:",
          matchingExercise.id
        );
        onPoseChange(matchingExercise.id, matchingExercise.name, poseId);
      } else {
        console.log(
          "❌ Camera: No matching exercise found for poseId:",
          poseId
        );
      }
    }

    // Reset smoothing when pose changes
    smoothedKeypointsRef.current = null;
    smoothedAccuracyRef.current = null;
    currentPoseRef.current = null;
    lastAccuracyDataRef.current = null;
  };

  // Smooth keypoints to reduce jitter
  const smoothKeypoints = (newKeypoints, oldKeypoints) => {
    if (!oldKeypoints || oldKeypoints.length === 0) {
      return newKeypoints;
    }

    return newKeypoints.map((newKp, index) => {
      const oldKp = oldKeypoints[index];
      if (!oldKp) return newKp;

      return {
        ...newKp,
        x: oldKp.x + (newKp.x - oldKp.x) * SMOOTHING_FACTOR,
        y: oldKp.y + (newKp.y - oldKp.y) * SMOOTHING_FACTOR,
        visibility: Math.max(oldKp.visibility, newKp.visibility),
      };
    });
  };

  // Smooth accuracy score
  const smoothAccuracyScore = (newScore, oldScore) => {
    if (oldScore === null || oldScore === undefined) {
      return newScore;
    }
    return oldScore + (newScore - oldScore) * SMOOTHING_FACTOR;
  };

  // Main continuous loop - runs at 60fps for smooth drawing
  const checkPoseContinuously = () => {
    if (!isCameraOn || !selectedPose || !videoRef.current) {
      return;
    }

    // Always redraw for smooth display
    const keypointsToShow =
      smoothedKeypointsRef.current || currentPoseRef.current?.keypoints;

    if (keypointsToShow && lastAccuracyDataRef.current) {
      // Draw with color coding based on angle scores
      if (lastAccuracyDataRef.current.angle_scores) {
        drawPoseWithAngleColors(
          keypointsToShow,
          lastAccuracyDataRef.current.angle_scores
        );
      } else {
        drawPoseWithSkeleton(keypointsToShow);
      }
    } else if (keypointsToShow) {
      drawPoseWithSkeleton(keypointsToShow);
    }

    const now = Date.now();

    // Throttle API calls to 500ms intervals
    if (
      now - lastAccuracyCheckTime.current >= ACCURACY_CHECK_INTERVAL &&
      !isProcessingRef.current
    ) {
      lastAccuracyCheckTime.current = now;
      detectAndCalculateAccuracy().catch((err) =>
        console.error("Detection error:", err)
      );
    }

    // Schedule next frame at 60fps
    animationFrameRef.current = requestAnimationFrame(checkPoseContinuously);
  };

  // Detect pose and calculate accuracy (called every 500ms)
  const detectAndCalculateAccuracy = async () => {
    if (!videoRef.current || !selectedPose || isProcessingRef.current) {
      return;
    }

    try {
      isProcessingRef.current = true;

      // Capture frame from video
      const base64Image = videoFrameToBase64(videoRef.current);

      // Detect pose
      const poseResponse = await detectPose(base64Image);

      if (!poseResponse.success || !poseResponse.pose) {
        isProcessingRef.current = false;
        return;
      }

      const detectedPose = poseResponse.pose;

      // Only update if confidence is good enough
      if (detectedPose.confidence >= MIN_CONFIDENCE_THRESHOLD) {
        // Smooth keypoints
        smoothedKeypointsRef.current = smoothKeypoints(
          detectedPose.keypoints,
          smoothedKeypointsRef.current
        );

        currentPoseRef.current = {
          keypoints: detectedPose.keypoints,
          confidence: detectedPose.confidence,
        };
      } else {
        isProcessingRef.current = false;
        return;
      }

      // Calculate accuracy
      const accuracyResponse = await calculateManualAccuracy(
        currentPoseRef.current.keypoints,
        selectedPose,
        true
      );

      // Backend returns {success, data: {...}} structure
      const accuracyData = accuracyResponse.data || accuracyResponse;

      if (
        accuracyResponse.success &&
        accuracyData &&
        typeof accuracyData.overall_accuracy === "number"
      ) {
        // Smooth accuracy
        const newAccuracy = accuracyData.overall_accuracy;
        const displayAccuracy = smoothAccuracyScore(
          newAccuracy,
          smoothedAccuracyRef.current
        );
        smoothedAccuracyRef.current = displayAccuracy;

        const accuracyValue = Math.round(displayAccuracy);
        setAccuracy(accuracyValue);

        // Update accuracy display
        const accuracyElement = document.getElementById("overallAccuracy");
        if (accuracyElement) {
          accuracyElement.innerText = accuracyValue;
        }

        // Set feedback from backend response
        if (accuracyData.feedback && Array.isArray(accuracyData.feedback)) {
          setAngleFeedback(accuracyData.feedback);
        }

        // Set general feedback
        if (accuracyData.general_feedback) {
          setGeneralFeedback(accuracyData.general_feedback);
        }

        // Convert angle_scores array to dictionary and store
        if (
          accuracyData.angle_scores &&
          Array.isArray(accuracyData.angle_scores)
        ) {
          const angleScoresDict = {};
          accuracyData.angle_scores.forEach((angleInfo) => {
            if (angleInfo.points && angleInfo.points.length >= 2) {
              const jointName = angleInfo.points[1];
              angleScoresDict[jointName] = angleInfo;
            }
            if (angleInfo.angle_name) {
              angleScoresDict[
                angleInfo.angle_name.toLowerCase().replace(/ /g, "_")
              ] = angleInfo;
            }
          });

          lastAccuracyDataRef.current = {
            angle_scores: angleScoresDict,
          };
        }
      } else {
        // Log only if it's not a "no config" error
        if (
          !accuracyResponse.message ||
          !accuracyResponse.message.includes("No manual angle configuration")
        ) {
          console.log("Accuracy response:", accuracyResponse);
        }
      }
    } catch (error) {
      console.error("Frame processing error:", error);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Process video frame for pose detection (OLD - REMOVED)
  const processFrame = async () => {
    // This function is now replaced by checkPoseContinuously
    // Keeping for compatibility but not used
  };

  // Draw keypoints on canvas
  const drawKeypoints = (keypoints) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Get video dimensions
    const videoWidth = video.videoWidth || video.clientWidth || 720;
    const videoHeight = video.videoHeight || video.clientHeight || 480;

    // Set canvas size to match video display size
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factors
    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    // Draw keypoints
    keypoints.forEach((kp) => {
      if (kp.visibility > 0.5) {
        const x = kp.x * videoWidth * scaleX;
        const y = kp.y * videoHeight * scaleY;

        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#00ff00";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  // Draw skeleton connections
  const drawSkeleton = (
    keypoints,
    ctx,
    scaleX,
    scaleY,
    videoWidth,
    videoHeight,
    color = "#00FF00"
  ) => {
    const namedConnections = [
      // Torso
      ["left_shoulder", "right_shoulder"],
      ["left_shoulder", "left_hip"],
      ["right_shoulder", "right_hip"],
      ["left_hip", "right_hip"],

      // Left arm
      ["left_shoulder", "left_elbow"],
      ["left_elbow", "left_wrist"],

      // Right arm
      ["right_shoulder", "right_elbow"],
      ["right_elbow", "right_wrist"],

      // Left leg
      ["left_hip", "left_knee"],
      ["left_knee", "left_ankle"],

      // Right leg
      ["right_hip", "right_knee"],
      ["right_knee", "right_ankle"],
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    namedConnections.forEach(([startName, endName]) => {
      const start = keypoints.find((kp) => kp.name === startName);
      const end = keypoints.find((kp) => kp.name === endName);

      if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
        const startX = start.x * videoWidth * scaleX;
        const startY = start.y * videoHeight * scaleY;
        const endX = end.x * videoWidth * scaleX;
        const endY = end.y * videoHeight * scaleY;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    });
  };

  // Draw pose with skeleton
  const drawPoseWithSkeleton = (keypoints) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const videoWidth = video.videoWidth || video.clientWidth || 720;
    const videoHeight = video.videoHeight || video.clientHeight || 480;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    // Filter to show only allowed keypoints (13 points)
    const allowedKeypoints = [
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
      "right_ankle",
    ];

    const filteredKeypoints = keypoints.filter((kp) =>
      allowedKeypoints.includes(kp.name)
    );

    // Draw skeleton first
    drawSkeleton(
      filteredKeypoints,
      ctx,
      scaleX,
      scaleY,
      videoWidth,
      videoHeight,
      "#00FF00"
    );

    // Draw keypoints on top
    filteredKeypoints.forEach((kp) => {
      if (kp.visibility > 0.5) {
        const x = kp.x * videoWidth * scaleX;
        const y = kp.y * videoHeight * scaleY;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#00FF00";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  // Draw pose with angle-based colors - MATCHES ORIGINAL
  const drawPoseWithAngleColors = (keypoints, angleScores) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const videoWidth = video.videoWidth || video.clientWidth || 720;
    const videoHeight = video.videoHeight || video.clientHeight || 480;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / videoWidth;
    const scaleY = canvas.height / videoHeight;

    // Only show 13 allowed keypoints
    const allowedKeypoints = [
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
      "right_ankle",
    ];

    const displayKeypoints = keypoints.filter((kp) =>
      allowedKeypoints.includes(kp.name)
    );

    // Create map of keypoint colors based on angle scores
    const keypointColors = {};

    if (angleScores && typeof angleScores === "object") {
      Object.values(angleScores).forEach((angleScore) => {
        if (angleScore.points) {
          angleScore.points.forEach((pointName) => {
            if (
              !keypointColors[pointName] ||
              angleScore.score > (keypointColors[pointName].score || 0)
            ) {
              keypointColors[pointName] = {
                color: angleScore.color,
                score: angleScore.score,
              };
            }
          });
        }
      });
    }

    // Draw colored connections based on angle scores
    if (angleScores && typeof angleScores === "object") {
      Object.values(angleScores).forEach((angleScore) => {
        if (!angleScore.points || angleScore.points.length < 3) return;

        const [point1Name, vertexName, point2Name] = angleScore.points;

        const point1 = keypoints.find((kp) => kp.name === point1Name);
        const vertex = keypoints.find((kp) => kp.name === vertexName);
        const point2 = keypoints.find((kp) => kp.name === point2Name);

        if (
          point1 &&
          vertex &&
          point2 &&
          point1.visibility > 0.5 &&
          vertex.visibility > 0.5 &&
          point2.visibility > 0.5
        ) {
          const lineColor = angleScore.color || "#00FF00";

          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 4;

          // Line 1: point1 to vertex
          ctx.beginPath();
          ctx.moveTo(
            point1.x * videoWidth * scaleX,
            point1.y * videoHeight * scaleY
          );
          ctx.lineTo(
            vertex.x * videoWidth * scaleX,
            vertex.y * videoHeight * scaleY
          );
          ctx.stroke();

          // Line 2: vertex to point2
          ctx.beginPath();
          ctx.moveTo(
            vertex.x * videoWidth * scaleX,
            vertex.y * videoHeight * scaleY
          );
          ctx.lineTo(
            point2.x * videoWidth * scaleX,
            point2.y * videoHeight * scaleY
          );
          ctx.stroke();
        }
      });
    }

    // Draw keypoints with colors
    displayKeypoints.forEach((kp) => {
      if (kp.visibility > 0.5) {
        const x = kp.x * videoWidth * scaleX;
        const y = kp.y * videoHeight * scaleY;

        const color = keypointColors[kp.name]?.color || "#00FF00";

        // Draw outer circle (darker)
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw inner circle (colored)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw angle values at vertices
    if (angleScores && typeof angleScores === "object") {
      Object.values(angleScores).forEach((angleScore) => {
        if (!angleScore.points || angleScore.points.length < 3) return;

        const vertexName = angleScore.points[1];
        const vertex = keypoints.find((kp) => kp.name === vertexName);

        if (vertex && vertex.visibility > 0.5) {
          const x = vertex.x * videoWidth * scaleX;
          const y = vertex.y * videoHeight * scaleY;

          // Draw angle value text
          ctx.fillStyle = angleScore.color || "#00FF00";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.font = "bold 12px Arial";
          const angleText = `${Math.round(angleScore.actual_angle)}°`;
          ctx.strokeText(angleText, x + 20, y - 10);
          ctx.fillText(angleText, x + 20, y - 10);
        }
      });
    }
  }; // START CAMERA
  const startCamera = async () => {
    try {
      // Reset smoothing variables
      smoothedKeypointsRef.current = null;
      smoothedAccuracyRef.current = null;
      currentPoseRef.current = null;
      lastAccuracyDataRef.current = null;
      lastAccuracyCheckTime.current = 0;

      const camStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 720, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = camStream;
        videoRef.current.play();
        setStream(camStream);
        setIsCameraOn(true);

        // Start continuous loop at 60fps
        if (selectedPose) {
          animationFrameRef.current = requestAnimationFrame(
            checkPoseContinuously
          );
        }
      }

      const camStatus = document.getElementById("cameraStatus");
      if (camStatus) camStatus.innerText = "Camera Started";

      const stopBtn = document.getElementById("stopCameraBtn");
      if (stopBtn) {
        stopBtn.disabled = false;
        stopBtn.classList.remove("opacity-50");
        stopBtn.classList.remove("cursor-not-allowed");
      }
    } catch (err) {
      alert("Camera permission denied or unavailable");
      console.error(err);
    }
  };

  // STOP CAMERA
  const stopCamera = () => {
    try {
      // Stop animation frame loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Reset smoothing variables
      smoothedKeypointsRef.current = null;
      smoothedAccuracyRef.current = null;
      currentPoseRef.current = null;
      lastAccuracyDataRef.current = null;
      isProcessingRef.current = false;

      // Stop tracks
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      // Stop and clear video
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }

      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }

      setStream(null);
      setIsCameraOn(false);
      setAccuracy(null);

      // Safe DOM updates (only if element exists)
      const camStatus = document.getElementById("cameraStatus");
      if (camStatus) camStatus.innerText = "Camera Stopped";

      const stopBtn = document.getElementById("stopCameraBtn");
      if (stopBtn) {
        stopBtn.disabled = true;
        stopBtn.classList.add("opacity-50", "cursor-not-allowed");
      }

      const accuracyElement = document.getElementById("overallAccuracy");
      if (accuracyElement) {
        accuracyElement.innerText = "--";
      }
    } catch (err) {
      console.error("StopCamera Error:", err);
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
    isCameraOn,
  }));

  // Auto-stop when modal closes
  useEffect(() => {
    if (!open && isCameraOn) {
      stopCamera();
    }
  }, [open]);

  // CLEANUP on unmount (Safe cleanup)
  useEffect(() => {
    return () => {
      try {
        stopCamera();
      } catch (e) {
        console.warn("Cleanup error ignored:", e);
      }
    };
  }, []);

  return (
    <div className=" rounded-3xl  w-full bg-[#0b0f0e] text-white flex flex-col items-center">
      {/* MAIN CONTAINER */}
      <div className="w-full rounded-3xl  bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-5 pt-0 ">
        {/* HEADER */}
        <header className="text-center mb-0">
          <h1 className="text-3xl font-bold text-green-400">Yoga Accuracy</h1>
          <p className="text-gray-300 text-base mt-1">
            Compare your posture with reference poses.
          </p>
        </header>

        {/* CONTROL PANEL — SUPER COMPACT, NO BG, NO BORDER */}
        <div className="flex items-center justify-center mb-0">
          {/* CONTROL PANEL */}
          <div className="flex flex-col w-full mb-4">
            {/* FULL-WIDTH POSE SELECTOR (thoda niche spacing ke saath) */}
            <select
              value={selectedPose}
              onChange={handlePoseChange}
              className="w-full mt-3 px-3 py-2.5 text-sm rounded-xl bg-black/40 text-white 
        border border-white/30 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:bg-black/50 transition cursor-pointer appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="" className="bg-gray-900 text-gray-300">
                Select Pose
              </option>
              {poses
                .reduce((uniquePoses, pose) => {
                  // Find matching exercise from yogaExercises.json
                  const matchingExercise = exercises.find((ex) => {
                    const exName = ex.name.toLowerCase();
                    const poseName = (pose.name || "").toLowerCase();
                    const baseName = (pose.base_pose_name || "").toLowerCase();
                    const poseId = (pose.pose_id || "").toLowerCase();

                    const cleanEx = exName
                      .replace(/\s+or\s+/gi, " ")
                      .replace(/[()]/g, "")
                      .trim();
                    const cleanPoseName = poseName
                      .replace(/\s+or\s+/gi, " ")
                      .replace(/[()]/g, "")
                      .trim();

                    return (
                      cleanPoseName === cleanEx ||
                      baseName === exName ||
                      poseId.startsWith(
                        exName.replace(/\s+/g, "_").toLowerCase()
                      )
                    );
                  });

                  if (matchingExercise) {
                    // Check if this exercise name is already added
                    const alreadyExists = uniquePoses.some(
                      (p) => p.displayName === matchingExercise.name
                    );

                    if (!alreadyExists) {
                      uniquePoses.push({
                        pose_id: pose.pose_id,
                        displayName: matchingExercise.name,
                      });
                    }
                  } else {
                    // No matching exercise, use backend name
                    const displayName = pose.base_pose_name || pose.pose_id;
                    const alreadyExists = uniquePoses.some(
                      (p) => p.displayName === displayName
                    );

                    if (!alreadyExists) {
                      uniquePoses.push({
                        pose_id: pose.pose_id,
                        displayName: displayName,
                      });
                    }
                  }

                  return uniquePoses;
                }, [])
                .map((poseItem) => (
                  <option
                    key={poseItem.pose_id}
                    value={poseItem.pose_id}
                    className="bg-gray-900 text-white py-2"
                  >
                    {poseItem.displayName}
                  </option>
                ))}
            </select>

            {/* SINGLE TOGGLE BUTTON — LEFT SIDE ALIGN */}
            <button
              onClick={isCameraOn ? stopCamera : startCamera}
              className={`px-4 py-2 rounded-lg text-sm font-semibold w-40
            ${
              isCameraOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            >
              {isCameraOn ? "Stop Camera" : "Start Camera"}
            </button>
          </div>

          {/* Overall Accuracy — compact */}
          <div className="text-center w-full">
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
              {/* Background circle */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 120 120"
              >
                {/* Background track */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="10"
                />
                {/* Animated progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={
                    accuracy >= 80
                      ? "#10b981"
                      : accuracy >= 60
                      ? "#f59e0b"
                      : accuracy >= 40
                      ? "#fb923c"
                      : "#ef4444"
                  }
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="314.159"
                  strokeDashoffset={314.159 - (314.159 * (accuracy || 0)) / 100}
                  style={{
                    transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
                  }}
                />
              </svg>
              {/* Center text */}
              <div className="flex flex-col items-center justify-center z-10">
                <div
                  id="overallAccuracy"
                  className="text-3xl font-bold text-white"
                >
                  {accuracy || "--"}
                </div>
                <div className="text-sm text-gray-300">%</div>
              </div>
            </div>
          </div>
        </div>

        {/* VIDEO + REFERENCE SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* USER CAMERA */}
          <div>
            <h3 className="text-lg text-green-400 font-semibold mb-2">
              Your Pose
            </h3>

            <div className="relative bg-black/40 rounded-xl overflow-hidden border border-white/10 h-60 flex items-center justify-center text-gray-500">
              <video
                ref={videoRef}
                playsInline
                className="absolute inset-0 w-full h-full object-cover bg-black"
              />

              <canvas ref={canvasRef} className="absolute inset-0"></canvas>

              {!isCameraOn && <p className="z-10 text-sm">📷 Camera Off</p>}
            </div>
          </div>

          {/* REFERENCE IMAGE (with bottom next/prev buttons) */}
          <div>
            <h3 className="text-lg text-green-400 font-semibold mb-2">
              Reference
            </h3>

            <div
              className="relative bg-black/20 rounded-xl border border-white/10 h-60 
        flex items-center justify-center overflow-hidden"
            >
              {/* IMAGE */}
              {referenceImage ? (
                <>
                  {/* Blurred background */}
                  <img
                    src={referenceImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-50"
                    aria-hidden="true"
                  />
                  {/* Main image */}
                  <img
                    id="referenceImage"
                    src={referenceImage}
                    alt="Reference Pose"
                    className="relative max-h-full  transition-all duration-300 z-10 object-contain"
                  />
                </>
              ) : (
                <div className="text-gray-400 text-sm text-center px-3">
                  Select a pose to see the reference image
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        {(generalFeedback || angleFeedback.length > 0) && (
          <div className="mt-6">
            {/* General Feedback */}
            {generalFeedback && (
              <div className="mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30">
                <p className="text-green-300 text-center font-medium">
                  {generalFeedback}
                </p>
              </div>
            )}

            {/* Angle-specific Feedback */}
            {/* {angleFeedback.length > 0 && (
                            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                                <h3 className="text-lg text-green-400 font-semibold mb-3">Angle Feedback</h3>
                                <div className="space-y-2">
                                    {angleFeedback.map((feedback, index) => (
                                        <div
                                            key={index}
                                            className="text-sm text-gray-300 bg-white/5 px-3 py-2 rounded"
                                        >
                                            {feedback}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}
          </div>
        )}
      </div>
    </div>
  );
});

export default Camera;
