import React from 'react';
//import { ACCESS_KEY_NAME }  from '../settings/constants';
import { webService } from '../utils/api/webservice';


const AuthProps = {
  isAuthenticated: Boolean,
  authenticate: Function,
};

export const AuthContext = React.createContext({AuthProps});

const isValidToken = () => {
  //const accessKey = localStorage.getItem(ACCESS_KEY_NAME); 
  // TODO: Check token validity & expiration using webService
  if (webService._serviceuser && webService._servicekey) return true;
  const currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
  if(currentUser && currentUser.userId){
    webService._sessionid = currentUser?.sessionName;
    webService._userid = currentUser?._userid;
    return true;
  }
  return false;
};

const AuthProvider = (props) => {
  const [isAuthenticated, makeAuthenticated] = React.useState(isValidToken());
  const authenticate = async ({username, accessKey}) => { 
    const result = await webService.doLogin(username, accessKey, false);
    if(result){
      console.log(result);
      //localStorage.setItem(ACCESS_KEY_NAME, accessKey);
      localStorage.setItem('currentUser', JSON.stringify(result.result));
      makeAuthenticated(true);
    }else {
        makeAuthenticated(false); 
        console.log("Something went wrong..", result);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authenticate,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
