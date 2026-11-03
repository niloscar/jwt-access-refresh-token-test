import styles from './Loading.module.css'

export default function Loading({ message }: { message?: string }) {
  return (
    <span className={styles.loading}>
      {message && message}
      <span className={styles.ellipsis} />
    </span>
  )
}
