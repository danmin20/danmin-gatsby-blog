import React, { useState } from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../layout';
import Seo from '../../components/seo';
import Utterances from '../../components/utterances';
import { Post, SiteMetadata } from '../../type';
import PostClass from '../../models/post';
import PostHeader from '../../components/postHeader';
import PostNavigator from '../../components/postNavigator';
import * as S from './styled';

type PostTemplateProps = {
  location: Location;
  data: { prev: Post; next: Post; cur: Post; site: { siteMetadata: SiteMetadata }; markdownRemark: Post };
};

const PostTemplate: React.FC<PostTemplateProps> = ({ location, data }) => {
  const [viewCount, setViewCount] = useState(0);

  const curPost = new PostClass(data.cur);
  const prevPost = data.prev && new PostClass(data.prev);
  const nextPost = data.next && new PostClass(data.next);
  const { siteUrl, comments } = data.site?.siteMetadata;
  const utterancesRepo = comments?.utterances?.repo;

  React.useEffect(() => {
    if (!siteUrl) return;
    const namespace = siteUrl.replace(/(^\w+:|^)\/\//, '');
    const key = curPost.slug.replace(/\//g, '');

    fetch(
      `https://api.countapi.xyz/${process.env.NODE_ENV === 'development' ? 'get' : 'hit'}/${namespace}/${key}`,
    ).then(async (result) => {
      const data = await result.json();
      setViewCount(data.value);
    });
  }, [siteUrl, curPost.slug]);

  return (
    <Layout location={location}>
      <Seo title={curPost?.title} description={curPost?.excerpt} />
      <PostHeader post={curPost} viewCount={viewCount} />
      <S.PostContent>
        <div className='markdown' dangerouslySetInnerHTML={{ __html: curPost.html }} />
      </S.PostContent>
      <PostNavigator prevPost={prevPost} nextPost={nextPost} />
      {utterancesRepo && <Utterances repo={utterancesRepo} path={curPost.slug} />}
    </Layout>
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query ($slug: String, $nextSlug: String, $prevSlug: String) {
    cur: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt(pruneLength: 500, truncate: true)
      frontmatter {
        date(formatString: "YYYY.MM.DD")
        title
        categories
        author
        emoji
      }
      fields {
        slug
      }
    }

    next: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY.MM.DD")
        title
        categories
        author
        emoji
      }
      fields {
        slug
      }
    }

    prev: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY.MM.DD")
        title
        categories
        author
        emoji
      }
      fields {
        slug
      }
    }

    site {
      siteMetadata {
        siteUrl
        comments {
          utterances {
            repo
          }
        }
      }
    }
  }
`;
