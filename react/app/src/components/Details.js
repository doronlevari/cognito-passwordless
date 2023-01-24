import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from './Accounts';
import EmailSendConfirm from './EmailSendConfirm';

export default () => {
  const [status, setStatus] = useState(false);
  const [email, setEmail] = useState('');

  const { getSession, logout } = useContext(AccountContext);

  useEffect(() => {

    getSession()
      .then(session => {
        setStatus(true);
        setEmail(session.email);
      })
      .catch((err) => {
        setStatus(false);
      });
  }, []);

  const doLogout = () => {
    logout();
    window.location.reload(false);
  }

  return (
    <div className="form-style-1">
      <h1 style={{ width:1500 }}>Cognito Passwordless Sample React App</h1>
      <br />
      {status ? (
        <div>
          <ul>
            <li>
              Login successful!
            </li>
            <li>
              User: {email}
            </li>
            <li>
              <input type="button" onClick={doLogout} value="Logout" />
            </li>
          </ul>
        </div>
      ) : (
        <div>
          <EmailSendConfirm />
        </div>
      )}
    </div>
  );
};
