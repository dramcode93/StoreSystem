import React from 'react'
import Card from '../../form/Card'
import { ChalkboardSimple } from '@phosphor-icons/react'

const Shop = () => {
    return (
        <div className='flex justify-content-between align-center'>
            <Card
                icon={<ChalkboardSimple size={60} />}
                id='id'
                name='الخزنة'
                 rooms='150000$'
            />
        </div>
    )
}

export default Shop
