import {IGameState} from './Board';
import {Loader} from '../../loaders/Loader';

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
            {`${gameState.winner.nickname} wins the game playing as: "${gameState.winner.role.toUpperCase()}"`}
          </>
        )}
        {tie && 'That\'s a tie, Nobody wins :('}
      </p>
      <div className="post-game-option-buttons">
        <button
          disabled={loadingRestart}
          className='game-start-btn'
          onClick={() => {
            onRestartGame();
            onClose();}}
        >
          {loadingRestart ? <><Loader size={'small'} /> Waiting</> : 'Play again'}
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