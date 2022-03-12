import { GetStaticProps } from 'next';

import { FaCalendar, FaUser } from 'react-icons/fa';
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

export default function Home(): JSX.Element {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img src="/icons/logo_spacetraveling.svg" alt="logo" />
        </div>
        <div className={styles.content}>
          <div className={styles.postContent}>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfo}>
              <div className={styles.postDate}>
                <FaCalendar /> 15 Mar 2021
              </div>
              <div className={styles.postAuthor}>
                <FaUser />
                Joseph Oliveira
              </div>
            </div>
          </div>
          <div className={styles.postContent}>
            <h1>Como utilizar hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfo}>
              <div className={styles.postDate}>
                <FaCalendar /> 15 Mar 2021
              </div>
              <div className={styles.postAuthor}>
                <FaUser />
                Joseph Oliveira
              </div>
            </div>
          </div>
        </div>
        <div className={styles.showMore}>
          <a>Carregar mais posts</a>
        </div>
      </div>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
