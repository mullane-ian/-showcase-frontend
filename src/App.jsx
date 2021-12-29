import { Suspense, useMemo, useRef, useState,useEffect } from 'react'
import axios from 'axios';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {Loader, Preload, PresentationControls,Html,useAspect, OrbitControls, MeshWobbleMaterial, useGLTF, useScroll, ScrollControls, Environment, Merged, Text, MeshReflectorMaterial } from '@react-three/drei'
import randomColor from "randomcolor";
import * as THREE from 'three'
import { useSpring, a } from "@react-spring/three";
const AnimatedWobbleMaterial = a(MeshWobbleMaterial)
import tall from './tall.otf'
import { useGesture} from "@use-gesture/react"


let colors = []




//********************************** */

//Create account array

//********************************** */

const countArray = new Array(101).fill(0)

//For Fiver Dev : 'index' is the mesh that has been clicked (0-100)
//Count array increases by one when the different meshes are clicked

function useActive(width, height, initial, minFactor, maxFactor, index) {


  const [active, set] = useState(initial)
  // converts the active flag into a animated 0-1 spring
  const { f } = useSpring({ f: Number(active), from: { f: Number(!initial) }, config: { mass: 20, tension: 200, friction: 105 } })
  // interpolate x/y scale
  const x = f.to([0, 5], [width / minFactor, width / maxFactor])
  const y = f.to([0, 5], [height / minFactor, height / maxFactor])
  // factor interpolates from nothing to wobbly to nothing
  const factor = f.to([0, 0.1, 0.5, 0.9, 1], [0, 1, 2, 1, 0])
  return [(e) => {
    (e.stopPropagation(), set(!active))

    //Here is where we get the count for each item
    countArray[index] += 1
    console.log(index)
    console.log(countArray)
  }
  , x, y, factor]

}



