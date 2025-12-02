import apiClient from './api';

/**
 * Calculate accuracy by comparing user keypoints with reference pose
 * @param {Array} userKeypoints - Array of user pose keypoints
 * @param {string} referencePoseId - ID of the reference pose
 * @returns {Promise} - Response with accuracy scores and feedback
 */
export const calculateAccuracy = async (userKeypoints, referencePoseId) => {
    try {
        const response = await apiClient.post('/accuracy/calculate-accuracy', {
            user_keypoints: userKeypoints,
            reference_pose_id: referencePoseId
        });
        return response;
    } catch (error) {
        console.error('Accuracy calculation error:', error);
        throw error;
    }
};

/**
 * Calculate accuracy using manual angle-based method
 * @param {Array} userKeypoints - Array of user pose keypoints
 * @param {string} poseId - ID of the pose
 * @param {boolean} usePositionMatching - Whether to use position matching
 * @returns {Promise} - Response with accuracy scores and feedback
 */
export const calculateManualAccuracy = async (userKeypoints, poseId, usePositionMatching = true) => {
    try {
        const response = await apiClient.post('/manual-accuracy/calculate', {
            user_keypoints: userKeypoints,
            pose_id: poseId,
            use_position_matching: usePositionMatching
        });
        return response;
    } catch (error) {
        console.error('Manual accuracy calculation error:', error);
        throw error;
    }
};

/**
 * Get list of poses configured for manual accuracy
 * @returns {Promise} - Response with list of configured poses
 */
export const getConfiguredPoses = async () => {
    try {
        const response = await apiClient.get('/manual-accuracy/poses');
        return response;
    } catch (error) {
        console.error('Error fetching configured poses:', error);
        throw error;
    }
};
