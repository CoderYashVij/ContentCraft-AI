import React from 'react'
import Image from 'next/image'

const Logo = () => {
  return (
    <Image 
      src="/logo.png" 
      alt="ContentCraft AI Logo" 
      width={65} 
      height={65}
      priority
      className="transform scale-110"
    />
  )
}

export default Logo