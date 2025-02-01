import React from 'react'



const HealthBar = (props) => {
    const { health } = props
    return <div className='health-bar'>
        <progress value={health} max={10}>  </progress>
    </div>
}

export default HealthBar