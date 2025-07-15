const axios = require("axios");

const BASE_URL = "http://localhost:5000";

// Test data
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "test123",
  role: "patient",
};

let authToken = "";

// Test functions
const testAuth = async () => {
  console.log("\n=== Testing Auth Endpoints ===");

  try {
    // Test registration
    console.log("Testing registration...");
    const registerResponse = await axios.post(
      `${BASE_URL}/auth/register`,
      testUser
    );
    console.log("✓ Registration successful:", registerResponse.data.message);

    // Test login
    console.log("Testing login...");
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    authToken = loginResponse.data.token;
    console.log("✓ Login successful:", loginResponse.data.message);

    // Test get profile
    console.log("Testing get profile...");
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("✓ Get profile successful");
  } catch (error) {
    console.error("✗ Auth test failed:", error.response?.data || error.message);
  }
};

const testUsers = async () => {
  console.log("\n=== Testing Users Endpoints ===");

  try {
    // Test get user by ID
    console.log("Testing get user by ID...");
    const userResponse = await axios.get(
      `${BASE_URL}/api/users/${testUser.id}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✓ Get user successful");
  } catch (error) {
    console.error(
      "✗ Users test failed:",
      error.response?.data || error.message
    );
  }
};

const testPatients = async () => {
  console.log("\n=== Testing Patients Endpoints ===");

  try {
    // Test get patients
    console.log("Testing get patients...");
    const patientsResponse = await axios.get(`${BASE_URL}/api/patients`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("✓ Get patients successful");
  } catch (error) {
    console.error(
      "✗ Patients test failed:",
      error.response?.data || error.message
    );
  }
};

const testAppointments = async () => {
  console.log("\n=== Testing Appointments Endpoints ===");

  try {
    // Test get doctors
    console.log("Testing get doctors...");
    const doctorsResponse = await axios.get(
      `${BASE_URL}/api/appointments/doctors`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✓ Get doctors successful");

    // Test get patient appointments
    console.log("Testing get patient appointments...");
    const appointmentsResponse = await axios.get(
      `${BASE_URL}/api/appointments/patient`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✓ Get patient appointments successful");
  } catch (error) {
    console.error(
      "✗ Appointments test failed:",
      error.response?.data || error.message
    );
  }
};

const testPrescriptions = async () => {
  console.log("\n=== Testing Prescriptions Endpoints ===");

  try {
    // Test get patient prescriptions
    console.log("Testing get patient prescriptions...");
    const prescriptionsResponse = await axios.get(
      `${BASE_URL}/api/prescriptions`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✓ Get prescriptions successful");
  } catch (error) {
    console.error(
      "✗ Prescriptions test failed:",
      error.response?.data || error.message
    );
  }
};

const testLabReports = async () => {
  console.log("\n=== Testing Lab Reports Endpoints ===");

  try {
    // Test get lab reports
    console.log("Testing get lab reports...");
    const labReportsResponse = await axios.get(`${BASE_URL}/api/lab-reports`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log("✓ Get lab reports successful");
  } catch (error) {
    console.error(
      "✗ Lab reports test failed:",
      error.response?.data || error.message
    );
  }
};

const testMedicalHistory = async () => {
  console.log("\n=== Testing Medical History Endpoints ===");

  try {
    // Test get medical history
    console.log("Testing get medical history...");
    const medicalHistoryResponse = await axios.get(
      `${BASE_URL}/api/medical-history`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✓ Get medical history successful");
  } catch (error) {
    console.error(
      "✗ Medical history test failed:",
      error.response?.data || error.message
    );
  }
};

const testEmergencyCases = async () => {
  console.log("\n=== Testing Emergency Cases Endpoints ===");

  try {
    // Test get emergency cases
    console.log("Testing get emergency cases...");
    const emergencyCasesResponse = await axios.get(
      `${BASE_URL}/api/emergency-cases`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log("✓ Get emergency cases successful");
  } catch (error) {
    console.error(
      "✗ Emergency cases test failed:",
      error.response?.data || error.message
    );
  }
};

// Run all tests
const runTests = async () => {
  console.log("Starting endpoint tests...");

  await testAuth();
  await testUsers();
  await testPatients();
  await testAppointments();
  await testPrescriptions();
  await testLabReports();
  await testMedicalHistory();
  await testEmergencyCases();

  console.log("\n=== All tests completed ===");
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  runTests,
  testAuth,
  testUsers,
  testPatients,
  testAppointments,
  testPrescriptions,
  testLabReports,
  testMedicalHistory,
  testEmergencyCases,
};
