import React, { useState } from 'react'
import images from '../images'
import {getHexagramByBinary} from '../components/HexagramUtilities'
import Modal from 'react-modal'
import wilhelmHexagrams from '../data/hexagrams-wilhelm.json'

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
    hexagramLineList.forEach((line, index) => {
      if(line === 2) lines.push({index: index + 1, type: 'yin'});
      if(line === 3) lines.push({index: index + 1, type: 'yang'})
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
      default:
        return null
    }
  }

  function renderHexagramLines() {
    return hexagramLineList.map((line, index) => {
      switch(line) {
        case 0:
          return <div key={index} className="hexagram-line hexagram-line-broken"><span /><span /></div>
        case 1:
          return <div key={index} className="hexagram-line hexagram-line-solid" />
        case 2:
          return <div key={index} className="hexagram-line hexagram-line-broken hexagram-line-changing"><span /><span /></div>
        case 3:
          return <div key={index} className="hexagram-line hexagram-line-solid hexagram-line-changing" />
        default:
          return null
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
    const isReadingComplete = hexagramLineList.length === 6
    const coinImages = Object.values(coins).map((value, i) => (
      <div key={i}>
        <img src={value === 'yin' ? images.yin : images.yang} alt={`${value} I Ching coin`} />
      </div>
    ))
    return (
      <button
        className="coin-throw"
        type="button"
        disabled={isReadingComplete}
        onClick={() => handleCoinPressAll()}
        aria-label="Throw the I Ching coins"
      >
        {coinImages}
      </button>
    )
  }

  function getHexagramUrl(hexagram) {
    return `/hexagrams/${String(hexagram.number).padStart(2, '0')}-${hexagram.names[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}.html`
  }

  function getReferenceHexagram(hexagram) {
    return wilhelmHexagrams.find(reading => reading.id === hexagram.number)
  }

  function renderParagraphs(text) {
    if(!text || !text.trim()) return null

    return text.split('\n\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ))
  }

  function renderOverview(hexagram) {
    const reference = getReferenceHexagram(hexagram)

    if(hexagram.overview && hexagram.overview.trim()) {
      return (
        <>
          {renderParagraphs(hexagram.overview)}
          {reference ? (
            <details className="reference-details">
              <summary>Translation reference</summary>
              <div className="reference-block">
                <h4>Judgment</h4>
                {renderParagraphs(reference.judgment)}
              </div>
              <div className="reference-block">
                <h4>Image</h4>
                {renderParagraphs(reference.image)}
              </div>
            </details>
          ) : null}
        </>
      )
    }

    if(!reference) return null

    return (
      <>
        <div className="reference-block">
          <h4>Judgment</h4>
          {renderParagraphs(reference.judgment)}
        </div>
        <div className="reference-block">
          <h4>Image</h4>
          {renderParagraphs(reference.image)}
        </div>
        <div className="reference-block">
          <h4>Commentary</h4>
          {renderParagraphs(reference.commentary)}
        </div>
      </>
    )
  }

  function renderChangingLineReadings(hexagram, changingLines) {
    const readableLines = changingLines
      .map(line => ({
        ...line,
        reading: hexagram.linesOverview?.[line.index],
        referenceLine: getReferenceHexagram(hexagram)?.lines?.[line.index - 1],
        referenceCommentary: getReferenceHexagram(hexagram)?.linesCommentary?.[line.index - 1]
      }))
      .filter(line => line.reading?.title || line.reading?.overview || line.referenceLine)

    if(readableLines.length === 0) return null

    return (
      <section className="reading-section">
        <h3>Changing Lines</h3>
        {readableLines.map(line => (
          <div className="changing-line-reading" key={line.index}>
            <h4>Line {line.index}{line.reading?.title ? `: ${line.reading.title}` : ''}</h4>
            {line.reading?.overview ? <p>{line.reading.overview}</p> : null}
            {!line.reading?.overview && line.referenceLine ? renderParagraphs(line.referenceLine) : null}
            {line.referenceCommentary ? <details><summary>Commentary</summary>{renderParagraphs(line.referenceCommentary)}</details> : null}
          </div>
        ))}
      </section>
    )
  }

  function renderHexagramReading(hexagram, title, changingLines = []) {
    return (
      <section className="reading-section">
        <h3>{title}</h3>
        <div className="reading-name">
          <span>{hexagram.character}</span>
          <div>
            <strong>{hexagram.names[0]} ({hexagram.number})</strong>
            {hexagram.names[1] ? <small>{hexagram.names[1]}</small> : null}
          </div>
        </div>
        {hexagram.tagLine ? <p className="reading-tagline">{hexagram.tagLine}</p> : null}
        <div className="reading-copy">
          {renderOverview(hexagram)}
        </div>
        {renderChangingLineReadings(hexagram, changingLines)}
        <a className="reading-link" href={getHexagramUrl(hexagram)} target="_blank" rel="noreferrer">
          Read more about Hexagram {hexagram.number}
        </a>
      </section>
    )
  }

  function renderModalViews() {
    const hexagram =  getHexagramByBinary(getBinary(hexagramLineList))
    const changingLines = getChangingLines()
    
    if(hexagram && changingLines.length !== 0) {
      const changingHexagram = getHexagramByBinary(getChangingBinary(hexagramLineList))
      return(
        <div className="reading-modal">
          <div className="reading-result">
            <div>{`${hexagram.names[0]} (${hexagram.number}) -> ${changingHexagram.names[0]} (${changingHexagram.number})`}</div>
            <div className="reading-symbols">{hexagram.character} {changingHexagram.character}</div>
            <div>Changing lines: {changingLines.map(line => line.index).join(', ')}</div>
          </div>
          {renderHexagramReading(hexagram, 'Primary Reading', changingLines)}
          {renderHexagramReading(changingHexagram, 'Resulting Hexagram')}
          <button className="return-button" onMouseUp={() => handlePressReturn()}>
            <div>Return</div>
          </button>
        </div>
      )
    }
    if(hexagram) {
      return(
        <div className="reading-modal">
          <div className="reading-result">
            <div>{`${hexagram.names[0]} (${hexagram.number})`}</div>
            <div className="reading-symbols">{hexagram.character}</div>
          </div>
          {renderHexagramReading(hexagram, 'Reading')}
          <button className="return-button" onMouseUp={() => handlePressReturn()}>
            <div>Return</div>
          </button>
        </div>
      )
    }
  }

  return (
    <div className='oracle'>
      <header className="oracle-header">
        <h1>Oracle I Ching</h1>
        <p>
          Throw three coins six times for a hexagram reading.
        </p>
      </header>
      {renderCoinAnimation()}
      <div className="hexagram-stack" aria-label="Cast hexagram lines">
        {renderHexagramLines()}
      </div>
      <div className="oracle-actions">
        <button
          disabled={hexagramLineList.length === 6}
          onMouseUp={() => handleCoinPressAll()}>
          <div>{hexagramLineList.length === 0 ? 'Throw Coins' : `Throw Line ${hexagramLineList.length + 1}`}</div>
        </button>
        <span>{hexagramLineList.length}/6</span>
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
    right: '24px',
    bottom: 'auto',
    maxWidth: '760px',
    maxHeight: '84vh',
    overflow: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
