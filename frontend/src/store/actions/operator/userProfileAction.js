import baseUrl from "../../../components/url";

export const setUserData = (type, data) => {
    return {
        type: type,
        payload: data,
    }
}

export const userProfileAction = (type) => async (dispatch, getState) => {
    // const { userLoginReducer:{ token } } = getState();
    const token = localStorage.getItem("token");

    const url = `${baseUrl}/backend/api/users/me/`

    const config = {
        method: "GET",
        headers: new Headers({
            'Authorization': `Bearer ${token}`,
        }),

    };

    // console.log(token)
    const response = await fetch(url, config)
    const data = await response.json();

    // console.log("Fetching UserProfileData")

    dispatch(setUserData(type, data));
    // console.log("data", data)
};
