const express = require('express');
const { sequelize, models } = require('./models'); // Update the path as per your project structure
const bodyParser = require('body-parser');
const {Admin,Sport,Player,Session} = require('./models');
const app = express();
const path = require('path');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// ... Other configurations and middleware


const bcrypt = require('bcrypt');

app.post('/create-admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the createAdmin function with the hashed password
    const admin = await Admin.createAdmin(firstName, lastName, email, hashedPassword);

    res.json(admin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define a route for fetching a specific admin by ID
app.get('/admins/:id', async (req, res) => {
  const adminId = req.params.id;

  try {
    const admin = await Admin.findByPk(adminId);

    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/create-sport', async (req, res) => {
    try {
      // Get data from request body
      const { adminId, name } = req.body;
  
      // Check if the admin ID exists
      const admin = await Admin.getById(adminId);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      // Create the sport if admin ID is valid
      const sport = await Sport.create({
        adminId,
        name,
      });
  
      // Send a response or perform other actions
      res.json(sport);
    } catch (error) {
      console.error('Error creating sport:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/create-player', async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Call the createPlayer function with the hashed password
      const newPlayer = await Player.createPlayer({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      res.status(201).json({ message: 'Player created successfully', player: newPlayer.toJSON() });
    } catch (error) {
      console.error('Error creating Player:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  // app.js

// ... (existing code)

app.post('/create-session', async (req, res) => {
  try {
    const { sportId, creator, date, time, venue } = req.body;

    // Check if the sport ID exists
    const sport = await Sport.findByPk(sportId);
    if (!sport) {
      return res.status(404).json({ error: 'Sport not found' });
    }

    // Create the session if the sport ID is valid
    const session = await Session.create({
      sportId,
      creator,
      date,
      time,
      venue,
    });

    // Redirect to the admin dashboard after creating the session
    res.redirect('/admindashboard');
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ... (existing code)



  app.get('/sessions', async (req, res) => {
    try {
      const sessions = await Session.findAll();
      res.json(sessions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Define a route for getting a specific session by ID
  app.get('/sessions/:id', async (req, res) => {
    const sessionId = req.params.id;
  
    try {
      const session = await Session.findByPk(sessionId);
  
      if (session) {
        res.json(session);
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  
// ... Other routes and configurations
app.get('/players', async (req, res) => {
    try {
      const players = await Player.findAll();
      res.json(players);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Define a route for fetching a specific player by ID
  app.get('/players/:id', async (req, res) => {
    const playerId = req.params.id;
  
    try {
      const player = await Player.findByPk(playerId);
  
      if (player) {
        res.json(player);
      } else {
        res.status(404).json({ error: 'Player not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Sync the database and start the server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});




app.post('/login-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (admin) {
      // Compare the entered password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (isPasswordValid) {
        // Password is correct, perform login logic
        res.json({ message: 'Admin login successful' });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login-player', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the player by email
    const player = await Player.findOne({ where: { email } });

    if (player) {
      // Compare the entered password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, player.password);

      if (isPasswordValid) {
        // Password is correct, perform login logic
        res.json({ message: 'Player login successful' });
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    console.error('Error during player login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Assume you have the Express app and Sequelize models already configured

app.get('/admindashboard', async (req, res) => {
  try {
    // Fetch the list of players, sports, and sessions from the database
    const players = await Player.findAll();
    const sports = await Sport.findAll();
    const sessions = await Session.findAll({ include: Sport });

    // Render the admin-dashboard.ejs file and pass the players, sports, and sessions data
    res.render('admindashboard', { players, sports, sessions });
  } catch (error) {
    console.error('Error fetching players, sports, and sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/playerdashboard', async (req, res) => {
  try {
    // Fetch the list of colleague players and admin sessions from the database
    const colleaguePlayers = await Player.findAll();
    const adminSessions = await Session.findAll({ include: Sport });

    // Render the player-dashboard.ejs file and pass the colleague players and admin sessions data
    res.render('playerdashboard', { colleaguePlayers, adminSessions });
  } catch (error) {
    console.error('Error fetching colleague players and admin sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delete-session/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    // Find the session by ID
    const session = await Session.findByPk(sessionId);

    if (session) {
      // Delete the session
      await session.destroy();
      res.status(204).send(); // Successful deletion with no content
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/join-session/:id', async (req, res) => {
  const sessionId = req.params.id;

  try {
    // Find the session by ID
    const session = await Session.findByPk(sessionId);

    if (session) {
      // Check if the player is already joined, assuming you have a player ID in the session model
      const playerId = req.body.playerId; // Make sure to send the player ID in the request body

      // Check if the player is not already joined
      const isPlayerJoined = await session.hasPlayer(playerId);

      if (!isPlayerJoined) {
        // Join the session
        await session.addPlayer(playerId);
        res.status(200).json({ message: 'Player joined the session successfully' });
      } else {
        res.status(400).json({ error: 'Player is already joined to the session' });
      }
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get('/signupplayer', (req, res) => {
  res.render('signupplayer'); // Assuming you have an EJS file named signupplayer.ejs in the 'views' directory
});
app.get('/signupadmin', (req, res) => {
  res.render('signupadmin'); // Assuming you have an EJS file named signupplayer.ejs in the 'views' directory
});
app.get('/main', (req, res) => {
  res.render('main'); // Assuming you have an EJS file named signupplayer.ejs in the 'views' directory
});


