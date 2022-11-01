import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Author } from '../type';

type BioProps = {
  author: Author;
};

const Bio: React.FC<BioProps> = ({ author }) => {
  return (
    <div className='bio'>
      <StaticImage
        className='bio-avatar'
        layout='fixed'
        formats={['auto', 'webp', 'avif']}
        src='../images/profile-pic.png'
        width={50}
        height={50}
        quality={95}
        alt='Profile picture'
      />
    </div>
  );
};

export default Bio;
