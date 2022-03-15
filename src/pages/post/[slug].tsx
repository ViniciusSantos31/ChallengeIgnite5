import Prismic from '@prismicio/client';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FaCalendar, FaClock, FaUser } from 'react-icons/fa';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const allText = post.data.content.reduce((acc, curr) => {
    return acc + RichText.asText(curr.body);
  }, '');
  const timeToRead = Math.ceil(allText.split(' ').length / 200);

  return (
    <>
      {!router.isFallback ? (
        <div className={commonStyles.container}>
          <Header />
          <div className={styles.banner}>
            <img alt="banner rockeseat" src={post?.data.banner.url} />
          </div>
          <div className={commonStyles.content}>
            <h1 className={styles.title}>{post?.data.title}</h1>
            <div className={commonStyles.postInfo}>
              <div>
                <FaCalendar />
                <p>
                  {format(
                    new Date(post?.first_publication_date),
                    'dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  )}
                </p>
              </div>
              <div>
                <FaUser />
                {post?.data.author}
              </div>
              <div>
                <FaClock />
                {timeToRead} min
              </div>
            </div>
            <div className={styles.postContent}>
              {post?.data.content.map(content => (
                <div key={content.heading}>
                  <div className={styles.heading}>{content.heading}</div>
                  {content.body.map(b => (
                    <div className={styles.body} key={b.text}>
                      {b.text}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.loadingContainer}>Carregando...</div>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'post')
  );

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const { slug } = context.params;
  const response = await prismic.getByUID('post', String(slug), {});

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content?.map(block => ({
        heading: block.heading,
        body: block.body,
      })),
    },
  };

  return {
    props: {
      post,
    },
  };
};
