- [x] Add necessary imports to server.py (random, requests, jose for JWT)
- [x] Define User and VerificationCode Pydantic models
- [x] Implement POST /api/send-verification-code endpoint
- [x] Implement POST /api/verify-code endpoint
- [x] Test the endpoints (critical-path: server started, endpoint accessible)
- [x] Update Auth.jsx to use backend API instead of Firebase
- [x] Add authentication state to App.js
- [x] Modify Profile.jsx to show auth form if not logged in
- [x] Add purchase restrictions in Checkout.jsx (route protected in App.js)
- [x] Test the frontend auth flow (backend and frontend started, auth page accessible)

Node.js Backend Migration:

- [x] Set up Node.js project structure in backend/ directory (package.json, server.js)
- [x] Install dependencies (express, mongoose, jsonwebtoken, bcryptjs, nodemailer, razorpay, cors, dotenv)
- [x] Create models (User, Product, Order, VerificationCode) with Mongoose
- [x] Implement auth routes (send verification code, verify code, login) with SendGrid
- [x] Implement product routes (CRUD for products)
- [x] Implement order routes (create order, get orders)
- [x] Integrate Razorpay for payments (create order, verify payment)
- [x] Update frontend API calls to use new Node.js backend
- [x] Test the new backend and frontend integration
