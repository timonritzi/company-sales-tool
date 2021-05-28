import { GET_SELLERS } from './actionTypes'
import baseUrl from "../../components/url";

export const getSellersAction = (dispatch) => {
    const headers = new Headers({
        "Content-type": "application/json",
    })
    const config = {
        method: "GET",
        headers: headers,
    }
    fetch(`${baseUrl}/backend/api/users/all/`, config)
        .then(respone => respone.json())
        .then(sellers => {
            // console.log("in my action", sellers);
            dispatch({
                type: GET_SELLERS,
                payload: sellers,
            })
        }).catch(e => console.error(e));
}