export function UnicornFigure() {
  return (
    <figure className="hero-stage">
      <svg className="stage-orbits" viewBox="0 0 1160 470" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="580" cy="235" rx="522" ry="143" transform="rotate(-11 580 235)" />
        <ellipse cx="580" cy="235" rx="511" ry="131" transform="rotate(11 580 235)" strokeDasharray="2 9" />
        <path d="M32 236h1096M580 16v438" className="orbit-axis" />
      </svg>
      <div className="stage-statue stage-statue-left" aria-hidden="true">
        <img src="/media/scena-sinistra.webp" width="768" height="768" alt="" />
      </div>
      <div className="stage-statue stage-statue-right" aria-hidden="true">
        <img src="/media/scena-destra.webp" width="768" height="768" alt="" />
      </div>
      <div className="portrait">
        <div className="portrait-frame">
          <img src="/media/diana.webp" alt="Diana sorride con una coroncina di fiori tra i capelli" width="1000" height="732" fetchPriority="high" />
        </div>
      </div>
      <figcaption className="portrait-caption">Diana</figcaption>
    </figure>
  )
}
