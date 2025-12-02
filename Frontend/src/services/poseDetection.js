import apiClient from './api';

/**
 * Detect pose from a base64 encoded image
 * @param {string} base64Image - Base64 encoded image string (without data:image prefix)
 * @returns {Promise} - Response with detected pose keypoints
 */
export const detectPose = async (base64Image) => {
    try {
        const response = await apiClient.post('/pose-detection/detect-pose', {
            image: base64Image
        });
        return response;
    } catch (error) {
        console.error('Pose detection error:', error);
        throw error;
    }
};

/**
 * Convert canvas to base64 image string (removes data:image/jpeg;base64, prefix)
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {string} - Base64 encoded image without prefix
 */
export const canvasToBase64 = (canvas) => {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    // Remove the data:image/jpeg;base64, prefix
    return dataUrl.split(',')[1];
};

/**
 * Convert video frame to base64 for pose detection
 * @param {HTMLVideoElement} videoElement - Video element
 * @returns {string} - Base64 encoded image without prefix
 */
export const videoFrameToBase64 = (videoElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    return canvasToBase64(canvas);
};
