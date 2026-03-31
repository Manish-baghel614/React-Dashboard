import React from 'react'
import { Link, Navigate, useNavigate, useFormAction } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'





const Login = () => {

    const [errors, setErrors] = useState({});

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const [isLogging , setIsLogging] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))

    }

    const handleLogin = async (e) => {
        e.preventDefault();

            if (!validate()) {
                return;
            }

        setIsLogging(true);
        //Airtable Api Details
        const PERSONAL_ACCESS_TOKEN = process.env.REACT_APP_PERSONAL_ACCESS_TOKEN;
        const BASE_ID = process.env.REACT_APP_BASE_ID;
        const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

        //Filtring based on Email 
        const filterFormula = `({Email} = '${loginData.email}')`;
        const URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;

        console.log(URL);


        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`

            }
        }

        )

        const records = response.data.records;



        if (records.length === 0) {
            alert("User not found!")
            setIsLogging(false);
            return

        }


        console.log(records[0]);

        const user = records[0].fields;

        const userId = records[0].id;

        console.log(user.password, loginData.password);


        if (user.Password === loginData.password) {
            console.log("Login Successfully...");
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('userId', userId)
            navigate("/dashboard")

        } else {
            alert("Incorrect password!");

        }

            setIsLogging(false);
    }

    const validate = () => {
        let newErrors = {};

        if (!loginData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!loginData.password) {
            newErrors.password = "Password is required";
        } else if (loginData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    }





    return (
        <div className=' h-150 flex  p-10 justify-center bg-blue-400 '>

            {/*Login form ........  */}
            <form onSubmit={(e) => {
                handleLogin(e)
            }}
                className='w-1/2 p-10 flex flex-col gap-8  bg-white shadow-2xl shadow-black rounded '>

                <h1
                    className='text-4xl text-center font-bold text-blue-400 '>
                    Welcome Back !
                </h1>

                <h4
                    className='text-gray-400 '>
                    Please enter your details.
                </h4>

                <TextField id="outlined-basic" label="Email" variant="outlined"

                    onChange={(e) => {
                        handleChange(e)
                    }
                    }
                    type='email'
                    value={loginData.email}
                    name='email'
                    error={!!errors.email}
                    helperText={errors.email}
                    className=' border-2 rounded border-gray-300 py-2 p-2'
                />

                <TextField id="outlined-basic" label="password" variant="outlined"
                    required={true}
                    type='password'
                    className=' border-2 rounded border-gray-300 py-2 p-2'
                    name='password'
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    value={loginData.password}

                />



                <Button variant="contained"
                    onClick={handleLogin}
                    disabled={isLogging}

                >
                    {isLogging ? 'Logging in...' : 'Login'}
                </Button>

                <h4 className='text-center'>Don't have an account?
                    <Link className='text-blue-400 underline'
                        to='/signup'> Sign Up</Link></h4>


            </form>
        </div>
    )
}

export default Login
