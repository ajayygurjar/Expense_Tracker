const LoginPage=()=>{

    return (<>
    <h1>Login Page</h1>

    <form>

        <label htmlFor="email">Email:</label>
        <input type="email" id="email"  required/>
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password"  required/>
        <button>Submit</button>
    </form>
    
    </>)
}


export default LoginPage;