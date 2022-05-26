import {addScore} from "../actions/score_actions"
import { useState, useEffect } from "react";

import Card from "./Card"

export default function MemoryGame({mode, difficulty, options, setOptions, highScore}) {
  const [game, setGame] = useState([])
  const [flippedCount, setFlippedCount] = useState(0)
  const [flippedIndexes, setFlippedIndexes] = useState([])
  const [winnings, setWinnings] = useState([])
  const [curPlayer, setCurPlayer] = useState(0)

  const [isFinished, setIsFinished] = useState(false)
  const [finishedScore, setFinishedScore] = useState(0)
  const [winnerName, setWinnerName] = useState("Anominous");
  const [saved, setSaved] = useState(false);

  const colors = [
    '#ecdb54',
    '#e34132',
    '#6ca0dc',
    '#944743',
    '#dbb2d1',
    '#ec9787',
    '#00a68c',
    '#645394',
    '#6c4f3d',
    '#ebe1df',
    '#bc6ca7',
    '#bfd833',
  ]

  useEffect(() => {
    const newGame = []
    for (let i = 0; i < options / 2; i++) {
      const firstOption = {
        id: 2 * i,
        colorId: i,
        color: colors[i],
        flipped: false,
      }
      const secondOption = {
        id: 2 * i + 1,
        colorId: i,
        color: colors[i],
        flipped: false,
      }

      newGame.push(firstOption)
      newGame.push(secondOption)
    }

    const shuffledGame = newGame.sort(() => Math.random() - 0.5)
    setGame(shuffledGame)
  }, [options])

  useEffect(() => {
    const finished = !game.some(card => !card.flipped)
    if (finished && game.length > 0) {
      setTimeout(() => {
        const bestPossible = game.length
        let multiplier = 10;
  
        if (options === 12) {
          multiplier = 5
        } else if (options === 18) {
          multiplier = 2.5
        } else if (options === 24) {
          multiplier = 1
        }
  
        const pointsLost = Math.round(multiplier * (0.66 * flippedCount - bestPossible))

        let score
        if (pointsLost < 100) {
          score = 100 - pointsLost
        } else {
          score = 0
        }
  
        setIsFinished(true);
        setFinishedScore(score);
        setSaved(false);
      }, 500)
    }
  }, [game])

  const saveScore = () => {
    addScore(finishedScore, winnerName, difficulty).then(response => {
      if (response.result === "success") {
        setSaved(true);
      }
    });
  }

  const restartGame = (newGame) => {
    if (newGame) {
      const gameLength = game.length
      setOptions(null)
      setTimeout(() => {
        setOptions(gameLength)
      }, 5)
    } else {
      setOptions(null)
    }
  }

  const onChange = (e) => {
    if (e.target.name === "winnername") setWinnerName(e.target.value);
  };

  if (flippedIndexes.length === 2) {
    const match = game[flippedIndexes[0]].colorId === game[flippedIndexes[1]].colorId
  
    if (match) {
      const newGame = [...game]
      newGame[flippedIndexes[0]].flipped = true
      newGame[flippedIndexes[1]].flipped = true
      setGame(newGame)
  
      const newIndexes = [...flippedIndexes]
      newIndexes.push(false)
      setFlippedIndexes(newIndexes)

      // Keep winnings
      setTimeout(() => {
        const newWinnings = [...winnings];
        newWinnings.push({
          color: game[flippedIndexes[1]].color,
          winner: curPlayer
        });
        setWinnings(newWinnings);
      }, 1000)
    } else {
      const newIndexes = [...flippedIndexes]
      newIndexes.push(true)
      setFlippedIndexes(newIndexes)

      // Change Player
      setTimeout(() => {
        setCurPlayer((curPlayer + 1) % 2)
      }, 1000)      
    }
  }

  if (game.length === 0) return <div>loading...</div>
  else {
    return (
      <>
        <div id="title-area">
          <h2>
            {mode === 'single' ? 'Single' : 'Multi'} Player
            {mode === 'multi' && (
              <>
              &nbsp;&nbsp;-&nbsp;&nbsp;Player&nbsp; 
              {curPlayer === 0 ? 'A' : 'B'}
              </>
            )}
          </h2>
          {isFinished && 
            <div className = "congratulation">
              <h3>Congratulations, You win! SCORE : {finishedScore} {finishedScore > highScore ? 'New record !!!' : ''}</h3>
              {finishedScore > 0 && 
                <div>
                  Would you like to save your score ? &nbsp;&nbsp;
                  <input type = "text" name = "winnername" value = {winnerName} onChange={onChange} disabled={saved ? true : false}></input>
                  <button onClick = {() => saveScore()} disabled={saved ? true : false}>{saved ? 'Saved !' : 'Save'}</button>
                </div>
              }
              <div>
                Would you like to restart this game ? <button onClick = {() => restartGame(true)}>Yes</button><button onClick = {() => restartGame(false)}>No</button>
              </div>
            </div>
          }
        </div>
        <div id="cards">
          {game.map((card, index) => (
            <div className="card" key={index}>
              <Card
                id={index}
                color={card.color}
                game={game}
                flippedCount={flippedCount}
                setFlippedCount={setFlippedCount}
                flippedIndexes={flippedIndexes}
                setFlippedIndexes={setFlippedIndexes}
              />
            </div>
          ))}
        </div>
        <div id = "winnings-area">
          <h3>Winnings</h3>
          {mode === 'single' && (
            <div className="winnings">
            {winnings.map((winning, index) => (
              <div className="winning" key={index}
                style={{
                  background: winning.color,
                }} />
            ))}
            </div>
          )}
          {mode === 'multi' && (
            <>
              <h4>Player A</h4>
              <div className="winnings">
              {winnings.map((winning, index) => (
                winning.winner === 0 &&
                <div className="winning" key={index}
                  style={{
                    background: winning.color,
                  }} />
              ))}
              </div>
              <h4>Player B</h4>
              <div className="winnings">
              {winnings.map((winning, index) => (
                winning.winner === 1 &&
                <div className="winning" key={index}
                  style={{
                    background: winning.color,
                  }} />
              ))}
              </div>          
            </>
          )}
        </div>       
      </>
    )
  }
}