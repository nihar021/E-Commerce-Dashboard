import React from "react";
import { Link ,useNavigate} from 'react-router-dom';

const Nav=()=>{
    const auth = localStorage.getItem("user");
    const navigate=useNavigate();
    const logout =()=>{
        localStorage.clear();
        navigate('/register');
    }
    return(
        <div className="nav">
            <img
            alt="logo"
            className="logo"
            src="https://w7.pngwing.com/pngs/531/417/png-transparent-anime-manga-boy-black-hair-human-boy.png"/>
           {auth ? (
            <ul className="nav-ul">
                <li><Link to="/profile"><b>Profile</b></Link></li>
                <li><Link to="/"><b>Product</b></Link></li>
                <li><Link to="/add"><b>Add Product</b></Link></li>
                <li><Link to="/update"><b>Update Product</b></Link></li>
                <li><Link onClick={logout} to='/register'><b>LOGOUT</b>  ({JSON.parse(auth).name})</Link></li>
            </ul>
            ) : (
               <ul className="nav-ul nav-right">
                 <li><Link to="/register"><b>Sign Up</b></Link></li>
                 <li><Link to="/login"><b>Log in</b></Link></li>
               </ul>
          ) }
        </div>
    )
}

export default Nav;
