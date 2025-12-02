# Frontend-Backend API Integration Guide

## Overview

This document describes the integration of the yoga-trainer backend APIs with the React frontend.

## API Services Created

### 1. Core API Client (`src/services/api.js`)

- Centralized axios configuration
- Base URL: `http://localhost:8000/api/v1` (configurable via `.env`)
- Global error handling and response interceptors
- 30-second timeout for all requests

### 2. Pose Detection Service (`src/services/poseDetection.js`)

**Functions:**

- `detectPose(base64Image)` - Detect pose from base64 image
- `canvasToBase64(canvas)` - Convert canvas to base64
- `videoFrameToBase64(videoElement)` - Capture video frame as base64

**Backend Endpoint:** `POST /api/v1/pose-detection/detect-pose`

### 3. Accuracy Service (`src/services/accuracy.js`)

**Functions:**

- `calculateAccuracy(userKeypoints, referencePoseId)` - Calculate accuracy using reference comparison
- `calculateManualAccuracy(userKeypoints, poseId, usePositionMatching)` - Calculate accuracy using manual angle-based method
- `getConfiguredPoses()` - Get list of poses configured for manual accuracy

**Backend Endpoints:**

- `POST /api/v1/accuracy/calculate-accuracy`
- `POST /api/v1/manual-accuracy/calculate`
- `GET /api/v1/manual-accuracy/poses`

### 4. Reference Poses Service (`src/services/reference.js`)

**Functions:**

- `listReferencePoses()` - Get all available reference poses
- `getReferencePose(poseId)` - Get detailed info about a specific pose
- `uploadReferencePose(poseId, base64Image, options)` - Upload new reference pose

**Backend Endpoints:**

- `GET /api/v1/reference/poses`
- `GET /api/v1/reference/poses/{poseId}`
- `POST /api/v1/reference/upload`

## Component Integration

### Camera Component (`src/Camera.js`)

**Features Integrated:**

1. **Pose Selection Dropdown**

   - Fetches available poses from backend on mount
   - Dynamically populates dropdown with pose names and views
   - Loads reference image when pose is selected

2. **Real-time Pose Detection**

   - Captures video frames every 1 second when camera is on
   - Sends frames to backend for pose detection
   - Draws detected keypoints on canvas overlay
   - Calculates accuracy against selected reference pose
   - Updates accuracy display in real-time

3. **Reference Image Display**
   - Shows reference pose image from backend
   - Updates when different pose is selected

**Props:**

- `open` - Boolean to control camera modal visibility
- `selectedPoseId` - Initial pose ID to select (optional)

### EachExercise Component (`src/EachExercise.js`)

**Integration:**

- Passes exercise name as `selectedPoseId` to Camera component
- Camera modal opens with pre-selected pose matching the exercise

## Configuration

### Environment Variables

Create a `.env` file in the Frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Running the Application

### 1. Start Backend Server

```bash
cd yoga-trainer
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

### 2. Start Frontend Development Server

```bash
cd Frontend
npm install
npm start
```

Frontend will be available at: `http://localhost:1234` (Parcel default)

## Features

### Real-time Pose Accuracy Checking

1. Navigate to any yoga exercise page
2. Click the camera button (📷) at the bottom
3. Select a pose from the dropdown
4. Click "Start Camera" to begin
5. Position yourself in front of the camera
6. Watch real-time accuracy score and keypoint overlay
7. Adjust your pose based on the reference image

### Pose Detection Flow

```
Video Frame → Base64 Encoding → Backend API → Pose Detection →
Keypoints → Accuracy Calculation → Display Results
```

## API Response Examples

### Pose Detection Response

```json
{
  "success": true,
  "message": "Pose detected successfully with 95.00% confidence",
  "pose": {
    "keypoints": [
      {
        "name": "nose",
        "x": 0.5,
        "y": 0.3,
        "z": 0.0,
        "visibility": 0.95
      }
      // ... more keypoints
    ],
    "confidence": 0.95
  },
  "error": null
}
```

### Accuracy Calculation Response

```json
{
  "success": true,
  "message": "Accuracy calculated successfully",
  "overall_accuracy": 87.5,
  "angle_accuracy": 85.0,
  "position_accuracy": 90.0,
  "feedback": {
    "left_elbow": {
      "target": 90,
      "actual": 95,
      "difference": 5,
      "feedback": "Slightly bend your left elbow more"
    }
  }
}
```

## Error Handling

All API calls include comprehensive error handling:

- Network errors - Alerts user to check connection and backend server
- Server errors - Displays error message from backend
- Timeout errors - 30-second timeout with clear error message

## Design Preservation

All integrations maintain the existing frontend design:

- ✅ No changes to styling or CSS classes
- ✅ Animations and transitions preserved
- ✅ Modal behavior unchanged
- ✅ Responsive design maintained
- ✅ Dark mode support intact

## Dependencies Added

```json
{
  "axios": "^1.6.2"
}
```

## Troubleshooting

### Backend Not Responding

1. Ensure backend server is running on port 8000
2. Check CORS settings in backend (`app/config/settings.py`)
3. Verify `.env` file has correct API URL

### Pose Not Detected

1. Ensure good lighting conditions
2. Keep full body visible in camera frame
3. Check backend has reference poses in `data/reference_poses/keypoints/`

### Accuracy Not Calculating

1. Verify pose is selected from dropdown
2. Ensure reference pose exists in backend
3. Check browser console for API errors

## Next Steps

To add more poses:

1. Add reference images to `yoga-trainer/data/reference_poses/images/`
2. Run `python scripts/process_reference_images.py` to generate keypoints
3. Poses will automatically appear in frontend dropdown

## Support

For issues or questions:

1. Check browser console for JavaScript errors
2. Check backend logs for API errors
3. Verify all services are running correctly
