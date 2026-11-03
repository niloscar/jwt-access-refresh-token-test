import { useEffect, useState } from 'react'
import { getHealth } from './api/healthApi'
import { signIn } from './api/authApi'
import Loading from './components/Loading'

import styles from './App.module.css'

const INITIAL_CLICKED_BUTTON_STATE = {
  signIn: false,
  protectedPage: false,
  refresh: false,
  signOut: false
}

const CLICKED_BUTTON_TIMEOUT = 1500

export default function App() {
  const [health, setHealth] = useState<string | null>(null)
  const [clickedButton, setClickedButton] = useState<Record<string, unknown>>(
    INITIAL_CLICKED_BUTTON_STATE
  )
  const [ backendResponse, setBackendResponse] = useState<string | null>(null)
  const [loadingBackendResponse, setLoadingBackendResponse] = useState<boolean>(false) 

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

  function handleClickedButton(buttonName: string) {
    setClickedButton((prevState) => ({
      ...prevState,
      [buttonName]: true
    }))

    setTimeout(() => {
      setClickedButton((prevState) => ({
        ...prevState,
        [buttonName]: false
      }))
    }, CLICKED_BUTTON_TIMEOUT)
  }

  async function handleSignIn() {
    setLoadingBackendResponse(true)

    try {
      const response = await signIn({ email: 'user@example.com', password: 'password' })
      const simulatedDelay = 1000 // Simulate a delay of 1 second
      await new Promise((resolve) => setTimeout(resolve, simulatedDelay))
      setBackendResponse(JSON.stringify(response, null, 2))
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setLoadingBackendResponse(false)
    }
  }

  function handleProtectedPage() {
    // Implement navigation to protected page logic here
    console.log('Protected page button clicked')

    handleClickedButton('protectedPage')
  }

  function handleRefresh() {
    // Implement refresh logic here
    console.log('Refresh button clicked')

    handleClickedButton('refresh')
  }

  function handleSignOut() {
    // Implement sign-out logic here
    console.log('Sign out button clicked')

    handleClickedButton('signOut')
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

          {clickedButton.signIn && <p>Sign in button clicked</p>}
          {clickedButton.protectedPage && <p>Protected page button clicked</p>}
          {clickedButton.refresh && <p>Refresh button clicked</p>}
          {clickedButton.signOut && <p>Sign out button clicked</p>}


          {(loadingBackendResponse || backendResponse) && (
          <section className={styles.codeSection}>
            <label htmlFor="backendResponse">Backend Response:</label>
            <pre>
              <code id="backendResponse">
                {loadingBackendResponse ? <Loading message="Loading" /> :  backendResponse}
              </code>
            </pre>
          </section>
          )}
        </>
      )}
    </>
  )
}
