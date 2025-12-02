# ✅ Integration Verification Checklist

## Pre-Flight Checks

### Backend Setup

- [ ] Python environment is ready (Python 3.x)
- [ ] Backend dependencies installed: `pip install -r requirements.txt`
- [ ] Reference poses exist in `yoga-trainer/data/reference_poses/keypoints/`
- [ ] Backend imports successfully: `python -c "from app.main import app; print('OK')"`

### Frontend Setup

- [ ] Node.js and npm are installed
- [ ] Frontend dependencies installed: `npm install` (in Frontend directory)
- [ ] Axios dependency confirmed: `npm list axios`
- [ ] `.env` file exists in Frontend directory with `REACT_APP_API_URL`

## File Verification

### New Service Files Created

- [ ] `Frontend/src/services/api.js` exists
- [ ] `Frontend/src/services/poseDetection.js` exists
- [ ] `Frontend/src/services/accuracy.js` exists
- [ ] `Frontend/src/services/reference.js` exists

### Updated Component Files

- [ ] `Frontend/src/Camera.js` has been updated with API integration
- [ ] `Frontend/src/EachExercise.js` passes selectedPoseId prop

### Configuration Files

- [ ] `Frontend/.env` exists
- [ ] `Frontend/.env.example` exists
- [ ] `Frontend/package.json` includes axios

### Documentation Files

- [ ] `INTEGRATION_SUMMARY.md` created
- [ ] `FRONTEND_INTEGRATION.md` created
- [ ] `QUICKSTART_INTEGRATION.md` created
- [ ] `ARCHITECTURE.md` created

### Utility Files

- [ ] `start-servers.bat` created (Windows batch)
- [ ] `start-servers.ps1` created (PowerShell)
- [ ] `Frontend/src/test-api.js` created

## Code Verification

### Camera.js Component

Check that Camera.js includes:

- [ ] Import statements for all service functions
- [ ] New state variables: `poses`, `selectedPose`, `accuracy`, `referenceImage`
- [ ] `loadReferencePoses()` function
- [ ] `handlePoseChange()` function
- [ ] `processFrame()` function
- [ ] `drawKeypoints()` function
- [ ] Updated `startCamera()` with detection interval
- [ ] Updated `stopCamera()` with cleanup
- [ ] Pose dropdown with dynamic options
- [ ] Reference image display with conditional rendering

### Service Files

Verify each service file has:

- [ ] `api.js` - axios client with base URL and interceptors
- [ ] `poseDetection.js` - detectPose, videoFrameToBase64, canvasToBase64
- [ ] `accuracy.js` - calculateAccuracy, calculateManualAccuracy, getConfiguredPoses
- [ ] `reference.js` - listReferencePoses, getReferencePose, uploadReferencePose

## Runtime Testing

### Step 1: Backend Startup

- [ ] Open terminal in `yoga-trainer` directory
- [ ] Run: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- [ ] See: "Uvicorn running on http://0.0.0.0:8000"
- [ ] No startup errors in terminal
- [ ] Can access: http://localhost:8000/docs
- [ ] API docs page loads successfully

### Step 2: Frontend Startup

- [ ] Open new terminal in `Frontend` directory
- [ ] Run: `npm start`
- [ ] See: "Server running at http://localhost:1234" (or similar)
- [ ] No build errors in terminal
- [ ] Can access: http://localhost:1234
- [ ] Homepage loads without errors

### Step 3: Browser Console

- [ ] Open browser DevTools (F12)
- [ ] Console tab shows no red errors
- [ ] Network tab shows no failed requests
- [ ] No CORS errors visible

### Step 4: Basic Navigation

- [ ] Homepage loads correctly
- [ ] Can navigate to yoga exercise list
- [ ] Can click on any exercise
- [ ] Exercise detail page loads
- [ ] All existing features work (text, images, navigation)

### Step 5: Camera Modal

- [ ] Click camera button (📷) at bottom of exercise page
- [ ] Camera modal opens with animation
- [ ] Modal displays correctly (no layout issues)
- [ ] Can see all UI elements (dropdown, buttons, video area)

### Step 6: Pose Selection

- [ ] Pose dropdown is populated (not empty)
- [ ] Dropdown shows actual pose names from backend
- [ ] Can select a pose from dropdown
- [ ] Reference image loads on right side when pose selected
- [ ] Reference image displays clearly

### Step 7: Camera Functionality

- [ ] Click "Start Camera" button
- [ ] Browser requests camera permission
- [ ] Grant camera permission
- [ ] Video feed appears in left panel
- [ ] Video is not frozen (shows live feed)
- [ ] No error messages appear

### Step 8: Pose Detection

- [ ] Position yourself in camera view
- [ ] Green keypoints appear on video overlay
- [ ] Keypoints move as you move
- [ ] Keypoints are visible and clear
- [ ] Accuracy percentage appears in display
- [ ] Accuracy number updates (not stuck at "-")

### Step 9: Accuracy Display

- [ ] Accuracy shows a number (e.g., "87")
- [ ] Number updates approximately every 1 second
- [ ] Number changes when you move
- [ ] Number is between 0-100
- [ ] Display formatting looks correct

### Step 10: Backend Logs

Check backend terminal shows:

- [ ] GET requests to `/api/v1/reference/poses`
- [ ] POST requests to `/api/v1/pose-detection/detect-pose`
- [ ] POST requests to `/api/v1/manual-accuracy/calculate`
- [ ] All requests return 200 OK status
- [ ] No 404, 500, or other error codes

