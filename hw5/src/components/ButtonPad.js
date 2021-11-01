import React from "react";
import "./ButtonPad.css";
import Button from "./Button";

const ButtonPad = (props) => {
    const{
        onDigitButtonClick,
        onPointButtonClick,
        onOperatorButtonClick,
        onChangeSignButtonClick,
        onPercentageButtonClick,
        onEqualButtonClick,
        onAllClearButtonClick,
        onClearEntryButtonClick,
        onMemoryRecallButtonClick,
        onMemoryClearButtonClick,
        onMemoryPlusButtonClick,
    } = props;

    return (
        <div className="Pad">
            <Button category="function" onClick={()=>onMemoryRecallButtonClick()}>MR</Button>
            <Button category="function" onClick={()=>onMemoryClearButtonClick()}>MC</Button>
            <Button category="function" onClick={()=>onMemoryPlusButtonClick()}>M+</Button>
            <Button category="function" onClick={()=>onClearEntryButtonClick()}>←</Button>
            <Button category="function" onClick={()=>onAllClearButtonClick()}>AC</Button>
            <Button category="function"onClick={()=>onChangeSignButtonClick()}>±</Button>
            <Button category="function" onClick={()=>onPercentageButtonClick()}>%</Button>
            <Button category="operator" onClick={()=>onOperatorButtonClick('÷')}>÷</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(7)}>7</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(8)}>8</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(9)}>9</Button>
            <Button category="operator" onClick={()=>onOperatorButtonClick('×')}>×</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(4)}>4</Button> 
            <Button category="digit" onClick={()=>onDigitButtonClick(5)}>5</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(6)}>6</Button>
            <Button category="operator" onClick={()=>onOperatorButtonClick('-')}>-</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(1)}>1</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(2)}>2</Button>
            <Button category="digit" onClick={()=>onDigitButtonClick(3)}>3</Button>
            <Button category="operator" onClick={()=>onOperatorButtonClick('+')}>+</Button>
            <Button category="digit" isLarge={true} onClick={()=>onDigitButtonClick(0)}>0</Button>
            <Button category="digit" onClick={()=>onPointButtonClick()}>.</Button>
            <Button category="operator" onClick={()=>onEqualButtonClick()}>=</Button>
            
        </div>
    )
}

export default ButtonPad;