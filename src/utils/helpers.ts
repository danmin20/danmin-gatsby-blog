import PostClass from '../models/post';
import { MarkdownRemark } from '../type';

export const getUniqueCategories = (posts: PostClass[]): string[] => {
  const categorySet = new Set<string>();
  posts.forEach(({ categories }) => categories.forEach((category) => categorySet.add(category)));
  return [...categorySet].sort((a, b) => {
    if (a === 'featured') return -1;
    if (b === 'featured') return 1;
    return 0;
  });
};
