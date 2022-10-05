import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function Register() {
  const [user, setUser] = useState({
    username:'',
    email: '',
    password: ''
  })

  const onChangeInput = (e) => {
    const {name, value} = e.target
    setUser({...user, [name]:value})
  }

  const registerSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/user/register', {...user})

      setUser({username: '', email: '', password: ''})

      toast.success('Register successfully')

    } catch (error) {
      toast.error(error.response.data.msg)
    }
  }

  return (
    <div className="login-page">
        <form onSubmit={registerSubmit}>
          <h2>Login</h2>
          <input type="text" name="username" 
          placeholder="Name" value={user.username} 
          onChange={onChangeInput}
          required
          />

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
            <button type="submit">Register</button>
            <Link to="/login">Login</Link>
          </div>
        </form>
    </div>
  )
}

export default Register