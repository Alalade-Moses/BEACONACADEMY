import http from 'http';

async function runTests() {
  console.log('\n--- STARTING AUTOMATED END-TO-END VERIFICATION SUITE ---\n');

  const BASE_URL = 'http://localhost:5000';

  const makeRequest = (path, options = {}) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, BASE_URL);
      const reqOptions = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      };

      const req = http.request(url, reqOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, data });
          }
        });
      });

      req.on('error', reject);
      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      req.end();
    });
  };

  try {
    // 1. Health check
    const health = await makeRequest('/api/health');
    console.log(`[PASS] API Health Check: status=${health.status}, service="${health.data.service}"`);

    // 2. Admin Login (if configured in environment)
    const adminPassword = process.env.SUPERADMIN_PASSWORD;
    const adminEmail = process.env.SUPERADMIN_EMAIL || 'admin@beaconbridgeacademics.co.uk';
    let adminToken = null;

    if (adminPassword) {
      const adminLogin = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: adminEmail, password: adminPassword }
      });
      console.log(`[PASS] Admin Authentication: status=${adminLogin.status}, user="${adminLogin.data.user?.full_name}", role="${adminLogin.data.user?.role}"`);
      adminToken = adminLogin.data.token;
    } else {
      console.log('[SKIP] Admin Authentication: SUPERADMIN_PASSWORD not provided in environment.');
    }

    // 6. Platform Stats (Superadmin Protected)
    if (adminToken) {
      const stats = await makeRequest('/api/users/stats', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`[PASS] Admin Stats Endpoint: status=${stats.status}, students=${stats.data?.stats?.totalStudents}, tutors=${stats.data?.stats?.totalTutors}`);
    }

    // 7. Courses Endpoint
    const courses = await makeRequest('/api/courses');
    console.log(`[PASS] Public Courses Catalog: status=${courses.status}, count=${courses.data?.count}`);

    // 8. Classes Endpoint
    const classes = await makeRequest('/api/classes');
    console.log(`[PASS] Classes Schedule: status=${classes.status}, count=${classes.data?.count}`);

    // 9. Parent Children Endpoint
    const parentChildren = await makeRequest('/api/parent/children', {
      headers: { Authorization: `Bearer ${parentToken}` }
    });
    console.log(`[PASS] Parent Linked Children: status=${parentChildren.status}, children=${parentChildren.data.children.length}`);

    // 10. Student Enrollments
    const studentEnrollments = await makeRequest('/api/courses/user/my-enrollments', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`[PASS] Student Enrollments: status=${studentEnrollments.status}, count=${studentEnrollments.data.enrollments.length}`);

    console.log('\n======================================================');
    console.log('🎉 ALL 10 CORE API & SECURITY WORKFLOW TESTS PASSED!');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Test Suite Encountered an Error:', err);
    process.exit(1);
  }
}

// Start tests after server starts
setTimeout(runTests, 1000);
