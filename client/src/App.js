import React, { useState, useEffect } from "react";
import MemoryGame from "./components/MemoryGame"
import "./static/App.scss";
import {fetchScore} from "./actions/score_actions"

export default function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [selMode, setSelMode] = useState(null);
  
  const [options, setOptions] = useState(null)
  const [highScore, setHighScore] = useState(0)

  const [hightScoreList, setHighScoreList] = useState([]);

  useEffect(() => {
    fetchScore("all").then(response => {
      if (response.result === "success") {
        const newHightScoreList = [...response.data];
        setHighScoreList(newHightScoreList);
      }
    })    
  }, [])

  const onPlayGame = () => {
    switch (difficulty) {
      case 'easy' : setOptions(12); break;
      case 'medium' : setOptions(18); break;
      case 'hard' : setOptions(24); break;
      default : setOptions(12); break;
    }
  }

  const onDifficulty = (value) => {
    setDifficulty(value);
    setHighScore(hightScoreList.filter(item => item.difficulty === value).map((item, index) => index === 0 ? item.score : 0).reduce((prev, cur) => prev + cur, 0));
  }

  return (
    <div className = "container">
      <div className="heading-area">
        <h1>Memory Game</h1>
        <div>High Score: {highScore}</div>
        <div>
          {options === null ? (
            <>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  const prevOptions = options
                  setOptions(null)
                  setTimeout(() => {
                    setOptions(prevOptions)
                  }, 5)
                }}
              >
                Restart
              </button>
              <button onClick={() => setOptions(null)}>Main Menu</button>
            </>
          )}
        </div>
      </div>

      {options ? (
        <MemoryGame
          mode={selMode}
          difficulty={difficulty}
          options={options}
          setOptions={setOptions}
          highScore={highScore}
        />
      ) : (
        <>
        <h2>Choose a difficulty to begin!</h2>
        <div>
          <button onClick={() => onDifficulty('easy')} className = {difficulty === 'easy' ? 'selected' : ''}>Easy</button>
          <button onClick={() => onDifficulty('medium')} className = {difficulty === 'medium' ? 'selected' : ''}>Medium</button>
          <button onClick={() => onDifficulty('hard')} className = {difficulty === 'hard' ? 'selected' : ''}>Hard</button>
        </div>
        <h2>Choose a game mode</h2>
        <div>
          <button onClick={() => setSelMode('single')} className = {selMode === 'single' ? 'selected' : ''}>Single Player</button>
          <button onClick={() => setSelMode('multi')} className = {selMode === 'multi' ? 'selected' : ''}>Multi Player</button>
        </div>
        <br/><br/>
        {(difficulty && selMode) &&
          <div>
            <button onClick={() => onPlayGame()}>Play Game !</button>
          </div>        
        }
        </>
      )}
      <br/>
      <div id = "highscore-area">
        <h2>High Scores</h2>
          <div className = "highscore-contents" >
            <div className = "highscore-line header" >
            <div>Score</div>
            <div>Name</div>
            <div>Difficulty</div>
            <div>Date</div>
          </div>
          {hightScoreList.map((score, index) => {
            const newDate = new Date(score.date)

            return (
            <div key = {index} className = "highscore-line" >
              <div key = {index}>{score.score}</div>
              <div>{score.username}</div>
              <div>{score.difficulty}</div>
              <div>{newDate.toLocaleDateString() + ' ' + newDate.toLocaleTimeString()}</div>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}