/**
 * Client-side accuracy calculator that mirrors backend logic
 * Calculates pose accuracy using angle-based scoring
 */

/**
 * Calculate angle at vertex point formed by point1-vertex-point2
 * @param {Object} point1 - First keypoint {x, y, visibility}
 * @param {Object} vertex - Vertex keypoint {x, y, visibility}
 * @param {Object} point2 - Third keypoint {x, y, visibility}
 * @returns {number} - Angle in degrees (0-180)
 */
export const calculateAngle = (point1, vertex, point2) => {
    // Create vectors from vertex to each point
    const vector1 = {
        x: point1.x - vertex.x,
        y: point1.y - vertex.y
    };

    const vector2 = {
        x: point2.x - vertex.x,
        y: point2.y - vertex.y
    };

    // Calculate magnitudes
    const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);

    // Calculate dot product
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;

    // Calculate angle using dot product formula
    const cosAngle = dotProduct / (mag1 * mag2 + 1e-6);

    // Clip to avoid numerical errors
    const clippedCos = Math.max(-1.0, Math.min(1.0, cosAngle));

    // Convert to degrees
    const angleRadians = Math.acos(clippedCos);
    const angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
};

/**
 * Calculate Euclidean distance between two keypoints
 * @param {Object} kp1 - First keypoint {x, y}
 * @param {Object} kp2 - Second keypoint {x, y}
 * @returns {number} - Distance
 */
export const calculateDistance = (kp1, kp2) => {
    return Math.sqrt(
        Math.pow(kp1.x - kp2.x, 2) +
        Math.pow(kp1.y - kp2.y, 2)
    );
};

/**
 * Calculate score for a single angle
 * @param {number} actualAngle - Measured angle in degrees
 * @param {number} targetAngle - Expected angle in degrees
 * @param {number} tolerance - Acceptable deviation in degrees
 * @returns {Object} - Score info with score, status, color
 */
export const calculateAngleScore = (actualAngle, targetAngle, tolerance = 15.0) => {
    const deviation = Math.abs(actualAngle - targetAngle);

    let score;
    if (deviation <= tolerance) {
        // Within tolerance: 85-100% score (linear decrease)
        score = 100 - (deviation / tolerance) * 15;
    } else {
        // Outside tolerance: 0-85% score (steeper decrease)
        const excessDeviation = deviation - tolerance;
        score = Math.max(0, 85 - (excessDeviation / tolerance) * 85);
    }

    // Determine status and color based on score
    let status, color, symbol;
    if (score >= 85) {
        status = "excellent";
        color = "#00FF00"; // Green
        symbol = "✓";
    } else if (score >= 70) {
        status = "good";
        color = "#90EE90"; // Light green
        symbol = "○";
    } else if (score >= 50) {
        status = "needs_improvement";
        color = "#FFA500"; // Orange
        symbol = "△";
    } else {
        status = "poor";
        color = "#FF0000"; // Red
        symbol = "✗";
    }

    return {
        actual_angle: Math.round(actualAngle * 10) / 10,
        target_angle: targetAngle,
        deviation: Math.round(deviation * 10) / 10,
        score: Math.round(score * 100) / 100,
        status,
        color,
        symbol
    };
};

/**
 * Calculate connection score for body part connections
 * @param {number} distance - Measured distance between keypoints
 * @param {number} maxDistance - Maximum allowed distance
 * @returns {Object} - Score info
 */
export const calculateConnectionScore = (distance, maxDistance = 0.1) => {
    // Score decreases linearly from 100% at 0 distance to 0% at maxDistance
    const score = Math.max(0, 100 * (1 - distance / maxDistance));

    let status, color, symbol;
    if (score >= 85) {
        status = "excellent";
        color = "#00FF00";
        symbol = "✓";
    } else if (score >= 70) {
        status = "good";
        color = "#90EE90";
        symbol = "○";
    } else if (score >= 50) {
        status = "needs_improvement";
        color = "#FFA500";
        symbol = "△";
    } else {
        status = "poor";
        color = "#FF0000";
        symbol = "✗";
    }

    return {
        distance: Math.round(distance * 1000) / 1000,
        max_distance: maxDistance,
        score: Math.round(score * 10) / 10,
        status,
        color,
        symbol
    };
};

