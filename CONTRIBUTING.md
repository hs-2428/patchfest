# Contributing to PatchFest Backend 🤝

Thank you for your interest in contributing to the PatchFest Backend project! This document provides guidelines and instructions for contributing to this repository.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Branching Model](#branching-model)
3. [Pull Request Process](#pull-request-process)
4. [Coding Style Guidelines](#coding-style-guidelines)
5. [Issue Guidelines](#issue-guidelines)
6. [Code Review Process](#code-review-process)
7. [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Git
- A GitHub account

### Setting Up Your Development Environment

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/patchfest.git
   cd patchfest
   ```

3. **Add the original repository as upstream**:
   ```bash
   git remote add upstream https://github.com/hs-2428/patchfest.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start the development server**:
   ```bash
   npm start
   ```

6. **Verify the setup** by visiting `http://localhost:3000/health`

## 🌿 Branching Model

### Branch Structure

- **`main`** - The main branch containing stable, production-ready code
- **Feature branches** - Branches for working on specific issues

### Branch Naming Convention

Create descriptive branch names following this pattern:
```
fix-issue-{issue-number}
```

**Examples:**
- `fix-issue-25` - For issue #25
- `fix-issue-42` - For issue #42

### Creating a New Branch

1. **Always start from the latest main branch**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a new feature branch**:
   ```bash
   git checkout -b fix-issue-{issue-number}
   ```

3. **Make your changes** and commit them

4. **Push your branch**:
   ```bash
   git push --set-upstream origin fix-issue-{issue-number}
   ```

## 🔄 Pull Request Process

### Before Creating a PR

1. **Ensure your code follows our coding standards**
2. **Test your changes locally**
3. **Update documentation if necessary**
4. **Make sure all existing functionality still works**

### Creating a Pull Request

#### PR Title Format
```
[Team Name] – Fix for Issue #<issue-number>
```

#### PR Description Template
```markdown
**Team Name:** <Your Team Name>

**Issue(s) Solved:**
- Closes #<issue-number>

**Changes Made:**
- Brief description of what you did
- List key changes or additions
- Mention any breaking changes

**Testing:**
- [ ] I have tested this locally
- [ ] All existing functionality works
- [ ] No new errors or warnings

**Additional Notes:**
(Any additional context, screenshots, or information)
```

#### Alternative Short Description Format
```
Fixed #<issue_number>
<team_name>
<small_description>
```

### PR Review Process

1. **Automated checks** will run on your PR
2. **Code review** by maintainers
3. **Address feedback** if any changes are requested
4. **Merge** once approved

### Important Notes

- ⚠️ **PRs without proper description may be rejected**
- 🏷️ **Always mention your team name and issue number clearly**
- 🔗 **Link to the issue using "Closes #issue-number"**

## 💻 Coding Style Guidelines

### JavaScript/Node.js Standards

#### General Principles
- Write clean, readable, and maintainable code
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

#### Code Formatting

**Indentation:** Use 2 spaces (no tabs)
```javascript
// ✅ Good
if (condition) {
  doSomething();
}

// ❌ Bad
if (condition) {
    doSomething();
}
```

**Semicolons:** Always use semicolons
```javascript
// ✅ Good
const app = express();

// ❌ Bad
const app = express()
```

**Quotes:** Use double quotes for strings
```javascript
// ✅ Good
const message = "Hello, World!";

// ❌ Bad
const message = 'Hello, World!';
```

#### Variable Naming

- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **UPPER_SNAKE_CASE** for constants

```javascript
// ✅ Good
const userName = "john_doe";
const API_BASE_URL = "https://api.example.com";

class UserManager {
  getUserById(userId) {
    // implementation
  }
}
```

#### Function Structure

```javascript
// ✅ Good - Clear function with descriptive name
const validateUserInput = (userData) => {
  if (!userData.email) {
    throw new Error("Email is required");
  }
  
  return true;
};

// Express route structure
app.get("/api/users", (req, res) => {
  try {
    // Route logic here
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Error Handling

- Always handle errors gracefully
- Use try-catch blocks for async operations
- Return meaningful error messages

```javascript
// ✅ Good
app.get("/api/data", async (req, res) => {
  try {
    const data = await fetchData();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

#### Comments

- Use comments to explain **why**, not **what**
- Add JSDoc comments for functions

```javascript
/**
 * Validates user registration data
 * @param {Object} userData - User data from registration form
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {boolean} True if validation passes
 * @throws {Error} When validation fails
 */
const validateRegistration = (userData) => {
  // Check if email format is valid (using regex for complex validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(userData.email);
};
```

### File Structure Guidelines

```
src/
├── server.js          # Main server file
├── routes/             # API route handlers
│   ├── users.js
│   └── auth.js
├── middleware/         # Custom middleware
│   ├── auth.js
│   └── validation.js
├── models/             # Data models
│   └── user.js
├── utils/              # Utility functions
│   └── helpers.js
└── config/             # Configuration files
    └── database.js
```

## 🐛 Issue Guidelines

### Before Working on an Issue

1. **Comment on the issue**: "I want to work on this"
2. **Wait for assignment** from maintainers
3. **Ask questions** if anything is unclear
4. **Check if the issue is already being worked on**

### Types of Contributions

- 🐛 **Bug fixes** - Fix existing functionality
- ✨ **Features** - Add new functionality
- 📚 **Documentation** - Improve or add documentation
- 🎨 **UI/UX** - Improve user experience
- ⚡ **Performance** - Optimize existing code
- 🧪 **Tests** - Add or improve test coverage

## 👀 Code Review Process

### As a Contributor

- **Be open to feedback** and ready to make changes
- **Respond promptly** to review comments
- **Test your changes** before requesting review
- **Keep PRs focused** - one issue per PR

### Review Criteria

- ✅ **Code quality** - Follows style guidelines
- ✅ **Functionality** - Works as expected
- ✅ **Testing** - Adequately tested
- ✅ **Documentation** - Well documented
- ✅ **Performance** - No unnecessary performance impact

## 🌟 Community Guidelines

### Be Respectful

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Be Collaborative

- Help other contributors when possible
- Share knowledge and learn from others
- Ask questions when you need help
- Provide constructive feedback in reviews

### Be Patient

- Remember that everyone is learning
- Maintainers review PRs in their spare time
- Complex changes may take longer to review

## 🎉 Getting Help

### Where to Ask Questions

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For general questions and discussions
- **PR Comments** - For specific questions about your changes

### Useful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

**Happy Contributing! 🚀**

Thank you for helping make PatchFest Backend better for everyone. Your contributions, no matter how small, make a difference in the community!