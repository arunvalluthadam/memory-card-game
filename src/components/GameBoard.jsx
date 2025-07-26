import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card.jsx';

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Initial card symbols - make sure you have pairs!
const initialSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const cardValues = [...initialSymbols, ...initialSymbols]; // Create pairs

const GameBoard = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]); // Stores indices of flipped cards
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false); // To prevent clicks during check
  const [gameWon, setGameWon] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Let's Play!");

  const initializeGame = useCallback(() => {
    const shuffledValues = shuffleArray(cardValues);
    const initialCards = shuffledValues.map((value, index) => ({
      id: index,
      value: value,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setIsChecking(false);
    setGameWon(false);
    setStatusMessage("Game Started! Make your first move.");
  }, []);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (clickedId) => {
    if (isChecking || flippedCards.length === 2 || cards[clickedId].isFlipped || cards[clickedId].isMatched) {
      return; // Ignore clicks if already checking, 2 cards flipped, or card is already revealed/matched
    }

    const newCards = cards.map(card =>
      card.id === clickedId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 1) {
        setStatusMessage("One card flipped, pick another!");
    }
  };


  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true); // Prevent further clicks
      setMoves(prevMoves => prevMoves + 1);
      setStatusMessage("Checking for a match...");

      const [firstCardId, secondCardId] = flippedCards;
      const card1 = cards[firstCardId];
      const card2 = cards[secondCardId];

      if (card1.value === card2.value) {
        // It's a match!
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isMatched: true, isFlipped: true } // Keep matched cards flipped
                : card
            )
          );
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);
          setStatusMessage("It's a Match!");
        }, 1000); // Delay for visual feedback
      } else {
        // Not a match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false } // Flip back
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
          setStatusMessage("No match, try again!");
        }, 1200); // Longer delay to see the cards
      }
    }
  }, [flippedCards, cards]);


  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && matchedPairs === cards.length / 2) {
      setGameWon(true);
      setStatusMessage(`Congratulations! You won in ${moves} moves!`);
    }
  }, [matchedPairs, cards.length, moves]);


  return (
    <div>
      <div className="status-message">{statusMessage}</div>
      <div className="moves-counter">Moves: {moves}</div>
      <div className="game-board">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            value={card.value}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
      <button onClick={initializeGame} disabled={isChecking && !gameWon}>
        {gameWon ? 'Play Again?' : 'Restart Game'}
      </button>
    </div>
  );
};

export default GameBoard;