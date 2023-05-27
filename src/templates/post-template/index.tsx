import { graphql } from 'gatsby';
import React from 'react';

import BuyMeACoffee from '../../components/buyMeACoffee';
import PostHeader from '../../components/postHeader';
import PostNavigator from '../../components/postNavigator';
import Seo from '../../components/seo';
import Utterances from '../../components/utterances';
import Layout from '../../layout';
import PostClass from '../../models/post';
import { Post, SiteMetadata } from '../../type';
import * as S from './styled';

type PostTemplateProps = {
  location: Location;
  data: { prev: Post; next: Post; cur: Post; site: { siteMetadata: SiteMetadata }; markdownRemark: Post };
};

const PostTemplate: React.FC<PostTemplateProps> = ({ location, data }) => {
  const curPost = new PostClass(data.cur);
  const prevPost = data.prev && new PostClass(data.prev);
  const nextPost = data.next && new PostClass(data.next);
  const utterancesRepo = data.site.siteMetadata.comments.utterances.repo;

  return (
    <Layout location={location}>
      <Seo title={`개발자 단민 | ${curPost?.title}`} description={curPost?.excerpt} />
      <PostHeader post={curPost} />
      <S.PostContent>
        <div className='markdown' dangerouslySetInnerHTML={{ __html: curPost.html }} />
      </S.PostContent>
      <S.BuyMeACoffeeWrapper>
        <div>👇 도움이 되셨다면 👇</div>
        <BuyMeACoffee />
      </S.BuyMeACoffeeWrapper>
      <PostNavigator prevPost={prevPost} nextPost={nextPost} />
      <Utterances repo={utterancesRepo} path={curPost.slug} />
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
