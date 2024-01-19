import React from 'react';
import '../../styles/scss/gameFinishedModal.scss';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  renderContent: (onClose: () => void) => React.ReactNode;
}

export const ModalStd = ({ isOpen, onClose, renderContent }: IProps) => {
  return (
    <>
      {isOpen && (
        <div className='modal open'>
          <div
            onClick={(e) => e.stopPropagation()}
            className='modal-overlay'
          >
            <div className='modal-content'>
              {renderContent(onClose)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};