console.log(countArray)
function Scenee({ index, ...props }) {
    const [spring, set] = useSpring(() => ({ scale: [0.8, 0.8, 0.8], position: [0, 0, 0], rotation: [0, 0, 0], config: { friction: 10 } }))
    const { size,viewport} = useThree()
    let w = viewport.width
    const [width, height] = useAspect('cover', .001, 41)
  let mobile = size.width <= 1024
  props.func(mobile);

  //this is where I pass in the index (item that is clicked) to the function
  const [onClick, x, y, factor,] = useActive(width, height, false, 60, 300.5,index)
  
  
  const mesh = useRef()
  const owner = useRef()
  const ref = useRef()


  const scroll = useScroll()
  const [punkListData, setPunkListData] = useState([]);
  useEffect( ()=>{
  const getMyNfts = async ()=>{
  const openseaData = await axios('https://showcase-back.herokuapp.com/',{
   headers: {
    'Access-Control-Allow-Origin': '*'
   }
   })
   setPunkListData(openseaData.data.assets)
  }
  return getMyNfts()
}, [])


  const { nodes, materials } = useGLTF('0001-transformed.glb')
    let val
    const handleChange = e => {
        onScrollChange(e.target.value);
        val = (e.target.value) * 0.01
        //  setTimeout(() => { e.target.value=''}, 500);
    };
    const bind = useGesture({
      onDrag:({pressed})=>{
         set({ scale: pressed ? [index%2===0?2.5:1.5, index%2===0?3:2, index%2===0?2.5:1.5] : [.8,.8, .8] })
        }

    })


     useFrame((state) =>{
          if(val)scroll.scroll.current = val
          ref.current.position.x = scroll.offset * -2000
          // console.log(countArray)
     })

     let color = randomColor();
    
  
  return (
    <>
{/* {mobile && index ===0?    <Html position={[(w*.015) + 2,0,4]}  transform style={{width:'100vw'}} className="input-field">
        <div className="search-container">
      <fieldset >
        <legend> s e a r c h</legend>
        <input className="input-search" type="text"  onChange={handleChange} />
      </fieldset>
    </div>
    </Html>:null} */}


    <group ref={ref} dispose={null}  >
      <a.mesh  
        {...spring}
        {...bind()}
        onClick={onClick}
        geometry={nodes.Cube.geometry} 
        ref={mesh} name='${index}'  
        position={[1+(index * 20), 2, -4]}
        castShadow
      >
      <AnimatedWobbleMaterial 
        color={colors[index]} 
        factor={factor} 
        speed={20} />
      </a.mesh>

      <Text  color={colors[index]}font={tall} fontSize={6}  position={[1+(index * 20), 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        #{index}
      </Text>



        {/* *****************************************************************
        
        Fiverr Developer: This is where I need the click count to display

        ***************************************************************** */}

        <Text  color={colors[index]}font={tall} fontSize={1}  position={[1+(index * 20), 0, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        count display here {/*Display*/}
        </Text>




        
        <Text color={colors[index]} font={tall} fontSize={3}  position={[1+(index * 20),  mobile?10:5, mobile?-20:-15]} rotation={[0, 0, 0]}>
          {colors[index]}
        </Text>
        <Text ref={owner} fillOpacity={1} color={colors[index]} font={tall} fontSize={3}  position={[1+(index * 20), mobile?25:20, -15]} rotation={[0, 0, 0]}>
          OWNED BY
        </Text>
        <Text ref={owner} fillOpacity={1} color={colors[index]}  fontSize={0.8}  position={[1+(index * 20), mobile?20:17, -15]} rotation={[0, 0, 0]}>
          { punkListData[0]?
            punkListData[0].owner.address:
            'null'
          }
        </Text>


    </group>
    </>
  )
}

export default function App({ speed = 1, count = 101 ,depth = 80, easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)) }){
  let mobile = false
  const pull_data = (data) => {
    mobile = data// LOGS DATA FROM CHILD (My name is Dean Winchester... &)

  }
  // const [punkListData, setPunkListData] = useState([]);

  // useEffect( ()=>{


  //   const getMyNfts = async ()=>{

  //    const openseaData = await axios('https://showcase-back.herokuapp.com/',{

  //    headers: {
  //     'Access-Control-Allow-Origin': '*'
  //    }
  //    })
     
  //    setPunkListData(openseaData.data.assets)
  //   }
  //   return getMyNfts()
  // }, [])

  // if(punkListData[0]){
  //   console.log(punkListData[1].owner.address)}


 return (
      <>

    {/* <Canvas concurrent dpr={[1, 1.5]} shadows camera={{rotation:[-.31,0,0], position: [1, 10.133,20.67], fov: 30 }} gl={{ alpha: false }}> */}
    <Canvas concurrent dpr={[1, 1.5]} shadows camera={{rotation:[-.31,0,0], position: [1, 10.133,20.67], fov: 45 }} gl={{ alpha: true, antialias:false }}>
      <fog attach="fog" args={['#000000', 20, 60]} />
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      <directionalLight castShadow intensity={1} position={[0, 6, 0]} shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" left={-20} right={20} top={20} bottom={0} />
      </directionalLight>
      <Suspense fallback={null}>
      <PresentationControls
        global={false} // Spin globally or by dragging the model
        snap={true} // Snap-back to center (can also be a spring config)
        speed={0.5} // Speed factor
        zoom={mobile?.01:0.3} // Zoom factor when half the polar-max is reached
        rotation={[-0.8, 0, 0]} // Default rotation
        polar={[Math.PI/4, 0]} // Vertical limits
        azimuth={[-Math.PI/3 , Math.PI/6]} // Horizontal limits
      >

        <ScrollControls pages={30} horizontal={true}>
   
          {Array.from({ length: count }, (_, i) =>
            <Scenee func={pull_data} index = {i} key={i}  onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}/> )}

        </ScrollControls>

        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1000, 1000,50,50]} />
          <MeshReflectorMaterial
          // wireframe={true}
            blur={[400, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={3.5}
            depthScale={1}
            minDepthThreshold={0.85}
            color="#FFC0CB"
            metalness={0.1}
            roughness={1}
          />
        </mesh>
 </PresentationControls>

       
        <Environment preset="dawn" />
       
        <Preload all />
      </Suspense>

    </Canvas>
    <Loader />
    </>
  )
}







colors = [
    "#3ebdef",
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
    "#24af86",
    "#2ac134",
    "#e070d3",
    "#03b26f",
    "#8583e2",
    "#4efc2f",

    
]


function hasDuplicates(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
          return true;
      }
      valuesSoFar[value] = true;
  }
  return false;
}


console.log(hasDuplicates(colors))


    {/* <Html className="input-field">
        <div className="search-container">
      <fieldset >
        <legend> s e a r c h</legend>
        <input className="input-search" type="text"  onChange={handleChange} />
      </fieldset>
    </div>
    </Html> */}