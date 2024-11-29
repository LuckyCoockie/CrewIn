import React from 'react'

type Content = {
    content: string
}

const BarContent:React.FC<Content> = ({content}) => {
  return (
    <div className='text-xs text-sub '>{content}</div>
  )
}

export default BarContent