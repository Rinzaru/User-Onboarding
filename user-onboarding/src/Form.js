import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
import styled from "styled-components";

const formSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  terms: yup.boolean().oneOf([true], "Please agree to the Terms of Service"),
  password: yup.string().required("Please enter a password"),
  role: yup.string().required("Role is required!"),
});

function CreateForm(props) {
  // const Card = styled.div`
  //   .Name {
  //     display: flex;
  //     flex-direction: column;
  //     width: 10%;
  //   }
  //   .EPR {
  //     display: flex;
  //     flex-direction: column;
  //     width: 12%;
  //     margin-top: 8px;
  //   }
  //   button {
  //     display: flex;
  //     flex-direction: column;
  //     margin-top: 8px;
  //   }
  //   .error {
  //     color: red;
  //   }
  // `;

  const [currentData, setCurrentData] = useState({
    id: Date.now(),
    name: "",
    email: "",
    role: "",
    terms: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    terms: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    formSchema.isValid(currentData).then((valid) => {
      setButtonDisabled(!valid);
    });
  }, [currentData]);

  const validateChange = (e) => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then((valid) => {
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0],
        });
      });
  };

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [post, setPost] = useState([]);

  const submitForm = (e) => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", currentData)
      .then((res) => {
        setPost(res.data);
        console.log("success", post);
        setCurrentData({
          name: "",
          email: "",
          terms: "",
          password: "",
        });
      })
      .catch((err) => {
        console.log(err.res);
      });
  };

  const inputChange = (e) => {
    e.persist();
    const newFormData = {
      ...currentData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    };
    validateChange(e);
    setCurrentData(newFormData);
  };

  return (
    <div>
      <form onSubmit={submitForm}>
        <h1>Sign Up Sheet</h1>
        <label htmlFor="name" className="Name">
          Name
          <input
            id="name"
            name="name"
            onChange={inputChange}
            value={currentData.name}
          />
          {errors.name.length > 0 ? (
            <p className="error">{errors.name}</p>
          ) : null}
        </label>
        <label htmlFor="email" className="EPR">
          Email
          <input
            id="email"
            name="email"
            type="email"
            onChange={inputChange}
            value={currentData.email}
          />
          {errors.email.length > 0 ? (
            <p className="error">{errors.email}</p>
          ) : null}
        </label>
        <label htmlFor="password" className="EPR">
          Password
          <input
            id="password"
            name="password"
            type="password"
            onChange={inputChange}
            value={currentData.password}
          />
          {errors.password.length > 0 ? (
            <p className="error">{errors.password}</p>
          ) : null}
        </label>
        <label htmlFor="role" className="EPR">
          Role
          <select
            type="select"
            name="role"
            id="role"
            value={currentData.role}
            onChange={inputChange}
          >
            <option value="Jr. Developer">Jr. Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Student">Student</option>
          </select>
        </label>
        <label htmlFor="terms" className="Terms">
          <input
            type="checkbox"
            name="terms"
            id="terms"
            onChange={inputChange}
            checked={currentData.terms}
          />
          Terms & Conditions
        </label>
        <button disabled={buttonDisabled}>Submit</button>
        <pre>{JSON.stringify(post, null, 2)}</pre>
      </form>
    </div>
  );
}

export default CreateForm;
