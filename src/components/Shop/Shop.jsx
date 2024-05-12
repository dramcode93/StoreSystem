import React from 'react'
import Card from '../../form/Card'
import { ChalkboardSimple } from '@phosphor-icons/react'

const Shop = () => {
    return (
        <div className='flex justify-content-between align-center'>
            <Card
                icon={<ChalkboardSimple size={60} />}
                id='id'
                name='center'
                adminName='adminName'
                rooms='rooms'
            />
           
        </div>
    )
}

export default Shop
