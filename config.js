module.exports = {
  PORT: process.env.PORT || 5000,
  
  // Configuration Firebase
  FIREBASE_PROJECT_ID: 'knachsoft',
  FIREBASE_DATABASE_URL: 'https://knachsoft-default-rtdb.firebaseio.com',
  
  // Service Account directement dans le code (repo privé)
  FIREBASE_SERVICE_ACCOUNT: {
    "type": "service_account",
    "project_id": "knachsoft",
    "private_key_id": "ad6e848fbf3c2f40bed740ca50cda0d877d124c1",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD4zWM4SF7E9BGf\nLCS7LeO5LfKXHHuvEz2Ne68dmwC1YNpX7EBPNUOs63eWdN1gClhwYU0A/lc/8lU8\nJlEvPOXQ+QLZf0+KTYyIamfpT0b8vyVeqrYv/dVvn/+1sIZ3sSZ2cKEB71SSUqVR\nG3JVzlSiLNt17Vjg7EY/aHZ5aiFA4SwBiRz9xAxIFHgwK8kcIj9Mi0W79waPdlOK\nyw3SL2vQYEuyRY8/V8NaSZu66HRGqgvig6kjKcCZRTgbIeqOCOr9mqc2q46dnBD3\nEt2gDbGDkubMho0nKCku+x2QFnXEu3x2sP4w0B8BDdId2zU/kvjwTL5gUPUPqjxe\nKTiq/o+XAgMBAAECggEACDecWc0GGEIpXNTz55y14zVRyEzgBuG/TC90Eqm+Zb8r\npvC+FP+g2xKx0e3NK/Fbh2anSOudjRafWwu27bT4sCSxQ+axBVPXWuAMy4dbRFi5\nzr0bpE0hYfzqUKFiZ4yZxRqmLq6tX+HL5Phfl9bnM64Al439u/wBu/FizFLFg2N7\nyVldpSIyMXW/9ACFildAtCa9MlfzxIagY7MUeJ+PcuaLHfHsUIOoSPtw4ANNOsDB\n1im8sdWRDti7rBbNYCp8qoIxSS6Wz+M7P/eaIV7LbSQk2WN0tOqwDCVUpMW3tW1b\n6e8BgUkSkJemUFYb3cLb/aOBv/SG91rrHkXVhAje+QKBgQD9XQngUmz0pnj4bGlj\nNyoVUxm9+JRA9Wu8q84olZzb4Nd2KQjgkjUvPJb2TyMZVDvmGkjGiSHd3Xmg51o/\n1/YZaK+VXZcWXPVAuJRZRynmolTBMVMW8JbyCFA2F1sNxdmkiRr1qMR3O5eNyqXW\n/NUtdIJDRJUco8NdOU6PFLzX3wKBgQD7ZDK3MwRhprMp7bCX0k6OdTjWOh0JjTiq\nlXxBHCmHMCvPn7Q5iQGauQWDPuzFNUFuHW+14uonKgyyfCpefRUlFRUy63xuf3Lv\nU4FI6zOILpWcOrbKrKyopyAjAmrOV9CYNDQ6wztHEHrzIgQzwdtzjGiQlEeIuFG7\n0S6pIR8fSQKBgEeX/c10nTM4w2A3ikQt92dVNyX2UzZT42DKD5RqSovbaicKi2ai\nCgNSFLp/PETRB6gK71uirn46Mj9kgJ0f0nv1mAAWFTaNiAQE5G6h7FYustJwtLD7\nxTuZW8kdKm6m5MxYrdSTHwkuPrIjfF9WzIpurMyDWbthDziNlARccMxzAoGAFAP8\nTb3QIX5GUZZNMylZe9o1dkkWOsZ1to9EX2LAo7TgKB3NGa+g4xLML5D5BRKibQQG\n+vJgNlIQxL1CGlfXMSamk3FQbPPU0N1TM90WM0eSPegm2ag57wuvcVol6tvvDc9K\nQUt+EsBrKaSRtRVARcjuImTL9UTHrS6QioLKmZECgYB0yjLJNGYxD2HMMepAJlTd\nptRRwMjw/YIIKnewVQmJmOF+TAudrpM1hYF5LuVkAUO/vvrzzuK+xeMNZipZ78gO\nWErZlpNMN76rSwWtL271q8F9wHk9/Wwj6BkDS8KCD8Zg+2B27ndXeuJc8Y7wzDAk\nGOy1IDaiEGFkslKA6+FPyA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@knachsoft.iam.gserviceaccount.com",
    "client_id": "111628925863693284063",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40knachsoft.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  },
  
  ADMIN_PANEL_URL: 'https://knachsoft-admin.web.app'
};

