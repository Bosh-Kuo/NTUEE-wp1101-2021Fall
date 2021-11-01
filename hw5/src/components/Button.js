import React from "react";
import "./Button.css"

const Button = ({children, category, isLarge, onClick}) => {
    return(
        <div className={`Button ${category} ${isLarge ? "Large" : ""}`} onClick={onClick}>
            {children}
        </div>
    )
}

export default Button