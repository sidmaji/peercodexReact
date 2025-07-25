// src/hooks/useTheme.js - Create this new file for the hook
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext.jsx'

const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export default useTheme
