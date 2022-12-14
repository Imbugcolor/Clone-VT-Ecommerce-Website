import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const onChangeInput = (e) => {
    const {name, value} = e.target
    setUser({...user, [name]:value})
  }

  const loginSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/user/login', {...user})

      localStorage.setItem('firstLogin', true)

      toast.success('Login successfully')
      window.location.href = "/"

    } catch (error) {
      toast.error(error.response.data.msg)
    }
  }

  return (
    <div className="login-page">
        <form onSubmit={loginSubmit}>
          <h2>Login</h2>
          <input type="email" name="email" 
          placeholder="Email" value={user.email} 
          onChange={onChangeInput}
          required
          />

          <input type="password" name="password" 
          placeholder="Password" value={user.password} 
          autoComplete="on"
          onChange={onChangeInput}
          required
          />

          <div className="row">
            <button type="submit">Login</button>
            <Link to="/register">Register</Link>
          </div>
        </form>
    </div>
  )
}

export default Login