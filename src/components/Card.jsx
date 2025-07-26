import React from 'react';
// No need to import App.css here, it's typically imported in App.js or index.js

const Card = ({ id, value, isFlipped, isMatched, onCardClick }) => {
  const handleClick = () => {
    if (!isFlipped && !isMatched) { // Only allow click if not already flipped or matched
      onCardClick(id);
    }
  };

  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      data-testid={`card-${id}`} // For testing
    >
      <div className="card-inner">
        <div className="card-face card-front">
          {/* You can put a symbol or question mark for the card back if desired */}
          ?
        </div>
        <div className="card-face card-back">
          {value}
        </div>
      </div>
    </div>
  );
};

export default Card;