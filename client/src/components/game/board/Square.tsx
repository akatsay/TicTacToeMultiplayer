interface IProps {
  value: string
  chooseSquare: () => void
}

export const Square = ({ value, chooseSquare }: IProps) => {
  return (
    <div className="square" onClick={chooseSquare}>
      {value}
    </div>
  );
};