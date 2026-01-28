/**
 * Get the current time in milliseconds.
 * Supports TEST_MODE for deterministic testing.
 */
export function getCurrentTimeMs(request?: Request): number {
  // Check if we're in test mode
  const isTestMode = process.env.TEST_MODE === '1';
  
  if (isTestMode && request) {
    const testNowHeader = request.headers.get('x-test-now-ms');
    if (testNowHeader) {
      const testTime = parseInt(testNowHeader, 10);
      if (!isNaN(testTime)) {
        return testTime;
      }
    }
  }
  
  return Date.now();
}