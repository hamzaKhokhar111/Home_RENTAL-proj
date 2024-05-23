import React, { useEffect, useState } from 'react';
import '../style/Register.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formdata, setFormdata] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: name === "profileImage" ? files[0] : value,
    }));
  };

  console.log(formdata);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(formdata.password === formdata.confirmPassword || formdata.confirmPassword === "");
  }, [formdata.password, formdata.confirmPassword]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const  register_form = new FormData();

      for (const key in formdata) {
        register_form.append(key, formdata[key]);
      }

      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        body: register_form,
      });

      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Registration failed", errorData.message);
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Registration failed", err.message);
      alert(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div className='register'>
      <div className='register_content'>
        <form className='register_content_form' onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder='First name'
            name='firstname'
            value={formdata.firstname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder='Last name'
            name='lastname'
            value={formdata.lastname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder='Email'
            name='email'
            value={formdata.email}
            onChange={handleChange}
            required
          />
          <input  
            type="password"
            placeholder='Password'
            name='password'
            value={formdata.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder='Confirm Password'
            name='confirmPassword'
            value={formdata.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="profileImage"
            accept='image/*'
            style={{ display: "none" }}
            required
            id="image"
            onChange={handleChange}
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match!</p>
          )}

          <label htmlFor="image">
            <img src='/addImage.png' alt="Add profile photo" />
            <p>Upload your photo</p>
          </label>

          {formdata.profileImage && (
            <img
              src={URL.createObjectURL(formdata.profileImage)}
              alt="Profile"
              style={{ maxWidth: "80px" }}
            />
          )}

          <button disabled={!passwordMatch} type='submit'>REGISTER</button>
        </form>

        <a href="/login">Already have an account? Log in Here</a>
      </div>
    </div>
  );
}

export default RegisterPage;
