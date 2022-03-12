/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';

import { FaCalendar, FaUser } from 'react-icons/fa';

import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img src="/icons/logo_spacetraveling.svg" alt="logo" />
        </div>
        <div className={styles.content}>
          {postsPagination?.results.map(post => (
            <Link href={`/posts/${post.uid}`}>
              <div className={styles.postContent} key={post.uid}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.postInfo}>
                  <div className={styles.postDate}>
                    <FaCalendar /> {post.first_publication_date}
                  </div>
                  <div className={styles.postAuthor}>
                    <FaUser />
                    {post.data.author}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.showMore}>
          <a>Carregar mais posts</a>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'post')
  );

  const posts = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: format(
      new Date(post.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};
