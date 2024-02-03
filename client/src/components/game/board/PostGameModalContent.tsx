import {IGameState} from './Board';

interface IProps {
  onClose: () => void
  gameState: IGameState
  loadingRestart: boolean
  onRestartGame: () => void
  onLeaveGame: (withToast: boolean) => void
}

export const PostGameModalContent = ({onClose, gameState, loadingRestart, onRestartGame, onLeaveGame}: IProps) => {

  const tie = gameState.gameStatus === 'tie';

  return (
    <div>
      <p className="game-result">
        {!tie && (
          <>
            {`${gameState.winner.nickname} wins the game playing: ${gameState.winner.role.toUpperCase()}`}
          </>
        )}
        {tie && 'That\'s a tie, Nobody wins :('}
      </p>
      <div className="post-game-option-buttons">
        <button
          className='game-start-btn'
          onClick={() => {
            onRestartGame();
            onClose();}}
        >
          {loadingRestart ? 'Waiting' : 'Play again'}
        </button>
        <button
          className='game-leave-btn'
          onClick={() => {
            onLeaveGame(false);
            onClose();
          }}
        >
                  Leave the game
        </button>
      </div>
    </div>

  );
};