// src/utils/api.js
export const postUserToLambda = async (data) => {
    const response = await fetch(`${process.env.REACT_APP_PREFIX_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  
    return response;
  };
  
  export const verifyEmailBySES = async (email) => {
    const response = await fetch(`${process.env.REACT_APP_PREFIX_URL}/signup/verifyEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
  
    return response;
  };