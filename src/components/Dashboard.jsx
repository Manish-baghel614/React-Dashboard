import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {

  const navigate = useNavigate();

  const [errors , setErrors] = useState({});

  const [logOuting, setLoggingOut] = useState(false);

  const [User, setUser] = useState('');

  const [editedData, setEditedData] = useState({

    FirstName: '',
    Email: '',
    DOB: ''

  }
  )

  const [isEditing, setIsEditing] = useState(false)


  useEffect(() => {

    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
      navigate("/")
    } else {

      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      setEditedData({
        FirstName: User.FirstName,
        Email: User.Email,
        DOB: User.DOB
      })


    }

  }, [User.FirstName, User.Email, User.DOB, navigate])


  const handleLogout = () => {
    setLoggingOut(true);
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    setLoggingOut(false)
    navigate("/login")
  }

  const handleChange = (e) => {

    console.log(e.target);
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value


    }))
  }


  const validate = () => {

    const newErrors = {};
    if (!editedData.FirstName) {
      newErrors.FirstName = "First name is required";
    }

    if (!editedData.Email) {
      newErrors.Email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editedData.Email)) {
      newErrors.Email = "Email is invalid";
    }

    if (!editedData.DOB) {
      newErrors.DOB = "Date of Birth is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  }




  const handleEditSave = async () => {
    setUser(editedData)

    if (!validate()) {
      return;
    }

    console.log(editedData);



    const AIRTABLE_API_KEY = import.meta.env.VITE_PERSONAL_ACCESS_TOKEN;
    const BASE_ID = import.meta.env.VITE_BASE_ID;
    const TABLE_NAME = import.meta.env.VITE_TABLE_NAME;
    


    //checking if user exists with same email
    const filterFormula = `({Email} = '${editedData.Email}')`;
    const checkURL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const checkResponse = await axios.get(checkURL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`
      }
    })

    if (checkResponse.data.records.length > 0){
       alert("User with this email already exists!");
       setIsEditing(false);
        return;

    } 


    // Update the record in Airtable
    const URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${localStorage.getItem("userId")}`;

    const response = await axios.patch(URL, {
      "fields": {
        "FirstName": editedData.FirstName,
        "Email": editedData.Email,
        "DOB": editedData.DOB
      }
    }
      , {
        headers: {
          "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json"
        }
      })

    console.log(response);


    localStorage.setItem("user", JSON.stringify(editedData))

    setIsEditing(false)


  }





  return (
    <div className="min-h-screen bg-gray-200 flex ">
      <div className='w-1/5 bg-gray-800 shadow-md p-5 flex flex-col justify-between '>
        <div>
          <h1 className='text-2xl font-semibold mb-8 text-white'> Dashboard </h1>
          <ul className='space-y-4'>
            <li className='cursor-pointer  hover:underline hover:text-blue-500 text-lg font-semibold text-white' >Profile</li>
            <li className='cursor-pointer hover:underline hover:text-blue-500 text-lg font-semibold text-white' >Settings</li>
          </ul>

        </div>

        
         {/* Divider Line */}
        <div className="border-t border-gray-500 opacity-40 mt-75 mb-4"></div>
        <button
          className='bg-red-500 rounded py-2 px-3 text-white active:scale-90 hover:bg-red-600'
          disabled={logOuting}
          onClick={handleLogout}>
          {logOuting ? 'Logging out...' : 'Logout'}
        </button>

        
      </div>


      {/* Main Conatiner */}
      <div className=' flex-1  p-10 '>
        {/* Top Container */}
        <div className=' p-6 mb-6 shadow-md rounded-xl bg-white'>
          <h1 className='text-2xl font-semibold '>Welcome, {User.FirstName ? User.FirstName : "User"} 👋

          </h1>

          <p
            className="text-gray-500 mt-2">
            Here’s your dashboard overview.
          </p>

        </div>

       
        {/* profile Card */}

        

        <div className=' w-1/2 p-6 shadow-md rounded-xl bg-white flex justify-between'>
          <div >
          <h3 className='text-xl font-semibold mb-6 '>Profile Info</h3>

          {isEditing ? (
            <>
              <h4 className="text-gray-500 mt-1 mb-2" >Edit Details</h4>
              <TextField id="outlined-basic" label="Name" variant="outlined" margin='normal'
                type='text'
                name='FirstName'
                error={errors.FirstName}
                helperText={errors.FirstName}
                value={editedData.FirstName}
                className='border p-2 w-full mb-3 rounded'
                placeholder='name'
                onChange={(e) => {
                  handleChange(e)

                }}


              />

              <TextField id="outlined-basic" label="Email" variant="outlined" margin='normal'
                type="text"
                name='Email'
                error={errors.Email}
                helperText={errors.Email}
                value={editedData.Email}
                className='border p-2 w-full mb-3 rounded'
                placeholder='email'
                onChange={(e) => {
                  handleChange(e)
                }}

              />

              <TextField id="outlined-basic" label="DOB" variant="outlined" margin='normal'
                type="date"
                name='DOB'
                error={errors.DOB}
                helperText={errors.DOB}
                value={editedData.DOB}
                className='border p-2 w-full mb-3 rounded'
                onChange={(e) => {
                  handleChange(e)
                }}

              />

              <button
                className='mt-4 bg-blue-500 text-white px-3 py-1 rounded active:scale-95 hover:bg-blue-600' 
                onClick={
                  handleEditSave
                }


              >
                Save
              </button>

            </>

          )

            : (
              <>
                <p><span className='font-medium'>Name:</span> {User.FirstName}</p>
                <p><span className='font-medium'>Email:</span> {User.Email}</p>
                <p><span className='font-medium'>Dob:</span> {User.DOB}</p>
                <button

                  className="mt-4 bg-blue-500 text-white px-3 py-1 rounded active:scale-95 hover:bg-blue-600"
                  onClick={() => {
                    setIsEditing(true)

                  }

                  }
                >
                  Edit Profile
                </button>

              </>

            )}
            </div>

           <div className='h-30 w-30 rounded-full mt-4 mr-15 '>

            <img src={`https://ui-avatars.com/api/?name=${User.FirstName}&background=random&size=128`} alt="Profile" className='rounded-full' />
           </div>

 

        </div>
              

        




      </div>

    </div>
  )
}

export default Dashboard
