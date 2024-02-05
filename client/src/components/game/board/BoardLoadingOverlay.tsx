import {AppLoader} from '../../loaders/AppLoader';
import {Loader} from '../../loaders/Loader';

interface IProps {
  reason: string
}

export const BoardLoadingOverlay = ({reason}: IProps) => {
  return (
    <div className='board-load-overlay'>
      <Loader />
      <p className='loading-reason-text'>{reason}</p>
    </div>
  );
};