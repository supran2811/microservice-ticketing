import { useState, useCallback } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [doRequest, errors] = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const submitForm = useCallback(async (e) => {
    e.preventDefault();
    doRequest();
  });

  const handleEmailChange = useCallback((e) => {
    const value = e.target.value;

    setEmail(value);
  });

  const handlePasswordChange = useCallback((e) => {
    const value = e.target.value;

    setPassword(value);
  });

  return (
    <form onSubmit={submitForm}>
      <h1> Sign in</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          type='email'
          name='email'
          className='form-control'
          onChange={handleEmailChange}
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          type='password'
          name='password'
          className='form-control'
          onChange={handlePasswordChange}
        />
      </div>
      {errors}

      <button className='btn btn-primary' type='submit'>
        Sign In
      </button>
    </form>
  );
};
