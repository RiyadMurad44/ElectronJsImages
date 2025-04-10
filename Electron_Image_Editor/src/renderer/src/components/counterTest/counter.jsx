import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../State/Redux/Slices/counterSlice'
import { toggleLoad } from '../../State/Redux/Slices/loadingSlice'

const Counter = () => {
  const count = useSelector((state) => state.counter.counterValue)
  const isLoading = useSelector((state) => state.loading.loadingState)
  const dispatch = useDispatch()

  const handleIncrement = () => {
    setTimeout(() => {
      dispatch(toggleLoad(true))
    }, 5000)
    dispatch(toggleLoad(false))
    dispatch(increment(2))
  }

  return (
    <div>
      <div>
      {isLoading ? <p>Loading ...</p> : <p>null</p>} 
        <button aria-label="Increment value" onClick={handleIncrement}>
          {/* <button aria-label="Increment value" onClick={() => dispatch(increment(2))}> */}
          Increment
        </button>
        <span>{count}</span>
        <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  )
}

export default Counter
