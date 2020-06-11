const jwt = require('jsonwebtoken');

const user = { 
    name: "lourenco",
    age: 45
}

const token = jwt.sign(user, '12345-67890-09876-54321', { expiresIn: 3600});
console.log(token)
const decoded = jwt.decode(token)
console.log(decoded)