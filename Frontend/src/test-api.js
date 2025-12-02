/**
 * Test script to verify backend API connectivity
 * Run this from browser console or as a standalone test
 */

import { listReferencePoses } from './services/reference';
import { detectPose } from './services/poseDetection';

// Test 1: List reference poses
export async function testListPoses() {
    console.log('Testing: List Reference Poses...');
    try {
        const response = await listReferencePoses();
        console.log('✅ Success:', response);
        return response;
    } catch (error) {
        console.error('❌ Failed:', error.message);
        throw error;
    }
}

// Test 2: Detect pose (requires base64 image)
export async function testDetectPose(base64Image) {
    console.log('Testing: Detect Pose...');
    try {
        const response = await detectPose(base64Image);
        console.log('✅ Success:', response);
        return response;
    } catch (error) {
        console.error('❌ Failed:', error.message);
        throw error;
    }
}

// Run all tests
export async function runAllTests() {
    console.log('🧪 Starting API Integration Tests...\n');

    try {
        // Test 1: List poses
        await testListPoses();
        console.log('\n');

        console.log('✅ All tests passed!');
    } catch (error) {
        console.error('❌ Tests failed');
    }
}

// Auto-run if imported
if (typeof window !== 'undefined') {
    window.testAPI = {
        testListPoses,
        testDetectPose,
        runAllTests
    };
    console.log('API test functions available: window.testAPI');
}
