import { User } from 'firebase/auth'
import React from 'react'

interface Props {
  user: User | undefined | null
  hasCurrentLog: boolean
  clickHandler: (out?: boolean) => void | undefined
}
const btnStyle = {
  padding: '2rem 4rem 2rem 4rem',
  fontSize: '3rem'
}
const LogButton: React.FC<Props> = ({ user, hasCurrentLog, clickHandler }) => {
  return (
    <div>
      {user && hasCurrentLog ? (
        <div>
          <h3>{user.displayName}</h3>
          <button
            type='button'
            className='btn btn-danger btn-lg '
            style={btnStyle}
            onClick={() => clickHandler(true)}
          >
            Clock-Out
          </button>
        </div>
      ) : (
        <button
          type='button'
          style={btnStyle}
          className='btn btn-success btn-lg '
          onClick={() => clickHandler()}
        >
          Clock-In
        </button>
      )}
    </div>
  )
}

export default LogButton