### Step 11: Performance

- [ ] Detection runs smoothly (not laggy)
- [ ] UI remains responsive during detection
- [ ] No browser freezing or stuttering
- [ ] Video feed is smooth
- [ ] No excessive CPU usage

### Step 12: Stop Camera

- [ ] Click "Stop Camera" button
- [ ] Video feed stops
- [ ] Keypoint overlay clears
- [ ] Accuracy display shows "--" again
- [ ] No errors in console

### Step 13: Modal Close

- [ ] Can close camera modal
- [ ] Modal closes with animation
- [ ] Can reopen modal
- [ ] Settings persist (selected pose remains)

### Step 14: Error Handling

Test error scenarios:

- [ ] Stop backend server → See network error message
- [ ] Start backend → Can connect again
- [ ] Select pose with no reference → See appropriate message
- [ ] Cover camera → See "No pose detected" message

## API Testing (Manual)

### Test Reference Poses Endpoint

Open browser console and run:

```javascript
fetch("http://localhost:8000/api/v1/reference/poses")
  .then((r) => r.json())
  .then((d) => console.log("Poses:", d));
```

- [ ] Request succeeds (status 200)
- [ ] Returns JSON with poses array
- [ ] Poses array is not empty

### Test Health Endpoint

```javascript
fetch("http://localhost:8000/api/v1/health")
  .then((r) => r.json())
  .then((d) => console.log("Health:", d));
```

- [ ] Request succeeds
- [ ] Returns healthy status

## Cross-Browser Testing (Optional)

Test in different browsers:

- [ ] Chrome/Edge (Chromium) - Primary
- [ ] Firefox
- [ ] Safari (if on Mac)

## Mobile Testing (Optional)

Test responsive design:

- [ ] Desktop view (1920x1080)
- [ ] Tablet view (768px width)
- [ ] Mobile view (375px width)

## Design Verification

### Visual Consistency

- [ ] No layout shifts or breaks
- [ ] Colors match original design
- [ ] Fonts and typography unchanged
- [ ] Spacing and padding consistent
- [ ] Animations work as before

### Dark Mode

- [ ] Dark mode toggle still works
- [ ] New elements respect dark mode
- [ ] Proper contrast in both modes

### Responsive Design

- [ ] Camera modal responsive on mobile
- [ ] Dropdown works on touch devices
- [ ] Video scales properly

## Troubleshooting Completed

If any issues found:

- [ ] Checked browser console for errors
- [ ] Checked backend terminal for errors
- [ ] Verified environment variables
- [ ] Cleared browser cache
- [ ] Restarted both servers
- [ ] Consulted `QUICKSTART_INTEGRATION.md`

## Final Checks

### Code Quality

- [ ] No console.log statements left in production code
- [ ] No commented-out code blocks
- [ ] Proper error handling in all API calls
- [ ] All imports are used
- [ ] No TypeScript/JavaScript warnings

### Documentation

- [ ] README files are clear and accurate
- [ ] API endpoints documented correctly
- [ ] Setup instructions are complete
- [ ] Troubleshooting guide is helpful

### Git Status (Optional)

- [ ] All new files staged
- [ ] All modified files staged
- [ ] Commit message prepared
- [ ] Ready to push changes

## Sign-Off

### Developer Checklist

- [ ] All features implemented as requested
- [ ] Original design preserved
- [ ] No breaking changes to existing features
- [ ] Error handling implemented
- [ ] Documentation complete
- [ ] Code is clean and maintainable

### User Acceptance

Test the complete user flow:

1. [ ] Open application
2. [ ] Navigate to exercise
3. [ ] Open camera
4. [ ] Select pose
5. [ ] Start camera
6. [ ] See real-time accuracy
7. [ ] Stop camera
8. [ ] Close modal
9. [ ] Everything works smoothly

## Success Criteria

All items below must be true:

- [ ] ✅ Backend server starts without errors
- [ ] ✅ Frontend builds and runs without errors
- [ ] ✅ Pose dropdown populates from backend
- [ ] ✅ Camera starts and shows live feed
- [ ] ✅ Keypoints appear and track movement
- [ ] ✅ Accuracy displays and updates
- [ ] ✅ Reference images load correctly
- [ ] ✅ No console errors during operation
- [ ] ✅ Original design is preserved
- [ ] ✅ All existing features still work

---

## Notes Section

Use this space to note any issues or observations:

```
Issue: _________________________________________________

Solution: ______________________________________________

Status: [ ] Resolved  [ ] Pending  [ ] Won't Fix
```

---

**Verification Date**: ******\_\_\_******
**Verified By**: ******\_\_\_******
**Status**: [ ] All Passed [ ] Issues Found [ ] In Progress

---

## Quick Commands Reference

### Start Backend

```bash
cd d:\yoga\yoga-trainer
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend

```bash
cd d:\yoga\Frontend
npm start
```

### Test API from Browser Console

```javascript
// Test reference poses
fetch("http://localhost:8000/api/v1/reference/poses")
  .then((r) => r.json())
  .then(console.log);

// Test health
fetch("http://localhost:8000/api/v1/health")
  .then((r) => r.json())
  .then(console.log);
```

### Check Logs

- Backend: Watch the terminal where uvicorn is running
- Frontend: Watch browser console (F12)
- Network: Check Network tab in DevTools

---

**Print this checklist and mark items as you verify them!**
