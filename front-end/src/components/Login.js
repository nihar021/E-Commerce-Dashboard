import React ,{useState,useEffect}from 'react'
import { useNavigate} from 'react-router-dom';

   const Login = () => {
    const [email,setEmail] =useState('');
    const [password,setPassword] =useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        const auth = localStorage.getItem("user");
        if(auth){
            navigate('/');
        }
    },[navigate]);

    const handleLogin = async () => {
        try {
          console.warn("email,password",email,password)
          let res = await fetch("http://localhost:3000/login", {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!res.ok) {
              const errorText = await res.text();
              console.error('Error response from server:', errorText);
              throw new Error(`HTTP error! status: ${res.status}`);
            }


          const result = await res.json();
          console.warn(result);

          if (result.auth) {
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", JSON.stringify(result.auth));

            navigate('/');
          } else {
            alert("Please enter correct details");
          }
        } catch (error) {
          console.error("Login failed:", error);
          alert("Login failed. Please try again later.");
        }
     }

  return (
    <div className='login'> 
        <h1>Login</h1>
       <input type='text' 
              className='inputBox'
              placeholder='Enter email'
              onChange={(e)=>setEmail(e.target.value)} 
              value={email}
       />
       <input type='password' 
              className='inputBox' 
              placeholder='Enter password'
              onChange={(e)=>setPassword(e.target.value)} 
              value={password}
       />
       <button onClick={handleLogin} className="appButton" type='button'>Log in</button>
    </div>
  )
}

export default Login  