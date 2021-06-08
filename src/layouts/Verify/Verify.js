import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Verify = ({ location }) => {
  const history = useHistory();
  const getDataVerified = async () => {
    const emailToken = location.pathname.replace('/verify/users/', '');

    // const localStorageToken = JSON.parse(localStorage.getItem('userInfo'))
    //   .token;
    // console.log(localStorageToken);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .put(
        `/api/users/verify/${emailToken}`,
        { localStorageToken: emailToken },
        config
      )
      .then((res) => {
        console.log(res);
        history.push('/app/dashboard');
      });
  };
  getDataVerified();
  return <></>;
};

export default Verify;
