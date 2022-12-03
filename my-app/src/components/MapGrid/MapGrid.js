import React from 'react'
import './MapGrid.css'

const MapGrid = () => {
    const Cell = () => {
        return <td>content</td>
    }
  return (
    <div className='container'>
        <table>
            <tbody>
                <tr>
                    <Cell/>
                    <Cell/>
                    <Cell/>
                </tr>
                <tr>
                    <Cell/>
                    <Cell/>
                    <Cell/>
                </tr>
                <tr>
                    <Cell/>
                    <Cell/>
                    <Cell/>
                </tr>
                
            </tbody>
        </table>
    </div>
  )
}

export default MapGrid