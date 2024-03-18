  const express = require('express');
  const mysql = require('mysql2/promise'); 
  const bodyParser = require('body-parser');
  const crypto = require('crypto');
  const session = require('express-session');
  const bcrypt = require('bcrypt');
  const cors = require('cors'); 



  const app = express();
  app.use(bodyParser.json());
  const port = 3001;

  app.use(cors({
    origin: 'http://localhost:3002',
    credentials: true
  })); 

  app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } 
  }));

  const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bcp_dashboard'                                             
  };

  console.log("Starting server...");
  const pool = mysql.createPool(config);


  // Generate a random token and store it in the database
async function generateResetToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiration = new Date(Date.now() + 3600000).toISOString().substring(0, 19); // token expires in 1 hour
  const insertQuery = 'INSERT INTO ResetTokens (UserID, Token, Expiration) VALUES (?, ?, ?)';
  const [result] = await pool.query(insertQuery, [userId, token, expiration]);
  return token;
}
// Check if the token provided by the user is valid and has not expired
async function isValidToken(token) {
  const selectQuery = 'SELECT * FROM ResetTokens WHERE Token = ?';
  const [rows] = await pool.query(selectQuery, [token]);
  if (rows.length === 0) {
    return false;
  }
  const [row] = rows;
  if (Date.now() > row.Expiration) {
    return false;
  }
  return row.UserID;
}

// Remove the token from the database
function removeToken(token) {
  const deleteQuery = 'DELETE FROM ResetTokens WHERE Token = ?';
  pool.query(deleteQuery, [token]);
}



  app.post('/register', bodyParser.json(), async (req, res) => {
    const { userName, password, email, organization, phoneNo } = req.body;
  
    if (!userName || !password || !email || !organization || !phoneNo) {
      return res.status(400).json({ errors: { 
        userName: 'Username is required',
        password: 'Password is required',
        email: 'Email is required',
        organization: 'Organization is required',
        phoneNo: 'Mobile number is required'
      }});
    }
  
    if (userName.length < 3) {
      return res.status(400).json({ errors: { userName: 'Username must be at least 3 characters long' } });
    }
  
    if (organization.length < 3) {
      return res.status(400).json({ errors: { organization: 'Organization must be at least 3 characters long' } });
    }
  
    if (!/^[\w-]+(.[\w-]+)*@([\w-]+.)+[a-zA-Z]{2,7}$/.test(email)) {
      return res.status(400).json({ errors: { email: 'Email is not a valid email address' } });
    }
  
    try {
      // Check if the username already exists in the database
      const selectUserQuery = 'SELECT * FROM Login WHERE UserName = ?';
      const [rows] = await pool.query(selectUserQuery, [userName]);
      if (rows.length > 0) {
        return res.status(400).json({ errors: { userName: 'Username already exists' } });
      }
  
      // Check if the email already exists in the database
      const selectEmailQuery = 'SELECT * FROM Login WHERE Email = ?';
      const [rows2] = await pool.query(selectEmailQuery, [email]);
      if (rows2.length > 0) {
        return res.status(400).json({ errors: { email: 'Email already exists' } });
      }
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
  
      // Insert user data into the Login table
      const insertQuery = 'INSERT INTO Login (UserName, Password, Email,Organization, PhoneNo, Salt) VALUES (?, ?, ?, ?, ?, ?)';
      const [result] = await pool.query(insertQuery, [userName, passwordHash, email, organization, phoneNo, salt]);
  
      console.log("User registered successfully!");
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: 'Error registering user' });
    }
  });
  
  app.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).send('Username and password are required!');
    }

    try {
      const [rows] = await pool.query('SELECT * FROM Login WHERE UserName = ?', [userName]);
      if (rows.length > 0) {
        const user = rows[0];
        console.log('Hashed password from database:', user.Password);
        const hashedPassword = await bcrypt.hash(password, user.Salt);
        console.log('Hashed password from entered password:', hashedPassword);
        if (hashedPassword === user.Password) {
          req.session.userId = user.ID;
          req.session.userName = user.UserName;
          res.send('LoggedIn');
        } 
        else {
          res.status(401).json({ message: 'Invalid Password!' });

          // res.status(401).send('Invalid Password!');
        }
      } 
      else {
        res.status(400).json({ message: 'User Not Found!' });

        // res.status(400).send('User Not Found!');
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: 'Error logging in user' });
    }
  });


    app.post('/logout', (req, res) => {
      req.session.destroy();
      res.status(200).json({ message: 'Logged Out' });

    });

    app.post('/reset-password', async (req, res) => {
      const { userName, oldPassword, newPassword } = req.body;
    
      if (!userName || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required!' });
      }
    
      try {
        // Check if the user exists in the database
        const [rows] = await pool.query('SELECT * FROM Login WHERE UserName = ?', [userName]);
        if (rows.length === 0) {
          return res.status(400).json({ message: 'User not found' });
        }
        const user = rows[0];
    
        // Validate the old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.Password);
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Invalid old password' });
        }
    
        // Hash the new password
        const salt = await bcrypt.genSalt();
        const newPasswordHash = await bcrypt.hash(newPassword, salt);
    
        // Update the user's password in the database using the user's ID
        const updateQuery = 'UPDATE Login SET Password = ?, Salt = ? WHERE ID = ?';
        await pool.query(updateQuery, [newPasswordHash, salt, user.ID]);
    
        console.log("Password reset successfully!");
        res.status(200).json({ message: 'Password reset successfully' });
      } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: 'Error resetting password' });
      }
    });
    
  

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });