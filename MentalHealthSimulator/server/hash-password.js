const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'Sunny@123';
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Original password:', password);
  console.log('Hashed password:', hashedPassword);
}

hashPassword(); 