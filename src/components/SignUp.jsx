import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";


const SignUp = () => {

    const navigate = useNavigate()

    const [errors, setErrors] = useState({});


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        password: ''


    })

    const [submittedData, setSubmittedData] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

    }




    //Handling Submitted Form
    const handleSubmittedData = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }


        

        //Airtable Api Details
        const PERSONAL_ACCESS_TOKEN = process.env.REACT_APP_PERSONAL_ACCESS_TOKEN;
        const BASE_ID = process.env.REACT_APP_BASE_ID;
        const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;
        const URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

        console.log(URL);


        //Airtable Data
        const airtableData = {
            "records": [
                {
                    "fields": {
                        "Email": formData.email,
                        "FirstName": formData.firstName,
                        "LastName": formData.lastName,
                        "DOB": formData.dob,
                        "Password": formData.password

                    }
                }
            ]

        }


        // Check if user with the same email already exists
        const filterFormula = `({Email} = '${formData.email}')`;
        const checkURL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;

        const checkResponse = await axios.get(checkURL, {
            
            headers: {
                Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`

            
        }

        });

        if (checkResponse.data.records.length > 0) {
            alert("User with this email already exists!");
            return;
        }

        //Creating record in Airtable

        const response = await axios.post(URL, airtableData, {

            headers: {
                Authorization: `Bearer ${PERSONAL_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',


            },
        });

        response.data.records.length > 0 && localStorage.setItem("user", JSON.stringify(response.data.records[0].fields))
        response.data.records.length > 0 && localStorage.setItem("userId", response.data.records[0].id)
    
        alert("Account created successfully!");





        navigate("/dashboard");


        //Data stored Succesfully
        console.log('Success :', response.data);

        // Reset Form 
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            dob: '',
            password: ''
        }
        )

        //Storing Form Data in SubmittedData
        setSubmittedData(formData)

    }


    const validate = () => {
        let newErrors = {};
        if (!formData.firstName) {
            newErrors.firstName = "First Name is required";
        }
        if (!formData.lastName) {
            newErrors.lastName = "Last Name is required";
        }
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.dob) {
            newErrors.dob = "Date of Birth is required";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }




    return (
        <div className=' h-150 flex  p-10 justify-center bg-blue-400'>
             
                <form className=' p-10  justify-center  flex flex-col gap-4 bg-white shadow-2xl shadow-black rounded '>

                    <h1
                     className='text-4xl font-bold text-center text-blue-400 '>
                     Lets get started !
                    </h1>
                    <div
                     className="flex  gap-2 ">
                        <TextField id="outlined-basic" label="First Name" variant="outlined"
                        name="firstName"
                        type="text"
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        value={formData.firstName}
                        onChange={(e) => {
                            handleChange(e)
                            }
                            }
                        />

                       <TextField id="outlined-basic" label="Last Name" variant="outlined"
                            name="lastName"
                            type="text"
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            value={formData.lastName}
                            onChange={(e) => {
                                handleChange(e)
                            }
                            }
                        />
                    </div>

                    {/* /Email Input field */}
                    <TextField id="outlined-basic" label="Email" variant="outlined"
                        name="email"
                        type='email'
                        error={!!errors.email}
                        helperText={errors.email}
                        value={formData.email}
                        onChange={(e) => {
                            handleChange(e)
                        }
                        }


                    />

                    {/* Dob Input field */}
                    <TextField id="outlined-basic"  variant="outlined"
                        name="dob"
                        type='date'
                        error={!!errors.dob}
                        helperText={errors.dob}
                        value={formData.dob}
                        onChange={(e) => {
                            handleChange(e)
                        }
                        }
                    />

                    {/* Password Input field */}
                    <TextField id="outlined-basic" label="Password" variant="outlined"
                        name="password"
                        type='password'
                        error={!!errors.password}
                        helperText={errors.password}
                        value={formData.password}
                        onChange={(e) => {
                            handleChange(e)
                        }
                        }

                    />

                    {/* Sign Up Button */}
                    <Button variant="contained" 
                        onClick={(e) => {
                            handleSubmittedData(e)
                        }}
                        >
                        Sign Up
                    </Button>

                    {/* Already have account  */}
                    <h4 className="text-center">Already have an account?
                        <Link className='text-blue-400 underline'
                            to='/login'> Login </Link>
                    </h4>
                </form>
           
        </div>

    )
}

export default SignUp
