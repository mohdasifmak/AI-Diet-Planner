const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');
const axios = require('axios');

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// Dashboard route
router.get('/', isLoggedIn, async (req, res) => {
    const diet = await Diet.findOne({ user: req.user._id });
    res.render('dashboard', {
        name: req.user.name,
        diet: diet
    });
});

// Handle diet generation (fake placeholder for AI integration)
router.post('/generate-diet', isLoggedIn, async (req, res) => {
  const {
    age,
    height,
    weight,
    location,
    gender,
    goals,
    healthRestrictions,
    dietaryRestrictions
  } = req.body;

  const prompt = `
You are a certified nutritionist. Create a personalized, culturally appropriate diet plan in JSON format.

User Profile:
- Age: ${age}
- Height: ${height} cm
- Weight: ${weight} kg
- Location: ${location}
- Gender: ${gender}
- Goals: ${goals || 'None'}
- Health Restrictions: ${healthRestrictions || 'None'}
- Dietary Restrictions: ${dietaryRestrictions || 'None'}

Format:
{
  "breakfast": "...",
  "lunch": "...",
  "dinner": "...",
  "snacks": "..."
}
Return only valid JSON.
`;

  console.log(process.env.AI_API_KEY);
  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          { role: 'system', content: 'You are a helpful nutritionist AI.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseText = response.data.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
    let parsedDiet;

    if (jsonMatch) {
      try {
        parsedDiet = JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error('Error parsing AI response:', err);
      }
    }


    console.log(parsedDiet);

    // Fallback diet if AI response is invalid
    if (!parsedDiet) {
      parsedDiet = {
        breakfast: '🍽️ Poha with peanuts and a cup of masala chai',
        lunch: '🍛 Dal tadka with basmati rice and mixed vegetable sabzi',
        dinner: '🥘 Paneer curry with chapati and cucumber raita',
        snacks: '🍌 A banana and a handful of roasted chana'
      };
    }

    // Remove previous diet
    await Diet.findOneAndDelete({ user: req.user._id });

    const newDiet = new Diet({
      user: req.user._id,
      dietPlan: parsedDiet
    });

    console.log(newDiet);

    await newDiet.save();

    res.redirect('/dashboard');

  } catch (error) {
    console.error('AI diet generation error:', error.response?.data || error.message);
    res.send('Failed to generate diet plan. Please try again later.');
  }
});

module.exports = router;

