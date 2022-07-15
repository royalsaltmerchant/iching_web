import React, { useState, useEffect } from 'react'
import images from '../images'
import {getHexagramByBinary} from '../components/HexagramUtilities'
import Modal from 'react-modal'

export default function Oracle() {
  const [coin1Side, setCoin1Side] = useState('yin')
  const [coin2Side, setCoin2Side] = useState('yin')
  const [coin3Side, setCoin3Side] = useState('yin')
  const [coinTossCount, setCoinTossCount] = useState(0)
  const [hexagramRan, setHexagramRan] = useState(false)
  const [hexagramLineList, setHexagramLineList] = useState([])
  const [hexagramLine, setHexagramLine] = useState(null)
  const [hexagramFinished, setHexagramFinished] = useState(false)
  const [hexagramBinary, setHexagramBinary] = useState(null)
  const [changingHexagramBinary, setChangingHexagramBinary] = useState(null)
  const [hexagram, setHexagram] = useState(null)
  const [changingHexagram, setChangingHexagram] = useState(null)
  const [changingLines, setChangingLines] = useState(null)

  function handlePressReturn() {
    setCoin1Side('yin')
    setCoin2Side('yin')
    setCoin3Side('yin')
    setCoinTossCount(0)
    setHexagramLineList([])
    setHexagramLine(null)
    setHexagramFinished(false)
    setHexagramBinary(null)
    setChangingHexagramBinary(null)
    setHexagram(null)
    setChangingHexagram(null)
    setChangingLines(null)
  }

  // get hexagram binaries
  useEffect(() => {
    setHexagramBinary(getHexagramBinary())
    if(hexagramLineList.includes(2) || hexagramLineList.includes(3)) {
      setChangingLines(getChangingLines())
      setChangingHexagramBinary(getChangingHexagramBinary())
    }
  }, [hexagramFinished]) 

  // set hexagram to finished
  useEffect(() => {
    if(coinTossCount === 6 && hexagramLineList.length === 6) {
      setHexagramFinished(true)
      handlePressRead()
    }
  })
  
  // make hexagram list
  useEffect(() => {
    if(coinTossCount > 0 && coinTossCount < 7) {
      setHexagramLineList(prevList => [...prevList, hexagramLine])
    }
  }, [hexagramRan])

  //set hexagram line
  useEffect(() => {
    if(!hexagramFinished && coinTossCount !== 0) {
      setHexagramLine(getHexagramLine())
    }
  }, [coinTossCount])

  function getHexagramBinary() {
    const binary = []
    hexagramLineList.forEach(line => {
      if(line === 0) binary.push(0);
      if(line === 1) binary.push(1);
      if(line === 2) binary.push(0);
      if(line === 3) binary.push(1)
    })
    return binary
  }

  function getChangingHexagramBinary() {
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
    console.log('lines list', hexagramLineList)
    hexagramLineList.forEach(line => {
      count = count + 1
      if(line === 2) lines.push({index: count, type: 'yin'});
      if(line === 3) lines.push({index: count, type: 'yang'})
    })
    console.log('changing lines', lines)
    return lines
  }

  function getHexagramLine() {
    setHexagramRan(!hexagramRan)
    const coinSides = [coin1Side, coin2Side, coin3Side]
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

  function handleCoinPressAll() {
    setCoinTossCount(prevCoinTossCount => prevCoinTossCount < 7 ? prevCoinTossCount + 1 : 0)
    const coinNumbers = [1, 2, 3]
    coinNumbers.forEach(coin => {
      handleCoinPress(coin)
    })
  }
  
  function handleCoinPress(coin) {
    const randomBinary = Math.floor(Math.random() * 2)
    if(coin === 1) {
      if(randomBinary === 0) {
        setCoin1Side('yin')
      } else {
        setCoin1Side('yang')
      }
    }
    if(coin === 2) {
      if(randomBinary === 0) {
        setCoin2Side('yin')
      } else {
        setCoin2Side('yang')
      }
    }
    if(coin === 3) {
      if(randomBinary === 0) {
        setCoin3Side('yin')
      } else {
        setCoin3Side('yang')
      }
    }
  }

  function renderCoinImage(coin) {
    if(coin === 1) {
      if(coin1Side === 'yin') {
        return(
          <img style={{height: '100px', width: '100px'}} src={images.yin} />
        )
      } else {
        return(
          <img style={{height: '100px', width: '100px'}} src={images.yang} />
        )
      }
    }
    if(coin === 2) {
      if(coin2Side === 'yin') {
        return(
          <img style={{height: '100px', width: '100px'}} src={images.yin} />
        )
      } else {
        return(
          <img style={{height: '100px', width: '100px'}} src={images.yang} />
        )
      }
    }
    if(coin === 3) {
      if(coin3Side === 'yin') {
        return(
          <img style={{height: '100px', width: '100px'}} src={images.yin} />
        )
      } else {
        return(
          <img style={{height: '100px', width: '100px'}} src={images.yang} />
        )
      }
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

  function renderCoinAnimation() {
    const coinNumbers = [1, 2, 3]
    const coins = coinNumbers.map(coin => (
      <div key={coin}>
        {renderCoinImage(coin)}
      </div>
    ))
    return <div style={{display: 'flex'}}>{coins}</div>
  }

  function handlePressRead() {
    if(hexagramBinary && !changingHexagramBinary) {
      const hexagramByBinary = getHexagramByBinary(hexagramBinary)
      setHexagram(hexagramByBinary)
    }
    if(hexagramBinary && changingHexagramBinary) {
      const hexagramByBinary = getHexagramByBinary(hexagramBinary)
      const changingHexagramByBinary = getHexagramByBinary(changingHexagramBinary)
      setHexagram(hexagramByBinary)
      setChangingHexagram(changingHexagramByBinary)
    }
  }

  function renderModalViews() {
    if(hexagram && changingHexagram && changingLines) {
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
    if(hexagram && !changingHexagram) {
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
      <div style={{height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
        {renderHexagramLines()}
      </div>
      <div>
        <button
          disabled={hexagramFinished === true}
          onMouseUp={() => handleCoinPressAll()}>
          <div>Throw Coins</div>  
        </button>
      </div>
      <Modal
        isOpen={hexagramFinished}
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