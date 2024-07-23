import React from 'react'

type Title = {
    title: string
}

const BarTitle:React.FC<Title> = ({title}) => {
  return (
    <div className='font-bold tracking-tighter'>{title}</div>
  )
}

export default BarTitle