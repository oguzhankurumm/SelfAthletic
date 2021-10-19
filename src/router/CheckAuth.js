import React, { useState, useEffect } from 'react';
import { auth } from '../config/config';
import Loading from './Loading';
import { Root, Auth } from './Router';
import { NavigationContainer } from '@react-navigation/native';
import * as actions from '../redux/actions/profile';
import * as bildirimActions from '../redux/actions/bildirim';
import * as healthActions from '../redux/actions/health';
import { useDispatch } from 'react-redux';


const CheckAuth = () => {
  const dispatch = useDispatch()

  const [isLoading, setLoading] = useState(true)
  const [userStatus, setUserStatus] = useState(null)

  useEffect(() => {
    auth().onAuthStateChanged(async user => {
      if (user) {
        const loadUsers = async () => {
          await dispatch(actions.fetchUserData(user.email));
          await dispatch(bildirimActions.fetchBildirimList(user.email));
          await dispatch(healthActions.fetchHealth());
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