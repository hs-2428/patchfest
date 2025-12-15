# PatchFest Backend Starter 🚀

This project is a **simple backend API starter** created for IEEE PatchFest.  
It provides a clean and minimal foundation that contributors can build on during the event.

Instead of creating a full application beforehand, this repository gives participants:
- a working backend,
- a clear folder structure,
- and a list of issues that describe exactly what needs to be built next.

This helps contributors practice real-world backend development in a structured way.

---

## 📌 What This Project Is

This project is a **Node.js + Express backend** with only the essential setup included.

Right now, it contains:
- A minimal Express server
- A `/health` API route that returns `{ ok: true }`
- A clean folder structure (`src/server.js`)
- Multiple issues describing the next steps

It is NOT a finished project.  
It is only the **foundation** that participants will extend during PatchFest.

---

## 🎯 Purpose of the Project

The goal of this backend starter is to help PatchFest participants:

- Learn how backend APIs work  
- Understand GitHub workflows (issues, branches, PRs)  
- Build real features step-by-step  
- Collaborate in an open-source environment  

This project gives everyone — beginners and advanced — meaningful tasks to work on.

---

## 🚀 What This Backend Will Become

By the end of PatchFest, contributors will turn this starter into a functional backend API system with:

- ✔ CRUD routes (create, read, update, delete data)
- ✔ A storage layer (JSON or database)
- ✔ Input validation
- ✔ Error handling
- ✔ Logging system
- ✔ Rate limiting
- ✔ A `/metrics` endpoint
- ✔ API documentation (Swagger/OpenAPI)
- ✔ Automated tests and CI workflows

Each of these features will be added through the issues already listed in this repository.

---

## 🧱 How the Project Works

The backend runs on Express.js and is structured like this:
patchfest/
│
├── src/
│ └── server.js # Main backend server file
│
├── package.json # Dependencies and scripts
└── README.md # Documentation

### Key Components:
- **src/server.js** → The main server file where API routes will be added  
- **/health** → A simple route to verify the server is running  
- **Issues** → The list of tasks contributors can complete  
- **README** → The guide for running and understanding the project  

---

## 🚀 How to Run the Project

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Test the API endpoints:

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Storage API Examples:**
```bash
# Get all users
curl http://localhost:3000/api/storage/users

# Create a new user
curl -X POST http://localhost:3000/api/storage/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'

# Get a user by ID
curl http://localhost:3000/api/storage/users/{id}

# Update a user
curl -X PUT http://localhost:3000/api/storage/users/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith"}'

# Delete a user
curl -X DELETE http://localhost:3000/api/storage/users/{id}

# Get storage statistics
curl http://localhost:3000/api/storage/stats
```

If you see successful JSON responses, the backend is running correctly!

---

## 💾 Data Storage System

The backend now includes a **JSON file storage system** with full CRUD operations:

### Storage Method: JSON File
- **Location:** `data/storage.json`
- **Collections:** users, posts, comments
- **Features:** Auto-generated IDs, timestamps, error handling

### Available API Endpoints:
- `GET /api/storage/{collection}` - Get all records
- `GET /api/storage/{collection}/{id}` - Get record by ID
- `POST /api/storage/{collection}` - Create new record
- `PUT /api/storage/{collection}/{id}` - Update record
- `DELETE /api/storage/{collection}/{id}` - Delete record
- `GET /api/storage/stats` - Get storage statistics

### Error Handling:
- ✅ File access errors
- ✅ JSON parsing errors
- ✅ Collection validation
- ✅ Record not found errors
- ✅ Invalid request data

### Setup Instructions:
1. The storage file is auto-created on first use
2. Initial data includes sample users and posts
3. All operations include automatic timestamps
4. IDs are auto-generated for new records

---

## 🤝 How to Contribute

1. Go to the **Issues** tab  
2. Choose an issue you want to work on  
3. Comment: “I want to work on this”  
4. Create a new branch  
5. Write the code for the issue  
6. Open a Pull Request  
7. After review, your changes will be merged  

This workflow teaches open-source collaboration.

---

## 🗂️ Roadmap

- [x] Add CRUD API routes  
- [x] Add JSON/database storage layer  
- [ ] Add input validation  
- [x] Add proper error handling  
- [ ] Add logging  
- [ ] Add rate limiting  
- [ ] Add metrics endpoint  
- [ ] Add API documentation  
- [ ] Add automated tests  
- [ ] Improve developer documentation  

---

## 🎉 Why This Project Is Perfect for PatchFest

- Easy to understand  
- Beginner-friendly  
- Designed specifically for contributions  
- Minimal setup so everyone can build  
- Clear issues guide all development steps  

This project will grow through teamwork, learning, and collaboration during PatchFest.


