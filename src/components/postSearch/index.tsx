import React from 'react';
import { navigate } from 'gatsby';
import { Autocomplete, TextField } from '@mui/material';
import PostClass from '@/src/models/post';
import { SearchOutlined } from '@mui/icons-material';
import * as S from './styled';

type PostSearchProps = {
  posts: PostClass[];
};

const PostSearch: React.FC<PostSearchProps> = ({ posts }) => {
  return (
    <S.Wrapper>
      <Autocomplete
        disableClearable
        options={posts}
        onInputChange={(_event, value, reason) => {
          if (reason === 'reset' && value) {
            const item = posts.find((item) => item.title === value);
            if (!item) return;
            navigate(item.slug);
          }
        }}
        filterOptions={(options, { inputValue }) =>
          options.filter(({ title, categories }) => title.includes(inputValue) || categories.includes(inputValue))
        }
        getOptionLabel={(option) => option.title}
        renderInput={(params) => (
          <div className='search-input-wrapper'>
            <TextField
              {...params}
              className='search-input'
              variant='standard'
              size='medium'
              InputProps={{
                ...params.InputProps,
                endAdornment: <SearchOutlined className='search-icon' />,
              }}
            />
          </div>
        )}
        noOptionsText='해당하는 글이 없습니다.'
      />
    </S.Wrapper>
  );
};
export default PostSearch;
