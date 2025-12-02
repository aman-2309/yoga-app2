# Quick Start Guide - Frontend Backend Integration

## 🚀 Getting Started

### Step 1: Start the Backend Server

Open a terminal in the `yoga-trainer` directory:

```bash
cd d:\yoga\yoga-trainer
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend:**

- Open browser: http://localhost:8000/docs
- You should see the FastAPI interactive documentation

### Step 2: Start the Frontend Server

Open a new terminal in the `Frontend` directory:

```bash
cd d:\yoga\Frontend
npm start
```

**Expected Output:**

```
Server running at http://localhost:1234
✨  Built in XXXms
```

### Step 3: Test the Integration

1. **Open the application**: http://localhost:1234
2. **Navigate to any yoga exercise**
3. **Click the camera button (📷)** at the bottom of the page
4. **Select a pose** from the dropdown
5. **Click "Start Camera"**
6. **Position yourself** in front of the camera
7. **Watch the accuracy score** update in real-time

## 🧪 Testing Checklist

### Backend Health Check

- [ ] Backend server running on port 8000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] No CORS errors in browser console

### Frontend Integration

- [ ] Frontend running on port 1234 (or assigned port)
- [ ] No console errors when page loads
- [ ] Camera modal opens successfully
- [ ] Pose dropdown is populated with poses from backend
- [ ] Reference image loads when pose is selected

### Real-time Features

- [ ] Camera starts and shows video feed
- [ ] Keypoints are drawn on video overlay
- [ ] Accuracy percentage updates every second
- [ ] Accuracy display shows numerical value

## 🔍 Troubleshooting

### Issue: "Network error. Please check your connection..."

**Solution:**

1. Verify backend is running: `curl http://localhost:8000/api/v1/reference/poses`
2. Check `.env` file exists with: `REACT_APP_API_URL=http://localhost:8000/api/v1`
3. Restart frontend server after changing `.env`

### Issue: No poses in dropdown

**Solution:**

1. Check backend has reference poses:
   ```bash
   cd d:\yoga\yoga-trainer
   ls data/reference_poses/keypoints/
   ```
2. If empty, process reference images:
   ```bash
   python scripts/process_reference_images.py
   ```

### Issue: Pose detected but no accuracy

**Solution:**

1. Ensure pose name in dropdown matches backend pose ID
2. Check browser console for API errors
3. Verify manual accuracy is configured for the pose

### Issue: Camera not starting

**Solution:**

1. Grant camera permissions in browser
2. Check if camera is being used by another application
3. Try using HTTPS (required for some browsers)

## 📊 Monitoring

### Backend Logs

Watch backend terminal for API requests:

```
INFO:     127.0.0.1:XXXXX - "GET /api/v1/reference/poses HTTP/1.1" 200 OK
INFO:     127.0.0.1:XXXXX - "POST /api/v1/pose-detection/detect-pose HTTP/1.1" 200 OK
```

### Browser Console

Open Developer Tools (F12) → Console tab to see:

- API request logs
- Error messages
- Debug information

## 🎯 Testing Specific APIs

### Test from Browser Console

After opening the application, run in browser console:

```javascript
// Test listing poses
fetch("http://localhost:8000/api/v1/reference/poses")
  .then((r) => r.json())
  .then((d) => console.log("Poses:", d));

// Test health check
fetch("http://localhost:8000/api/v1/health")
  .then((r) => r.json())
  .then((d) => console.log("Health:", d));
```

## 📝 Configuration

### Backend Configuration

File: `yoga-trainer/app/config/settings.py`

Key settings:

- `cors_origins`: Add frontend URL if needed
- `api_v1_prefix`: API route prefix
- `reference_keypoints_dir`: Location of pose data

### Frontend Configuration

File: `Frontend/.env`

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

Change port if backend runs on different port.

## ✅ Success Indicators

When everything is working correctly:

1. **Backend Terminal**: Shows regular GET/POST requests
2. **Frontend**: No red errors in browser console
3. **Camera View**: Video feed visible with green keypoints overlay
4. **Accuracy Display**: Shows percentage (0-100) that updates
5. **Reference Image**: Shows the selected pose image

## 🆘 Still Having Issues?

1. Check both terminals for error messages
2. Verify all dependencies installed:
   - Backend: `pip list | grep -E "fastapi|uvicorn|mediapipe"`
   - Frontend: `npm list axios`
3. Try restarting both servers
4. Clear browser cache and reload
5. Check firewall isn't blocking port 8000

## 📚 Additional Resources

- Backend API Documentation: http://localhost:8000/docs
- Backend Alternative Docs: http://localhost:8000/redoc
- Integration Guide: `FRONTEND_INTEGRATION.md`
- Backend Setup: `yoga-trainer/QUICKSTART.md`

## 🎉 Next Steps

Once integration is working:

1. Add more reference poses
2. Customize accuracy thresholds
3. Enhance UI feedback
4. Add pose history/tracking
5. Implement progress analytics
