import React, { useState, useContext } from 'react';
import { AccountContext } from './Accounts';
import axios from 'axios'

export default () => {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const { authenticate } = useContext(AccountContext);

  const URL = 'https://7bq3nfzehh.execute-api.us-east-1.amazonaws.com/dev/auth';

  const setMessage_ = message => {
    alert(message);
  }

  const sendConfirmationCode = event => {
    event.preventDefault();

    const data = {
      type: 'SEND',
      email
    }
    axios.post(URL, data).then(resp => {
      setMessage_('Login code sent!');
    }).catch(err => {
      console.log(err);
      setMessage_('Error occured while trying to send a login code: ', err.message);
    });    
  };

  const confirmAndLogin = event => {
    event.preventDefault();

    const data = {
      type: 'AUTH',
      email,
      confirmationCode
    }
    axios.post(URL, data).then(resp => {
      const password = resp.data;
      authenticate(email, password)
      .then(data => {
        console.log('authenticate -- Success!', data);
        window.location.reload(false);
      })
      .catch(err => {
        console.error('authenticate -- Error!', err);
        setMessage_('Error occured while trying to login: ', err.message);
      });  
    }).catch(err => {
      console.log(err);
      console.log(err.response.data);
      setMessage_('Error occured logging in: '+ err.response.data);
    });    
  };

  return (
    <div>
      <form onSubmit={sendConfirmationCode}>
        <ul className="form-style-1">
          <br />
          <li>
            Enter your email address and press button to receive a login code to that email address
          </li>
          <li>
          <label>Email <span className="required">*</span></label>
            <input
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="field-long"
              required
            />
          </li>
          <li>
            <input type='submit' value='Send Email Code' />  
          </li>
        </ul>
      </form>
      <form onSubmit={confirmAndLogin}>
        <ul className="form-style-1">
          <li>
            Login with the code from your email inbox (look in spam folders too!)
          </li>
          <li>
            <label>Login code <span className="required">*</span></label>
            <input
              type="number"
              value={confirmationCode}
              onChange={event => setConfirmationCode(event.target.value)}
              className="field-long"
              required
            />
          </li>
          <li>
            <input type='submit' value='Login' />
          </li>
        </ul>
      </form>
    </div>
  );
};