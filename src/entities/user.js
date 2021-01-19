import React from "react"
class User extends React.Component{
    static instance = this.instance || new User();


    // state = {
    //     email: "",
    //     password: "",
    // }
    // render=()=>{return this.instance}

    // setEmail = (email)=>{this.state.email=email}
    
    constructor(props){
        super(props)
        email= ""
        password= ""
    } 
    

    setEmail=((email)=>{this.email=email}).bind(this)
    setPassword=((password)=>{this.password=password}).bind(this)

    getEmail = (()=>{
        return this.email;
    }).bind(this)

    getPassword=(()=>{return this.password}).bind(this)


}

export default User = User.instance;