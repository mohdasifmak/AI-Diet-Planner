document.getElementById('theme-toggle').addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
});

// Function to fetch and display the diet plan
function generateDietPlan() {
    fetch('/api/diet/generate', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('diet-plan').innerHTML = `
            <h3>Breakfast: ${data.breakfast}</h3>
            <h3>Lunch: ${data.lunch}</h3>
            <h3>Dinner: ${data.dinner}</h3>
            <h3>Snacks: ${data.snacks.join(', ')}</h3>
            <h3>Total Calories: ${data.calories}</h3>
        `;
    })
    .catch(err => console.error('Error:', err));
}
