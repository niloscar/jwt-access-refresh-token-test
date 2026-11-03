import { useEffect, useState } from 'react'
import { getHealth } from './api/healthApi'
import { signIn, signOut, getProtectedPage, refreshToken } from './api/authApi'
import { isAxiosError } from 'axios'
import useTheme from './hooks/useTheme'
import ThemeSwitch from './components/ThemeSwitch'
import Loading from './components/Loading'

import styles from './App.module.css'

export default function App() {
  const [health, setHealth] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [backendResponse, setBackendResponse] = useState<string | null>(null)
  const [loadingBackendResponse, setLoadingBackendResponse] = useState<boolean>(false)
  const [cookieMessage, setCookieMessage] = useState<string | null>(null)
  
  const { theme, toggleTheme } = useTheme()

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

  function checkCookies() {
    setCookieMessage(document.cookie || 'No cookies accessible to JavaScript')
  }

  async function handleSignIn() {
    setLoadingBackendResponse(true)

    try {
      const response = await signIn({
        email: 'user@example.com',
        password: 'password'
      })

      await delay(1000)

      setResponseStatus(response.status)
      setBackendResponse(JSON.stringify(response.data, null, 2))
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setResponseStatus(error.response.status)
        setBackendResponse(JSON.stringify(error.response.data, null, 2))
      } else {
        console.error('Error signing in:', error)
      }
    } finally {
      checkCookies()
      setLoadingBackendResponse(false)
    }
  }

  async function handleProtectedPage() {
    setLoadingBackendResponse(true)

    try {
      const response = await getProtectedPage()

      await delay(1000)

      setResponseStatus(response.status)
      setBackendResponse(JSON.stringify(response.data, null, 2))
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setResponseStatus(error.response.status)
        setBackendResponse(JSON.stringify(error.response.data, null, 2))
      } else {
        console.error('Error accessing protected page:', error)
      }
    } finally {
      checkCookies()
      setLoadingBackendResponse(false)
    }
  }

  async function handleRefresh() {
    setLoadingBackendResponse(true)

    try {
      const response = await refreshToken()

      await delay(1000)

      setResponseStatus(response.status)
      setBackendResponse(JSON.stringify(response.data, null, 2))
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setResponseStatus(error.response.status)
        setBackendResponse(JSON.stringify(error.response.data, null, 2))
      } else {
        console.error('Error refreshing token:', error)
      }
    } finally {
      checkCookies()
      setLoadingBackendResponse(false)
    }
  }

  async function handleSignOut() {
    setLoadingBackendResponse(true)

    try {
      const response = await signOut()

      await delay(1000)

      setResponseStatus(response.status)
      setBackendResponse(JSON.stringify(response.data, null, 2))
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setResponseStatus(error.response.status)
        setBackendResponse(JSON.stringify(error.response.data, null, 2))
      } else {
        console.error('Error signing out:', error)
      }
    } finally {
      checkCookies()
      setLoadingBackendResponse(false)
    }
  }

  return (
    <>
      <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />

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
                  {loadingBackendResponse ? (
                    <Loading message="Loading" />
                  ) : (
                    backendResponse
                  )}
                </code>

                {!loadingBackendResponse && responseStatus !== null && (
                  <span
                    className={`${styles.responseStatus} ${
                      responseStatus >= 200 && responseStatus < 300
                        ? styles.apiHealthy
                        : styles.apiUnhealthy
                    }`}
                  >
                    {responseStatus}
                  </span>
                )}
              </pre>
            </section>
          )}

          {(loadingBackendResponse || cookieMessage) && (
            <section className={styles.codeSection}>
              <label htmlFor="cookieResponse">Cookie:</label>
              <pre>
                <code id="cookieResponse">
                  {loadingBackendResponse ? (
                    <Loading message="Loading" />
                  ) : (
                    cookieMessage
                  )}
                </code>
              </pre>
            </section>
          )}
        </>
      )}
    </>
  )
}

async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