/**
 * Get color for joint based on accuracy score
 * @param {number} score - Accuracy score (0-100)
 * @returns {string} - Color code
 */
export const getColorForScore = (score) => {
    if (score >= 80) return '#00FF00'; // Green
    if (score >= 60) return '#FFA500'; // Orange
    return '#FF0000'; // Red
};

/**
 * Generate feedback message for an angle
 * @param {string} angleName - Name of the angle
 * @param {Object} scoreInfo - Score information
 * @returns {string} - Feedback message
 */
export const generateAngleFeedback = (angleName, scoreInfo) => {
    const { actual_angle, target_angle, deviation, status, symbol } = scoreInfo;

    if (status === "excellent") {
        return `${symbol} ${angleName}: Perfect! (${actual_angle}°)`;
    } else if (status === "good") {
        if (actual_angle > target_angle) {
            return `${symbol} ${angleName}: Good. Try decreasing by ${Math.round(deviation)}°`;
        } else {
            return `${symbol} ${angleName}: Good. Try increasing by ${Math.round(deviation)}°`;
        }
    } else if (status === "needs_improvement") {
        if (actual_angle > target_angle) {
            return `${symbol} ${angleName}: Too open. Decrease by ${Math.round(deviation)}°`;
        } else {
            return `${symbol} ${angleName}: Too closed. Increase by ${Math.round(deviation)}°`;
        }
    } else {
        if (actual_angle > target_angle) {
            return `${symbol} ${angleName}: Much too open! Decrease by ${Math.round(deviation)}°`;
        } else {
            return `${symbol} ${angleName}: Much too closed! Increase by ${Math.round(deviation)}°`;
        }
    }
};

/**
 * Generate general feedback based on overall accuracy
 * @param {number} overallAccuracy - Overall accuracy score (0-100)
 * @param {Array} angleScores - Array of angle score objects
 * @returns {string} - General feedback message
 */
export const generateGeneralFeedback = (overallAccuracy, angleScores = []) => {
    if (overallAccuracy >= 90) {
        return "Excellent pose! You've mastered this position! 🌟";
    } else if (overallAccuracy >= 80) {
        return "Great job! Very close to perfect form. Keep it up! 👍";
    } else if (overallAccuracy >= 70) {
        if (angleScores.length > 0) {
            const worst = angleScores.reduce((min, curr) =>
                curr.score < min.score ? curr : min
            );
            return `Good effort! Focus on improving your ${worst.angle_name?.toLowerCase() || 'form'}.`;
        }
        return "Good pose! A few minor adjustments will get you there.";
    } else if (overallAccuracy >= 50) {
        if (angleScores.length >= 2) {
            const sorted = [...angleScores].sort((a, b) => a.score - b.score).slice(0, 2);
            const names = sorted.map(a => a.angle_name?.toLowerCase() || 'angle');
            return `Needs work. Focus on: ${names[0]} and ${names[1]}.`;
        }
        return "Needs improvement. Check the feedback for specific angles.";
    } else {
        return "Keep practicing! Review the reference pose and try again. You've got this! 💪";
    }
};

/**
 * Calculate overall accuracy from weighted angle scores
 * @param {Array} angleScores - Array of angle score objects with weights
 * @returns {number} - Overall accuracy (0-100)
 */
export const calculateOverallAccuracy = (angleScores) => {
    if (!angleScores || angleScores.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    angleScores.forEach(scoreInfo => {
        const weight = scoreInfo.weight || 1.0;
        totalWeightedScore += scoreInfo.score * weight;
        totalWeight += weight;
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
};

/**
 * Convert keypoints array to dictionary for easy lookup
 * @param {Array} keypoints - Array of keypoints
 * @returns {Object} - Dictionary of keypoints by name
 */
export const keypointsToDict = (keypoints) => {
    const dict = {};
    keypoints.forEach(kp => {
        if (kp.name) {
            dict[kp.name] = kp;
        }
    });
    return dict;
};

/**
 * Check if keypoint is visible enough for calculation
 * @param {Object} keypoint - Keypoint object with visibility
 * @param {number} threshold - Minimum visibility threshold
 * @returns {boolean} - True if visible enough
 */
export const isKeypointVisible = (keypoint, threshold = 0.5) => {
    return keypoint && keypoint.visibility >= threshold;
};
