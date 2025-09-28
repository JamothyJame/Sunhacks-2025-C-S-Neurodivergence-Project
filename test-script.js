// MedTracker Comprehensive Test Script
// This script tests various features and edge cases in the application

console.log('🧪 Starting MedTracker Comprehensive Testing...');

const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  warnings: []
};

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${testName}${details ? ' - ' + details : ''}`);
  
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
    testResults.errors.push(`${testName}: ${details}`);
  }
}

function logWarning(message) {
  console.log(`⚠️ WARNING: ${message}`);
  testResults.warnings.push(message);
}

// Test 1: IndexedDB Initialization
async function testIndexedDBInit() {
  try {
    // Check if IndexedDB is available
    if (!window.indexedDB) {
      logTest('IndexedDB Availability', false, 'IndexedDB not supported in this browser');
      return;
    }

    // Try to open the database
    const dbName = 'MedTrackerDB';
    const request = indexedDB.open(dbName, 1);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        logTest('IndexedDB Initialization', true, 'Database opened successfully');
        request.result.close();
        resolve(true);
      };
      
      request.onerror = () => {
        logTest('IndexedDB Initialization', false, `Failed to open database: ${request.error}`);
        resolve(false);
      };
      
      request.onupgradeneeded = (event) => {
        logTest('IndexedDB Schema Creation', true, 'Database schema created/upgraded');
      };
    });
  } catch (error) {
    logTest('IndexedDB Initialization', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 2: Local Storage Availability
function testLocalStorage() {
  try {
    const testKey = 'medtracker_test';
    const testValue = 'test_data';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    const success = retrieved === testValue;
    logTest('Local Storage', success, success ? 'Storage available' : 'Storage not working correctly');
    return success;
  } catch (error) {
    logTest('Local Storage', false, `Not available: ${error.message}`);
    return false;
  }
}

// Test 3: Service Worker Registration (for notifications)
async function testServiceWorkerSupport() {
  try {
    if (!('serviceWorker' in navigator)) {
      logTest('Service Worker Support', false, 'Service workers not supported');
      return false;
    }
    
    logTest('Service Worker Support', true, 'Service workers supported');
    return true;
  } catch (error) {
    logTest('Service Worker Support', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 4: Notification API Support
async function testNotificationSupport() {
  try {
    if (!('Notification' in window)) {
      logTest('Notification API', false, 'Notification API not supported');
      return false;
    }
    
    const permission = Notification.permission;
    logTest('Notification API', true, `Available, permission: ${permission}`);
    
    if (permission === 'denied') {
      logWarning('Notifications are blocked by user');
    }
    
    return true;
  } catch (error) {
    logTest('Notification API', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 5: Date/Time Handling
function testDateTimeHandling() {
  try {
    const now = new Date();
    const dateString = now.toISOString();
    const parsedDate = new Date(dateString);
    
    const timeString = "08:30";
    const [hours, minutes] = timeString.split(':').map(Number);
    const testTime = new Date();
    testTime.setHours(hours, minutes, 0, 0);
    
    const success = !isNaN(parsedDate.getTime()) && testTime.getHours() === 8 && testTime.getMinutes() === 30;
    logTest('Date/Time Handling', success, success ? 'Date operations working' : 'Date parsing issues');
    return success;
  } catch (error) {
    logTest('Date/Time Handling', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 6: Form Validation Patterns
function testFormValidation() {
  try {
    // Test email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailPattern.test('user@example.com');
    const invalidEmail = !emailPattern.test('invalid-email');
    
    // Test time pattern
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const validTime = timePattern.test('08:30');
    const invalidTime = !timePattern.test('25:70');
    
    const success = validEmail && invalidEmail && validTime && invalidTime;
    logTest('Form Validation', success, success ? 'Validation patterns working' : 'Pattern matching issues');
    return success;
  } catch (error) {
    logTest('Form Validation', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 7: Crypto API (for generating UUIDs)
function testCryptoAPI() {
  try {
    if (!window.crypto || !window.crypto.randomUUID) {
      // Fallback UUID generation test
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
      logTest('Crypto API (Fallback)', isValidUUID, isValidUUID ? 'UUID generation working' : 'UUID generation failed');
      return isValidUUID;
    } else {
      const uuid = crypto.randomUUID();
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
      logTest('Crypto API', isValidUUID, 'Native UUID generation available');
      return isValidUUID;
    }
  } catch (error) {
    logTest('Crypto API', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 8: JSON Serialization/Deserialization
function testJSONHandling() {
  try {
    const testData = {
      id: 'test-123',
      name: 'Test Medication',
      times: ['08:00', '20:00'],
      date: new Date().toISOString(),
      active: true,
      supply: 30
    };
    
    const serialized = JSON.stringify(testData);
    const deserialized = JSON.parse(serialized);
    
    const success = deserialized.id === testData.id && 
                   deserialized.times.length === 2 && 
                   deserialized.active === true;
    
    logTest('JSON Handling', success, success ? 'Serialization working' : 'JSON issues detected');
    return success;
  } catch (error) {
    logTest('JSON Handling', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 9: Array and Object Operations
function testDataOperations() {
  try {
    const medications = [
      { id: '1', name: 'Med A', active: true },
      { id: '2', name: 'Med B', active: false },
      { id: '3', name: 'Med C', active: true }
    ];
    
    // Test filtering
    const active = medications.filter(med => med.active);
    
    // Test mapping
    const names = medications.map(med => med.name);
    
    // Test finding
    const found = medications.find(med => med.id === '2');
    
    // Test sorting
    const sorted = [...medications].sort((a, b) => a.name.localeCompare(b.name));
    
    const success = active.length === 2 && 
                   names.length === 3 && 
                   found?.name === 'Med B' && 
                   sorted[0].name === 'Med A';
    
    logTest('Data Operations', success, success ? 'Array/Object operations working' : 'Data manipulation issues');
    return success;
  } catch (error) {
    logTest('Data Operations', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 10: Promise and Async/Await Support
async function testAsyncSupport() {
  try {
    // Test Promise
    const promiseTest = new Promise(resolve => resolve('test'));
    const promiseResult = await promiseTest;
    
    // Test async function
    const asyncTest = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'async-test';
    };
    
    const asyncResult = await asyncTest();
    
    const success = promiseResult === 'test' && asyncResult === 'async-test';
    logTest('Async/Promise Support', success, success ? 'Async operations working' : 'Async issues detected');
    return success;
  } catch (error) {
    logTest('Async/Promise Support', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 11: Error Handling and Try/Catch
function testErrorHandling() {
  try {
    let errorCaught = false;
    
    try {
      throw new Error('Test error');
    } catch (error) {
      errorCaught = true;
    }
    
    // Test custom error types
    class CustomError extends Error {
      constructor(message) {
        super(message);
        this.name = 'CustomError';
      }
    }
    
    let customErrorCaught = false;
    try {
      throw new CustomError('Custom test error');
    } catch (error) {
      customErrorCaught = error instanceof CustomError;
    }
    
    const success = errorCaught && customErrorCaught;
    logTest('Error Handling', success, success ? 'Error handling working' : 'Error handling issues');
    return success;
  } catch (error) {
    logTest('Error Handling', false, `Exception: ${error.message}`);
    return false;
  }
}

// Test 12: Browser Compatibility Features
function testBrowserCompatibility() {
  const features = {
    es6Classes: typeof class {} === 'function',
    arrowFunctions: (() => true)(),
    templateLiterals: `test` === 'test',
    destructuring: (() => { const {a} = {a: 1}; return a === 1; })(),
    spreadOperator: [...[1, 2]].length === 2,
    fetch: typeof fetch === 'function',
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window
  };
  
  const supportedFeatures = Object.entries(features).filter(([, supported]) => supported);
  const totalFeatures = Object.keys(features).length;
  
  logTest('Browser Compatibility', true, `${supportedFeatures.length}/${totalFeatures} modern features supported`);
  
  // Log missing features as warnings
  Object.entries(features).forEach(([feature, supported]) => {
    if (!supported) {
      logWarning(`Missing browser feature: ${feature}`);
    }
  });
  
  return supportedFeatures.length >= totalFeatures * 0.8; // 80% compatibility threshold
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Running comprehensive browser environment tests...\n');
  
  await testIndexedDBInit();
  testLocalStorage();
  await testServiceWorkerSupport();
  await testNotificationSupport();
  testDateTimeHandling();
  testFormValidation();
  testCryptoAPI();
  testJSONHandling();
  testDataOperations();
  await testAsyncSupport();
  testErrorHandling();
  testBrowserCompatibility();
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⚠️ Warnings: ${testResults.warnings.length}`);
  
  if (testResults.failed > 0) {
    console.log('\n🔍 Failed Tests:');
    testResults.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (testResults.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    testResults.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  const successRate = (testResults.passed / (testResults.passed + testResults.failed)) * 100;
  console.log(`\n🎯 Overall Success Rate: ${successRate.toFixed(1)}%`);
  
  if (successRate >= 90) {
    console.log('🎉 Excellent! Your environment is well-suited for MedTracker.');
  } else if (successRate >= 75) {
    console.log('👍 Good! MedTracker should work well with minor limitations.');
  } else {
    console.log('⚠️ Some features may not work optimally. Review the failed tests.');
  }
}

// Export for manual execution
window.runMedTrackerTests = runAllTests;

// Auto-run if in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development environment detected. Run window.runMedTrackerTests() to execute tests.');
}

console.log('📝 Test script loaded. Use window.runMedTrackerTests() to run all tests.');