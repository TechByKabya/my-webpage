import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = (props: Props) => {
  const { className } = props
  return (
    <span className={clsx('font-black text-xl tracking-tight text-white', className)}>
      My<span className="text-indigo-400">Site</span>
    </span>
  )
}
