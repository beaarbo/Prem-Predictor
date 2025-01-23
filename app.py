import os
import joblib
from flask import Flask, render_template, request, session
import pandas as pd

# Get the current working directory (where the app runs)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Update model file paths
model = joblib.load(os.path.join(BASE_DIR, 'football_match_predictor.joblib'))
label_encoder = joblib.load(os.path.join(BASE_DIR, 'label_encoder.joblib'))
team_encoder = joblib.load(os.path.join(BASE_DIR, 'team_encoder.joblib'))

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Required to use Flask session

# Home page route
@app.route('/')
def index():
    # Initialize session for storing prediction history
    if 'history' not in session:
        session['history'] = []
    return render_template('templates/index.html', history=session['history'])

# Predict route
@app.route('/predict', methods=['POST'])
def predict():
    home_team = request.form['home_team']
    away_team = request.form['away_team']
    
    # Encode the teams as numeric values
    home_team_encoded = team_encoder.transform([home_team])[0]
    away_team_encoded = team_encoder.transform([away_team])[0]
    
    # Prepare the features for prediction
    features = pd.DataFrame([[home_team_encoded, away_team_encoded]], columns=['Home', 'Away'])
    
    # Make the prediction
    prediction = model.predict(features)[0]
    result = label_encoder.inverse_transform([prediction])[0]
    
    # Determine which team won or if it's a draw
    if result == 'H':  # Home team wins
        prediction_result = f"{home_team} wins"
    elif result == 'A':  # Away team wins
        prediction_result = f"{away_team} wins"
    else:  # It's a draw
        prediction_result = "Draw"
    
    # Add the result to the history
    history_entry = f"{home_team} vs {away_team}: {prediction_result}"
    session['history'].append(history_entry)
    session.modified = True  # Mark session as modified to save changes

    return render_template('templates/index.html', prediction=prediction_result, history=session['history'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

