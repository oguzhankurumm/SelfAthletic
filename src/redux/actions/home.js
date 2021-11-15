import { FETCH_HOMEDATA, FETCH_HOMEDATA_FAILED } from '../contants';
import axios from 'axios';

export function getHomeData() {
    return async function (dispatch) {
        return await axios.all([
            axios.get('https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getSliders'),
            axios.get('https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getWodList')
        ])
            .then(axios.spread((data1, data2) => {
                dispatch({
                    type: FETCH_HOMEDATA,
                    sliders: Object.values(data1.data).sort((a, b) => a.title.localeCompare(b.title)),
                    wods: Object.values(data2.data).sort((a, b) => a.title.localeCompare(b.title)),
                    loading: false
                })
            }))
            .catch(error => {
                dispatch({
                    type: FETCH_HOMEDATA_FAILED,
                    errorMsg: error,
                    loading: false
                })
            })
    }
}