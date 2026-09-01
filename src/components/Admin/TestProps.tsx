import React from 'react'
export const TestProps = async (props: any) => {
  console.log("PROPS RECEIVED:", Object.keys(props))
  return <div>Test</div>
}
