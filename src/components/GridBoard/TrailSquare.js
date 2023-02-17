import "./Grid.css"

export default function TrailSquare(props) {
  const { srcImg, x, y } = props

  return (
    <div className="tile-div">
      <div className="grid-square">
        <img
          id={`trail${x}${y}`}
          src={srcImg}
          alt=""
          className="grid-square trail"
        />
      </div>
    </div>
  )
}
