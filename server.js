const express = require('express');
const app = express();
const PORT = 4500;
app.get('/', (req, res) => {
    res.send('<h2>Welcome to my Node.js Express Server!</h2>');
});

// Middleware to parse JSON data
app.use(express.json());

// Middleware: Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Mock dataset (In-memory array)
let users = [
    { id: 1, name: "Madhu", email: "madhu@example.com" },
    { id: 2, name: "rutu", email: "rutu@example.com" }
];

// 1. Read (GET all users)
app.get('/users', (req, res) => {
    res.json(users);
});

// 2. Read (GET user by ID)
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});

// 3. Create (POST a new user)
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// 4. Update (PUT a user)
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    user.name = name; // Update name
    console.log(`User ID ${userId} updated to name: ${name}`);
    res.json({ message: "User updated successfully", user });
});

// 5. Delete (DELETE a user)
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(userIndex, 1);
    console.log(`User ID ${userId} deleted`);
    res.json({ message: "User deleted successfully", user: deletedUser[0] });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
