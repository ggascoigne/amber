import React from 'react'

export const ErrorMessage: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div>
    <h2>Sorry there was an unexpected error</h2>
    {`To continue: `}
    <a
      href='/'
      onClick={() => {
        onReset()
      }}
    >
      go to home page
    </a>
  </div>
)

export function test(props: any) {
  const Container = props.componentClass
  return <Container />
}
