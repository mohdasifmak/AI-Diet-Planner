const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/User'); // User model
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

dotenv.config();

const app = express();

// --- Middleware ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/diet-planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// --- Session Config ---
app.use(session({
  secret: 'dietplannersecret',
  resave: false,
  saveUninitialized: false
}));

// --- Passport Config ---
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(expressLayouts);
app.set('layout', 'layout');

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  

// --- Routes ---
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
