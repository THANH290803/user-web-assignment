"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"

interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "SET_LOADING"; payload: boolean }

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      }

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }

    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const user = JSON.parse(userData)
          dispatch({ type: "LOGIN_SUCCESS", payload: user })
        } catch (error) {
          localStorage.removeItem("user")
        }
      }
      dispatch({ type: "SET_LOADING", payload: false })
    }

    checkAuth()
  }, [])

  const login = async (email: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: 1,
        name: "Nguyễn Văn A",
        email,
        phone: "0123456789",
        address: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
        avatar: "/placeholder.svg?key=user",
      }

      localStorage.setItem("user", JSON.stringify(mockUser))
      dispatch({ type: "LOGIN_SUCCESS", payload: mockUser })
      return true
    } catch {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const register = async (name: string, email: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now(),
        name,
        email,
        avatar: "/placeholder.svg?key=user",
      }

      localStorage.setItem("user", JSON.stringify(newUser))
      dispatch({ type: "LOGIN_SUCCESS", payload: newUser })
      return true
    } catch {
      dispatch({ type: "LOGIN_FAILURE" })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    dispatch({ type: "LOGOUT" })
  }

  const updateProfile = (data: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...data }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      dispatch({ type: "UPDATE_PROFILE", payload: data })
    }
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
