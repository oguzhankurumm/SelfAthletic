import React, { useState, useEffect } from 'react';
import { auth2 } from '../config/config';
import Loading from './Loading';
import { Root, Auth } from './Router';
import { NavigationContainer } from '@react-navigation/native';
import * as actions from '../redux/actions/profile';
import { useDispatch } from 'react-redux';


const CheckAuth = () => {
  const dispatch = useDispatch()

  const [isLoading, setLoading] = useState(true)
  const [userStatus, setUserStatus] = useState(null)

  useEffect(() => {

    auth2.onAuthStateChanged(async user => {
      if (user) {
        const loadUsers = async () => {
          await dispatch(actions.fetchUserData(user.uid));
        }

        await loadUsers().then(() => {
          setTimeout(() => {
            setUserStatus(true);
            setLoading(false);
          }, 2000);
        })
      }
      else {
        setTimeout(() => {
          setLoading(false);
          setUserStatus(false)
        }, 2000);
      }
    });

  }, [])

  return (
    <NavigationContainer>
      {isLoading ? (
        <Loading />
      ) : userStatus ? (
        <Root />
      ) : <Auth />
      }
    </NavigationContainer>
  );
}


export default CheckAuth;