import React from './zreact'

function App() {
  let count = 1
  return (
    <div>
      <ul>
        <li>li</li>
        <li>li1</li>
        <li>li2</li>
        <li>li3</li>
      </ul>
      <h1>{count}</h1>
    </div>
  )
}

React.render(<App />, document.getElementById('root'))
