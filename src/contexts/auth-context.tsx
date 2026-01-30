"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

interface User {
  id: number
  name: string
  email: string
  phoneNumber?: string
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
  register: (name: string, email: string, password: string, phone?: string, address?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isLoading: false, isAuthenticated: true }
    case "LOGIN_FAILURE":
      return { ...state, user: null, isLoading: false, isAuthenticated: false }
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false }
    case "UPDATE_PROFILE":
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null }
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

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } catch {
        localStorage.removeItem("user")
      }
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }, [])

  const login = async (email: string, password?: string, toastFromForm = false): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" })
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error("Đăng nhập thất bại")
      const data = await res.json()

      // map API user sang định dạng state
      const user: User = {
        id: data.user.id,
        name: data.user.username, // dùng đúng username từ API
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        address: data.user.address,
        avatar: data.user.avatar || "/placeholder.svg",
      }

      // ✅ LƯU TOKEN
      localStorage.setItem("token", data.token)

      // ✅ LƯU USER
      localStorage.setItem("user", JSON.stringify(user))
      dispatch({ type: "LOGIN_SUCCESS", payload: user })

      if (toastFromForm) toast.success("Đăng nhập thành công!")
      return true
    } catch {
      dispatch({ type: "LOGIN_FAILURE" })
      if (toastFromForm) toast.error("Email hoặc mật khẩu không chính xác")
      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        username: name,
        email,
        password,
        phoneNumber: phone || "",
        address: address || "",
        roleId: 2, // mặc định role khách hàng
      })

      if (res.status === 200 || res.status === 201) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.", { duration: 5000 })
        dispatch({ type: "SET_LOADING", payload: false })
        return true
      }

      toast.error("Đăng ký thất bại", { duration: 5000 })
      dispatch({ type: "SET_LOADING", payload: false })
      return false
    } catch (err) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại", { duration: 5000 })
      dispatch({ type: "SET_LOADING", payload: false })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    dispatch({ type: "LOGOUT" })
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) return

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token")

      const res = await axios.patch(
        `http://localhost:8080/api/users/${state.user.id}`,
        {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // API trả user mới
      const updatedUser: User = {
        ...state.user,
        ...res.data,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      dispatch({ type: "UPDATE_PROFILE", payload: updatedUser })

      toast.success("Cập nhật thông tin thành công!")
    } catch (error) {
      console.error(error)
      toast.error("Cập nhật thông tin thất bại")
    }
  }

  return <AuthContext.Provider value={{ state, dispatch, login, register, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
