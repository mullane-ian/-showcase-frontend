import * as THREE from 'three'
import React, { useRef, useState,Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import './Scene.css'
import { useGLTF,Text,PresentationControls, OrbitControls, Html,  ScrollControls, Scroll} from '@react-three/drei'
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing'

import { RectAreaLightUniformsLib, FlakesTexture } from 'three-stdlib'
import { DirectionalLightHelper } from 'three'

import myFont from './myFont.otf'

let colorArray = [
  "#3fff00",
  "#e59297",
  "#0b3f8e",
  "#f2ab8a",
  "#f913f6",
  "#33bac6",
  "#88e88d",
  "#9fe234",
  "#f2c168",
  "#48f28c",
  "#fcd9a4",
  "#3ded2d",
  "#1cef15",
  "#069499",
  "#f7e991",
  "#c4c7fc",
  "#3f0996",
  "#efea86",
  "#50a3b7",
  "#415da8",
  "#1d20e2",
  "#b6e06d",
  "#2ad3ed",
  "#f9f1b1",
  "#e58d30",
  "#7b89f2",
  "#fc7435",
  "#70b517",
  "#867af4",
  "#126682",
  "#6df9e9",
  "#61f4de",
  "#7dd3db",
  "#aaffe0",
  "#1b2d91",
  "#78bde8",
  "#d32886",
  "#63b9c6",
  "#a02346",
  "#5fddaf",
  "#ffaf9b",
  "#f9dc84",
  "#e899de",
  "#876cc9",
  "#0d2f87",
  "#a0ea8a",
  "#019633",
  "#ef88bf",
  "#8e8fdb",
  "#4569b2",
  "#c64fea",
  "#e789f9",
  "#e83357",
  "#fcabc1",
  "#adc2ed",
  "#fcf5a6",
  "#9cf49c",
  "#aab2ef",
  "#f73d66",
  "#ffc6c4",
  "#e04188",
  "#a0e86d",
  "#f2e421",
  "#f27d9e",
  "#ce863d",
  "#b4b0f4",
  "#f98684",
  "#a0d624",
  "#94fc5f",
  "#bc0fb4",
  "#ea85ac",
  "#2c3ab2",
  "#e25171",
  "#a5cc3b",
  "#daf298",
  "#84f46b",
  "#b0ffa5",
  "#ead577",
  "#0891e0",
  "#e5ba1d",
  "#8c8cdb",
  "#dbbf23",
  "#e52a12",
  "#3f9fff",
  "#004f7c",
  "#42ccd1",
  "#e57a6b",
  "#e5f28e",
  "#a871c6",
  "#056682",
  "#e23152",
  "#e83ac8",
  "#5de299",
  "#ef34ba",
  "#17aa94",
  "#e5cc5b",
  "#a3f7b4",
  "#e516bc",
  "#f6fc8a",
  "#d347a9",
  "#E8BEAC",
  "#2ac134",
  "#e070d3",
  "#03b26f",
  "#8583e2",
  "#E8BEAC",
];
const myColors = colorArray
console.log(myColors)


RectAreaLightUniformsLib.init()
THREE.Vector2.prototype.equals = function (v, epsilon = 0.001) {
  return Math.abs(v.x - this.x) < epsilon && Math.abs(v.y - this.y) < epsilon
}

function useLerpedMouse() {
  const mouse = useThree((state) => state.mouse)
  const lerped = useRef(mouse.clone())
  const previous = new THREE.Vector2()
  useFrame((state) => {
    previous.copy(lerped.current)
    lerped.current.lerp(mouse, 0.1)
    // Regress system when the mouse is moved
    if (!previous.equals(lerped.current)) state.performance.regress()
  })
  return lerped
}


function Thing({...props}) {
let k = 'ffffff'

  const { viewport } = useThree()
  const ref = useRef()
  const [color, setColor] = useState(0)
  const [hover, setHover] = useState(false);
  const { nodes, materials } = useGLTF('/dildo.glb')


  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : 'auto'
  }, [hover])

  useFrame(({ clock }) => {
    if (hover) {
     console.log('hovered')
    }

      ref.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.1
      ref.current.rotation.y = Math.sin(clock.getElapsedTime()) * 0.3
      ref.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.05



    



    const i = Math.round(hover?k:((clock.getElapsedTime()) % myColors.length))
     k = i
    // either use state
    setColor(i)
    // or imperatively
     ref.current.material.color.set( myColors[color] )
    console.log(viewport.width)
  })
  

  return (
    <>
    <mesh 
       fog={false}
       ref={ref}
       
       geometry={nodes.dildobj_15x48x19.geometry} material={materials.name}
       castShadow
       receiveShadow
       position={[2, -4, -15.95]}
       rotation={[0,0.3,0]}
       scale={[0.3,0.3,0.3]}
       onPointerOver={() => {
          setHover(true);
        }}
        onPointerOut={() => {
          setHover(false);
        }}
    >
    
      {/* <meshStandardMaterial color={myColors[color + 5]} /> */}
      
      <Text
      position={[20,30,0]}
      rotation={[0,0,-Math.PI/2]}
      textAlign='left'
  
      fontSize={10.5} 
      color={myColors[color]}  
     
     
      anchorX="center"
      anchorY="middle"
      whiteSpace={false}
      >
         {myColors[color]}
        </Text>
    </mesh>
    <Text
      position={[0,-8,-20]}
      maxWidth={(viewport.width / 100) * 120} 
      textAlign='left'
      font={myFont} 
      fontSize={7} 
      color={myColors[color]}  
  
      letterSpacing={0}
      anchorX="center"
      anchorY="middle"
      whiteSpace={false}
      receiveShadow>
          the DILDS
        </Text>




    </>

    

  )
}



function Effects() {
  const ref = useRef()

  return (

        <EffectComposer multisampling={8}>
          <Bloom
            kernelSize={3}
            luminanceThreshold={0.01}
            luminanceSmoothing={.5}
            intensity={.25}
          />
      
        </EffectComposer> 
  )
}




function Home() {
  return (
    <div className='canvas-container'>
<Canvas  >
     {/* <fog attach="fog" args={['#000', 1, 30]} /> */}
      <pointLight position={[0, 10, -5]} intensity={.8} />

      <pointLight position={[1, -2, 5]} intensity={.5} />
    
      
      <Suspense fallback={null}>
      <PresentationControls
        global
        config={{ mass: 10, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}>
      <Thing fog={false}/>
       </PresentationControls>    
  
     


      </Suspense>
   
      {/* <color attach="background" args={['#000000']} /> */}
      <Effects />
    </Canvas>
    </div>

    
  )
}

export default Home



