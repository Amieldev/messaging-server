import React,{ useState } from 'react';
import { FC } from 'react';
import './material-icons/material-icons.css'

const SendMessage:FC=()=> {

    const [text,setText]=useState('');

    return (
        <div>
            <input type="text" id="input" placeholder="Enter message:" value={text} onChange={(e)=>{setText(e.target.value)}}/>
            <button className="btn"><i className="material-icons">send</i></button>
        </div>
    )
}

export default SendMessage
