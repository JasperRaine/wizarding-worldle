import { Provider } from 'react-redux'
import { store } from './index'
import { useEffect } from 'react'
import { useAppDispatch } from './hooks'
import { loadGameState } from './slices/gameSlice'
import { loadAppState } from './slices/appSlice'
import { loadGameStateFromStorage, loadAppStateFromStorage } from './middleware/persistence'

// Component to handle initial state loading
function StateLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Load app state from localStorage
    const savedAppState = loadAppStateFromStorage()
    if (savedAppState) {
      dispatch(loadAppState(savedAppState))
    }

    // Load game state from localStorage
    const savedGameState = loadGameStateFromStorage()
    if (savedGameState) {
      dispatch(loadGameState(savedGameState))
    }
  }, [dispatch])

  return <>{children}</>
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StateLoader>
        {children}
      </StateLoader>
    </Provider>
  )
}
