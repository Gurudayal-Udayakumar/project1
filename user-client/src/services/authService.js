import { API_BASE_URL } from "../config/env";
const API = `${API_BASE_URL}/api/auth`

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    return await res.json()
  } catch (error) {
    return { message: 'Network error. Please try again.' }
  }
}

export const registerUser = async (data) => {
  try {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return await res.json()
  } catch (error) {
    return { message: 'Network error. Please try again.' }
  }
}

