import React from "react";
import "./Display.css";

const Display = ({value, hasMemory, expression})=>{
    return(
        <div className="Display">
            <div className="IndicatorList">
                {hasMemory && <span>M</span>}
                <div className="Expression">
                    {expression}
                </div>
            </div>
            <div className="Show">
                {value}
            </div>
        </div>
    )
}
export default Display