import React from 'react'
import { Providers } from '@/app/_components/Provider'
const layout = ({children}) => {
  return (
    <div>
      <Providers>
        {children}
      </Providers>
    </div>
  )
}

export default layout
