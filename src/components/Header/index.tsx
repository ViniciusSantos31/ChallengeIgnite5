import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <Link href="/">
      <div className={styles.logoContainer}>
        <img src="/icons/logo_spacetraveling.svg" alt="logo" />
      </div>
    </Link>
  );
}
