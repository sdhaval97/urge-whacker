import './Mole.css'

function Mole({ isVisible, isWhacked, onWhack }) {
  return (
    <div className="mole-hole">
      <div 
        className={`mole ${isVisible ? 'visible' : ''} ${isWhacked ? 'whacked' : ''}`}
        onMouseDown={onWhack}
        onTouchStart={onWhack} // Better response on mobile
      >
        <div className="mole-face">
          {isWhacked ? '😵' : '😈'}
        </div>
      </div>
      <div className="dirt"></div>
    </div>
  )
}

export default Mole
