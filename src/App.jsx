import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import MoonScrollAnimation from './components/MoonScrollAnimation '
import JourneyAhead from './components/JourneyAhead'
import RocketCanvas from './components/RocketAnimation'
import RocketCanvas2 from './components/Rocket2Animation'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MoonScrollAnimation/>
      {/* <RocketCanvas/> */}
      <RocketCanvas/>
      <RocketCanvas2/>
      <JourneyAhead/>
    </>
  )
}

export default App
