import { useEffect, useState } from 'react'
import { getHealth } from './api/healthApi'
import { signIn } from './api/authApi'
import Loading from './components/Loading'

import styles from './App.module.css'

export default function App() {
  const [health, setHealth] = useState<string | null>(null)
  const [backendResponse, setBackendResponse] = useState<string | null>(null)
  const [loadingBackendResponse, setLoadingBackendResponse] =
    useState<boolean>(false)

  const [cookieMessage, setCookieMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getHealth()
        setHealth(data.status)
      } catch (error) {
        console.error('Error fetching health:', error)
        setHealth('Error')
      }
    }

    fetchHealth()
  }, [])

  async function handleSignIn() {
    setLoadingBackendResponse(true)
    setCookieMessage(null)

    try {
      const response = await signIn({
        email: 'user@example.com',
        password: 'password'
      })

      const simulatedDelay = 1000
      await new Promise((resolve) => setTimeout(resolve, simulatedDelay))

      setBackendResponse(JSON.stringify(response, null, 2))

      const cookie = document.cookie

      if (cookie) {
        setCookieMessage(cookie)
      } else {
        setCookieMessage('No cookies accessible to JavaScript')

        setTimeout(() => {
          setCookieMessage(null)
        }, 1000)
      }
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setLoadingBackendResponse(false)
    }
  }

  function handleProtectedPage() {
    // Implement navigation to protected page logic here
    console.log('Protected page button clicked')
  }

  function handleRefresh() {
    // Implement refresh logic here
    console.log('Refresh button clicked')
  }

  function handleSignOut() {
    // Implement sign-out logic here
    console.log('Sign out button clicked')
  }

  return (
    <>
      <h1>Hello World</h1>

      <p>
        API Health:{' '}
        <span
          className={health === 'ok' ? styles.apiHealthy : styles.apiUnhealthy}
        >
          {health?.toUpperCase()}
        </span>
      </p>

      {health === 'ok' && (
        <>
          <nav className={styles.nav}>
            <button onClick={handleSignIn}>Sign in</button>
            <button onClick={handleProtectedPage}>Protected page</button>
            <button onClick={handleRefresh}>Refresh</button>
            <button onClick={handleSignOut}>Sign out</button>
          </nav>

          {(loadingBackendResponse || backendResponse) && (
            <section className={styles.codeSection}>
              <label htmlFor="backendResponse">Backend Response:</label>
              <pre>
                <code id="backendResponse">
                  {loadingBackendResponse
                    ? <Loading message="Loading" />
                    : backendResponse}
                </code>
              </pre>
            </section>
          )}

          {(loadingBackendResponse || cookieMessage) && (
            <section
              className={`${styles.codeSection} ${
                cookieMessage === 'No cookies accessible to JavaScript'
                  ? styles.fadeOut
                  : ''
              }`}
            >
              <label htmlFor="cookieResponse">Cookie:</label>
              <pre>
                <code id="cookieResponse">
                  {loadingBackendResponse
                    ? <Loading message="Loading" />
                    : cookieMessage}
                </code>
              </pre>
            </section>
          )}
        </>
      )}
    </>
  )
}
