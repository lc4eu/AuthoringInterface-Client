import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleSignIn = () => {
  const responseGoogle = (response) => {
    console.log(response);
    // Handle the response from Google Sign-In
    // You can send the response to your server for further authentication and authorization
  };

  return (
    <div>
      <GoogleLogin
        clientId="YOUR_CLIENT_ID"
        buttonText="Sign in with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default GoogleSignIn;
