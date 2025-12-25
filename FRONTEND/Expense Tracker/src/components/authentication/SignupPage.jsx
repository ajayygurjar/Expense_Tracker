import { useState } from "react";

const SignupPage=()=>{

    const [signUpData,setSignUpData]=useState({
        name:'',
        email:'',
        password:''
    })

    const changeHandler=(e)=>{
        const {name,value}=e.target;

        setSignUpData((prev)=>({
            ...prev,[name]:value
        }))
    }

    const handleSignup=(e)=>{
        e.preventDefault();
        console.log(signUpData)

    }
    return (
    <>
    <h1>Signup Page</h1>
    <form onSubmit={handleSignup}>
        <label htmlFor='name'>Name</label>
        <input type="text" id="name" name="name"  value={signUpData.name} onChange={changeHandler} required/>
        <label htmlFor='email'>Email</label>
        <input type="email" id="email" name="email" value={signUpData.email} onChange={changeHandler} required/>
        <label htmlFor='password'>Password</label>
        <input type="password" id="password" name="password" value={signUpData.password} onChange={changeHandler} required />
        <button>Submit</button>
    </form>
    </>
    )
}

export default SignupPage;