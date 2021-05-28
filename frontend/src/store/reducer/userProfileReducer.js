import React, {Component, useEffect, useState} from 'react';
import {ABOUT_USER} from "../constants/constants";


const initialState = {
    user: null
}

export default function userProfileReducer (state = initialState, action) {
    // console.log("In The userProfileReducer")


    switch (action.type) {
        case ABOUT_USER: {

            return {...state, user: action.payload}

        }

        default: {
            return state
        }
    }

}
