import { FC } from 'react';
import classNames from 'classnames';

import './avatar.styles.scss';

export type AvatarProps = {
  imgSrc: string;
  size?: 'sm' | 'md' | 'lg';
  altTxt: string;
  onClick?: () => void;
};

const Avatar: FC<AvatarProps> = (props) => {
  const { size = 'sm', imgSrc, altTxt, onClick } = props;

  const renderContent = () => {
    if (imgSrc) {
      return (
        <img
          className='avatar_img'
          src={imgSrc}
        />
      );
    }

    return <div className='avatar_alt'>{altTxt}</div>;
  };

  return (
    <div
      className={classNames(`btt-avatar`, size, onClick && 'pointer')}
      onClick={onClick}
    >
      {renderContent()}
    </div>
  );
};

export default Avatar;
