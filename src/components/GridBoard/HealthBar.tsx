import React from 'react'

  
export type HealthBarProps = {
    health: number
}

const HealthBar = (props: HealthBarProps) => {
    const { health } = props
    return <div className='health-bar'>
        <progress value={health} max={10}>  </progress>
    </div>
}

export default HealthBar