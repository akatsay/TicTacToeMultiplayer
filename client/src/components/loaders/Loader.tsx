import '../../styles/scss/loader.scss';

interface IProps {
  size?: 'small' | 'large'
}

export const Loader = ({size = 'large'}: IProps) => {
  return (
    <span className={size === 'large' ? 'loader' : 'small-loader'}></span>
  );
};