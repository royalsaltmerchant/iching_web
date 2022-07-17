import React, { useState, useEffect } from 'react'
import images from '../images'
import {getHexagramByBinary} from '../components/HexagramUtilities'
import Modal from 'react-modal'

export default function Oracle() {
  const [coins, setCoins] = useState({1: 'yin', 2: 'yin', 3: 'yin'})
  const [hexagramLineList, setHexagramLineList] = useState([])

  function handlePressReturn() {
    setCoins({1: 'yin', 2: 'yin', 3: 'yin'})
    setHexagramLineList([])
  }

  function getBinary() {
    const binary = []
    hexagramLineList.forEach(line => {
      if(line === 0) binary.push(0);
      if(line === 1) binary.push(1);
      if(line === 2) binary.push(0);
      if(line === 3) binary.push(1)
    })
    return binary
  }

  function getChangingBinary() {
    const binary = []
    hexagramLineList.forEach(line => {
      if(line === 0) binary.push(0);
      if(line === 1) binary.push(1);
      if(line === 2) binary.push(1);
      if(line === 3) binary.push(0)
    })
    return binary
  }

  function getChangingLines() {
    const lines = []
    let count = 0
    hexagramLineList.forEach(line => {
      count = count + 1
      if(line === 2) lines.push({index: count, type: 'yin'});
      if(line === 3) lines.push({index: count, type: 'yang'})
    })
    return lines
  }

  function getHexagramLine(coinSides) {
    const yinLength = []
    coinSides.forEach(coin => {
      if(coin === 'yin') {
        yinLength.push(1)
      }
    })
    switch(yinLength.length) {
      case 1:
        return 0
      case 2:
        return 1
      case 3:
        return 2
      case 0:
        return 3
    }
  }

  function renderHexagramLines() {
    return hexagramLineList.map(line => {
      switch(line) {
        case 0:
          return <div style={{display: 'flex', flexDirection: 'row', marginVertical: 10}}><div style={{marginRight: 25, width: 75, height: 10, backgroundColor: 'black'}}/><div style={{marginLeft: 25, width: 75, height: 10, backgroundColor: 'black'}}/></div>
        case 1:
          return <div style={{marginVertical: 10, width: 200, height: 10, backgroundColor: 'black'}}/>
        case 2:
          return <div style={{marginVertical: 10, display: 'flex', flexDirection: 'row'}}><div style={{marginRight: 25, width: 75, height: 10, backgroundColor: 'red'}}/><div style={{marginLeft: 25, width: 75, height: 10, backgroundColor: 'red'}}/></div>
        case 3:
          return <div style={{marginVertical: 10, width: 200, height: 10, backgroundColor: 'red'}}/>
      }
    })
  }

  function handleCoinPressAll() {
    const coinNumbers = Object.keys(coins)
    
    const coinSides = []
    coinNumbers.forEach(coinNumber => {
      const randomBinary = Math.floor(Math.random() * 2)
      if(randomBinary === 0) {
        coinSides.push('yin')
        setCoins(prevState => ({
          ...prevState,
          [coinNumber]: 'yin'
        }))
      } else {
        coinSides.push('yang')
        setCoins(prevState => ({
          ...prevState,
          [coinNumber]: 'yang'
        }))
      }
    })
    setHexagramLineList([
      ...hexagramLineList,
      getHexagramLine(coinSides)
    ])
  }

  function renderCoinAnimation() {
    const coinImages = Object.values(coins).map((value, i) => (
      <div key={i}>
        <img style={{height: '100px', width: '100px'}} src={value === 'yin' ? images.yin : images.yang} />
      </div>
    ))
    return <div style={{display: 'flex'}}>{coinImages}</div>
  }

  function renderModalViews() {
    const hexagram =  getHexagramByBinary(getBinary(hexagramLineList))
    const changingLines = getChangingLines()
    
    if(hexagram && changingLines.length !== 0) {
      const changingHexagram = getHexagramByBinary(getChangingBinary(hexagramLineList))
      return(
        <>
          <div style={{fontSize: 20}}>{`${hexagram.names[0]}(${hexagram.number}) →	${changingHexagram.names[0]}(${changingHexagram.number})`}</div>
          <div style={{fontSize: 80}}>{hexagram.character} {changingHexagram.character}</div>
          <div style={{flexDirection: 'row'}}>
            <div>Changing Lines: </div>
            {changingLines.map(line => <div>{line.index}{changingLines.length > 1 ? "," : null} </div>)}
          </div>
          <button style={{marginTop: 10}}
            onMouseUp={() => handlePressReturn()}>
            <div style={{fontWeight: 'bold', fontSize: 20}}>Return</div>
          </button>
        </>
      )
    }
    if(hexagram) {
      return(
        <>
          <div style={{fontSize: 20, marginBottom: 10}}>{`${hexagram.names[0]}(${hexagram.number})`}</div>
          <div style={{fontSize: 80}}>{hexagram.character}</div>
          <button
            onMouseUp={() => handlePressReturn()}>
            <div style={{fontWeight: 'bold', fontSize: 20}}>Return</div>
          </button>
        </>
      )
    }
  }

  return (
    <div className='oracle'>
      {renderCoinAnimation()}
      <div style={{height: '300px', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-evenly'}}>
        {renderHexagramLines()}
      </div>
      <div>
        <button
          disabled={hexagramLineList.length === 6}
          onMouseUp={() => handleCoinPressAll()}>
          <div>Throw Coins</div>  
        </button>
      </div>
      <Modal
        isOpen={hexagramLineList.length === 6}
        style={customStyles}
      >
          {renderModalViews()}
      </Modal>
    </div>
  )
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};