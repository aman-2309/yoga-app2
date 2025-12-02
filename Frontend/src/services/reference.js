import apiClient from './api';

/**
 * Get list of all available reference poses
 * @returns {Promise} - Response with list of reference poses
 */
export const listReferencePoses = async () => {
    try {
        const response = await apiClient.get('/reference/poses');
        return response;
    } catch (error) {
        console.error('Error fetching reference poses:', error);
        throw error;
    }
};

/**
 * Get detailed information about a specific reference pose
 * @param {string} poseId - ID of the reference pose
 * @returns {Promise} - Response with pose details including keypoints
 */
export const getReferencePose = async (poseId) => {
    try {
        const response = await apiClient.get(`/reference/poses/${poseId}`);
        return response;
    } catch (error) {
        console.error('Error fetching reference pose:', error);
        throw error;
    }
};

/**
 * Upload a new reference pose with image
 * @param {string} poseId - ID for the new pose
 * @param {string} base64Image - Base64 encoded image
 * @param {Object} options - Optional metadata (view_angle, base_pose_name)
 * @returns {Promise} - Response with created pose data
 */
export const uploadReferencePose = async (poseId, base64Image, options = {}) => {
    try {
        const response = await apiClient.post('/reference/upload', {
            pose_id: poseId,
            image: base64Image,
            view_angle: options.view_angle || 'front',
            base_pose_name: options.base_pose_name
        });
        return response;
    } catch (error) {
        console.error('Error uploading reference pose:', error);
        throw error;
    }
};
