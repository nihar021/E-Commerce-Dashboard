import React, { useEffect ,useState} from 'react'
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products,setProducts] =useState([])

 const getProducts = async () => {
  try {
    let result = await fetch('http://localhost:3000/products',{
      headers:{
        authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    if (!result.ok) {
      throw new Error(`HTTP error! Status: ${result.status}`);
    }
    result = await result.json(); 
    setProducts(result);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

  useEffect(()=>{
    getProducts();
  },[])

 
  
  const deleteProduct=async(id)=>{
    let result=await fetch(`http://localhost:3000/product/${id}`,{
      method:"Delete",
       headers:{
        authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    })
    result=await result.json()
    if(result) 
    {
      getProducts(); 
    }
  }
  
  const searchHandle = async (event) => {
  try {
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:3000/search/${key}`,{
        headers:{
        authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
      });
      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }
      result = await result.json();
      setProducts(result);
    } else {
      getProducts();
    }
  } catch (error) {
    console.error('Error searching products:', error);
  }
};

  return (
    <div className='product-list'>
       <h3>Product List</h3>
       <input className='search-product-box' type='text' placeholder='Search Product'
       onChange={searchHandle}
       />
       <ul>
          <li><b>S. No</b></li>
          <li><b>Name</b></li>
          <li><b>Price</b></li>
          <li><b>Category</b></li>
          <li><b>Company</b></li>
          <li><b>Operation</b></li>

       </ul>

       {
        products.length>0 ?  products.map((item,index)=>
       <ul key={item._id}>
          <li>{index+1}</li>
          <li>{item.name}</li>
          <li>$ {item.price}</li>
          <li>{item.category}</li>
          <li>{item.company}</li>
          <li>
          <button onClick={()=>deleteProduct(item._id)}>Delete</button>
          <Link to={"/update/"+item._id}>Update</Link>
          </li>
       </ul>         
        )
        :<h1>No Result Found</h1>
       }
    </div>
  )
}

export default ProductList