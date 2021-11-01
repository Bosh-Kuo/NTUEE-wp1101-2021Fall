import React, { useState } from 'react';
import Display from "./components/Display";
import ButtonPad from "./components/ButtonPad"
import "./App.css";

const App = () => {
  const [memory, setMemory] = useState(0);
  const [display, setDisplay] = useState('0');
  const [pendingOperand, setPendingOperand] = useState(0);
  const [lastOperator, setLastOperator] = useState("None");
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  // 按下數字鍵
  const onDigitButtonClick = (digit) => {
    let newDisplay = display;
    
    //若前一個按下的案叫不為操作鍵情況下，目前顯示為0且按下0，或者數字長度超過12，就不做任何動作
    if (!waitingForOperand){
      if ((display === '0' && digit === 0) || display.length > 7) {
        return;
      }
    }else {
      newDisplay = '';
    }
    //若目前顯示不為0，就將按下去的數字接在目前顯示數字的後面，若為0就直接將顯示數字改為按下去的數字
    if (display !== '0' && display!=='錯誤') {
      newDisplay = newDisplay + digit.toString();
    } else {
      newDisplay = digit.toString();
    }
    setWaitingForOperand(false);
    setDisplay(newDisplay);
  }

  // 按下.鍵
  const onPointButtonClick = () => {
    let newDisplay = display;
    // 若前一次點擊為操作鍵(waitingForOperand===true)，將newDisplay改為０
    if (waitingForOperand) {
      newDisplay = '0';
    }
    // 若newDisplay不包含"."，就在newDisplay後面接上"."
    if (newDisplay.indexOf('.') === -1) {
      newDisplay = newDisplay + '.';
    }
    setDisplay(newDisplay);
    setWaitingForOperand(false);
  }

  // 四則運算
  const calculate = (rightOperand, lastOperator) => {
    let newResult = pendingOperand;
    switch (lastOperator) {
      case '+':
        newResult += rightOperand;
        break
      case '-':
        newResult -= rightOperand;
        break
      case '×':
        newResult *= rightOperand;
        break
      case '÷':
        if (rightOperand === 0) {
          setDisplay("錯誤")
          setPendingOperand(0)
          setLastOperator("None");
          return "錯誤"
        }else{
          newResult /= rightOperand;
        }
        break;
      default: break;
    }
    setPendingOperand(newResult);
    if (newResult.toString().length > 9){
      setDisplay(newResult.toExponential(2).toString());
    } else{
      setDisplay(newResult.toString());
    }
    // return true;
  }

  // 按下操作鍵
  const onOperatorButtonClick = (operator) => {
    const rightOperand = Number(display)
    // (連續運算時)若pendingOperator有值(已按過一次操作鍵)，且前一次點擊不為操作鍵(waitingForOperand===true)就進行計算
    // 否則將result變更為目前顯示之數字
    if (display==="錯誤"){
      return;
    }
    if (lastOperator !== 'None' && !waitingForOperand) {
      //若pendingOperator為/且目前數字為0，就不做任何動作
      if (calculate(rightOperand, lastOperator)==="錯誤"){
        return;
      }
    } else {
      setPendingOperand(rightOperand)
    }
    //將按下的操作鍵設為pendingOperator
    setLastOperator(operator)
    setWaitingForOperand(true)
  }

  // 按下+/-鍵
  const onChangeSignButtonClick = () => {
    if(!waitingForOperand){
      const value = Number(display)
      //若本來為+，在display前加-，若本來為-，捨棄-
      if (value > 0) {
        setDisplay('-' + display)
      } else if (value < 0) {
        setDisplay(display.slice(1))
      }
    }else{
      return;
    }
    
  }

  //按下%鍵
  const onPercentageButtonClick = () => {
    if(!waitingForOperand){
      let value = Number(display)
      value = value/100
      if (value.toString().length > 9){
        setDisplay(value.toExponential(2).toString());
      } else{
        setDisplay(value.toString());
      }
    }else{
      return;
    }
    
  }

  // 按下=鍵
  const onEqualButtonClick = () => {
    const rightOperand = Number(display)

    // 若pendingOperator有值(已按過一次操作鍵)，且前一次點擊不為操作鍵(waitingForOperand===true)，就進行計算檢查，再將pendingOperator設為undefined
    if (typeof lastOperator !== 'undefined' && !waitingForOperand) {
      //若pendingOperator為/且目前數字為0，就不做任何動作
      // if (!calculate(rightOperand, lastOperator)) {
      //   return
      // }
      calculate(rightOperand, lastOperator)
      setLastOperator("None")
    } 

    setPendingOperand(rightOperand)
    setWaitingForOperand(true)
  }

  // 按下AC鍵
  const onAllClearButtonClick = () => {
    setMemory(0)
    setPendingOperand(0)
    setLastOperator("None")
    setDisplay('0')
    setWaitingForOperand(true)
  }

  // 按下回車鍵
  const onClearEntryButtonClick = () => {
    if (!waitingForOperand){
      setDisplay('0')
      setWaitingForOperand(true)
    }
  }

  //按下MR
  const onMemoryRecallButtonClick = () => {
    setDisplay(memory.toString())
    setWaitingForOperand(true)
  }
  //按下MC
  const onMemoryClearButtonClick = () => {
    setMemory(0)
    setWaitingForOperand(true)
  }

  //按下M+
  const onMemoryPlusButtonClick = () => {
    setMemory(memory + Number(display))
    setWaitingForOperand(true)
  }


  return(
    <div className="App">
      <Display 
      value={display} 
      hasMemory={memory!==0} 
      expression={lastOperator !== 'None' ? `${pendingOperand}${lastOperator}${waitingForOperand ? '' : display}` : ''}
      />
      <ButtonPad 
      onDigitButtonClick = {onDigitButtonClick}
      onPointButtonClick = {onPointButtonClick}
      onOperatorButtonClick = {onOperatorButtonClick}
      onChangeSignButtonClick= {onChangeSignButtonClick}
      onPercentageButtonClick = {onPercentageButtonClick}
      onEqualButtonClick = {onEqualButtonClick}
      onAllClearButtonClick = {onAllClearButtonClick}
      onClearEntryButtonClick = {onClearEntryButtonClick}
      onMemoryRecallButtonClick = {onMemoryRecallButtonClick}
      onMemoryClearButtonClick = {onMemoryClearButtonClick}
      onMemoryPlusButtonClick = {onMemoryPlusButtonClick}
      />
    </div>
  )
}

export default App;
