import React, { useContext } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { DASHBOARD }  from '../settings/constants';


//import { Button } from "reactstrap";

const initialValues = {
  username: 'admin',
  accessKey: 'cdYTBpiMR9RfGgO',
};


export default () => {
  let history = useHistory();
  let location = useLocation();
  const { authenticate, isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) return <Redirect to={{ DASHBOARD }} />;

  let { from } = (location.state) || { from: { pathname: DASHBOARD } };
  const login = ({ username, accessKey }) => {
    authenticate({ username, accessKey }, () => {
      history.replace(from);
    });
  };

  return (
  
        <div style={{height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
            <span onClick={login(initialValues)}>
                Login......
            </span>
        </div>
     
  );

};
