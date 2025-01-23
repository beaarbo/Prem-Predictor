document.addEventListener('DOMContentLoaded', () => {
    const homeTeamInput = document.getElementById('home-team');
    const awayTeamInput = document.getElementById('away-team');
    const homeTeamList = document.getElementById('home-team-list');
    const awayTeamList = document.getElementById('away-team-list');
  
    async function makePrediction() {
        const homeTeam = homeTeamInput.value.trim();
        const awayTeam = awayTeamInput.value.trim();
  
        // Check if both teams are entered
        if (!homeTeam || !awayTeam) {
            alert('Please enter both teams.');
            return;
        }
  
        try {
            // Make the request to the Flask backend
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam })
            });
  
            const data = await response.json();
  
            // Show the result
            if (data.prediction) {
                resultText.innerText = data.prediction;
                resultSection.style.display = 'block'; // Display the result section
            } else {
                alert('Error: Prediction failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch prediction.');
        }
    }

    // Attach event listener to the button
    document.getElementById('predict-button').addEventListener('click', makePrediction);

  
    // Event listeners for input filtering (mocked example)
    const filterTeams = (inputElement, listElement) => {
      const teams = ['Team A', 'Team B', 'Team C'];  // Example team names
      const query = inputElement.value.toLowerCase();
      const filteredTeams = teams.filter(team => team.toLowerCase().includes(query));
  
      listElement.innerHTML = '';
      filteredTeams.forEach(team => {
        const li = document.createElement('li');
        li.textContent = team;
        li.onclick = () => {
          inputElement.value = team;
          listElement.innerHTML = '';
        };
        listElement.appendChild(li);
      });
    };
  
    homeTeamInput.addEventListener('input', () => filterTeams(homeTeamInput, homeTeamList));
    awayTeamInput.addEventListener('input', () => filterTeams(awayTeamInput, awayTeamList));
  });
  
