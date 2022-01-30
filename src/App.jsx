import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Loader,
  Preload,
  PresentationControls,
  Html,
  useAspect,
  OrbitControls,
  MeshWobbleMaterial,
  useGLTF,
  useScroll,
  ScrollControls,
  Environment,
  Merged,
  Text,
  MeshReflectorMaterial,
} from "@react-three/drei";
import randomColor from "randomcolor";
import * as THREE from "three";
import { useSpring, a } from "@react-spring/three";
const AnimatedWobbleMaterial = a(MeshWobbleMaterial);
import tall from "./tall.otf";
import { useGesture } from "@use-gesture/react";


let colors = [];
let backenduri = "https://showcase-back.herokuapp.com/meshitemclicked";

const emptyarray = new Array(1001).fill(0);
console.log(emptyarray)


//********************************** */

//Create account array

//********************************** */

let countArray = new Array(501).fill(0);


function useActive(width, height, initial, minFactor, maxFactor, index) {
  const [active, set] = useState(initial);
  // converts the active flag into a animated 0-1 spring
  const { f } = useSpring({
    f: Number(active),
    from: { f: Number(!initial) },
    config: { mass: 20, tension: 200, friction: 105 },
  });
  // interpolate x/y scale
  const x = f.to([0, 5], [width / minFactor, width / maxFactor]);
  const y = f.to([0, 5], [height / minFactor, height / maxFactor]);
  // factor interpolates from nothing to wobbly to nothing
  const factor = f.to([0, 0.1, 0.5, 0.9, 1], [0, 1, 2, 1, 0]);
  return [
    (e) => {
      e.stopPropagation(), set(!active);

      //Here is where we get the count for each item
      countArray[index] += 1;

    
      axios.post(backenduri, {
        data: countArray,
      });
    },
    x,
    y,
    factor,
  ];
}


function Scenee({ index, colorIndex, ...props }) {
  const [spring, set] = useSpring(() => ({
    scale: [0.8, 0.8, 0.8],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { friction: 10 },
  }));
  const { size, viewport } = useThree();
  let w = viewport.width;
  const [width, height] = useAspect("cover", 0.001, 41);
  let mobile = size.width <= 1024;
  props.func(mobile);

  const [onClick, x, y, factor] = useActive(
    width,
    height,
    false,
    60,
    300.5,
    index
  );

  const mesh = useRef();
  const owner = useRef();
  const ref = useRef();

  const scroll = useScroll();

  const { nodes, materials } = useGLTF("0001-transformed.glb");
  let val;
  const handleChange = (e) => {
    // onScrollChange(e.target.value);
    val = e.target.value * 0.01;
    //  setTimeout(() => { e.target.value=''}, 500);
  };
  const bind = useGesture({
    onDrag: ({ pressed }) => {
      set({
        scale: pressed
          ? [
              index % 2 === 0 ? 2.5 : 1.5,
              index % 2 === 0 ? 3 : 2,
              index % 2 === 0 ? 2.5 : 1.5,
            ]
          : [0.8, 0.8, 0.8],
      });
    },
  });

  useFrame((state) => {
    if (val) scroll.scroll.current = val;
  
    ref.current.position.x = scroll.offset * -2000 * 5;
    
  });

  let color = randomColor();

  return (
    <>
      {mobile && index ===0?    <Html position={[(w*.015) + 2,0,4]}  transform style={{width:'100vw'}} className="input-field">
        <div className="search-container">
      <fieldset >
        <legend> s e a r c h</legend>
        <input className="input-search" type="text"  onChange={handleChange} />
      </fieldset>
    </div>
    </Html>:null}

      <group ref={ref} dispose={null}>
        <a.mesh
          {...spring}
          {...bind()}
          onClick={onClick}
          geometry={nodes.Cube.geometry}
          ref={mesh}
          name="${index}"
          position={[1 + index * 20, 2, -4]}
          castShadow
        >
          <AnimatedWobbleMaterial
            color={colors[colorIndex]}
            factor={factor}
            speed={20}
          />
        </a.mesh>

        <Text
          color={colors[colorIndex]}
          font={tall}
          fontSize={6}
          position={[1 + index * 20, 1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          #{colorIndex}
        </Text>

  
        <Text
          color={colors[colorIndex]}
          font={tall}
          fontSize={6}
          position={[1 + index * 20, mobile ? 15 : 10, mobile ? -20 : -15]}
          rotation={[0, 0, 0]}
        >
          CLICKS                {countArray[colorIndex]}
        </Text>

        <Text
          color={colors[colorIndex]}
          font={tall}
          fontSize={3}
          position={[1 + index * 20, mobile ? 10 : 5, mobile ? -20 : -15]}
          rotation={[0, 0, 0]}
        >
          {colors[colorIndex]}
        </Text>
        <Text
          ref={owner}
          fillOpacity={1}
          color={colors[colorIndex]}
          font={tall}
          fontSize={3}
          position={[1 + index * 20, mobile ? 25 : 20, -15]}
          rotation={[0, 0, 0]}
        >
          OWNED BY
        </Text>
        <Text
          ref={owner}
          fillOpacity={1}
          color={colors[colorIndex]}
          fontSize={0.8}
          position={[1 + index * 20, mobile ? 20 : 17, -15]}
          rotation={[0, 0, 0]}
        >
          {props.punkListData[0] ? props.punkListData[0].owner.address : "null"}
        </Text>
      </group>
    </>
  );
}





export default function App({
  
  speed = 1,
  count = 501,
  depth = 80,
  easing = (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
}) {
  const [punkListData, setPunkListData] = useState([]);
  useEffect(() => {
    const getMyNfts = async () => {
      const openseaData = await axios("https://showcase-back.herokuapp.com/", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      setPunkListData(openseaData.data.assets);
    };
    return getMyNfts();
  }, []);
  useEffect(() => {
    axios.get(backenduri).then((data) => {
      countArray = data.data;
    });
  }, []);
  let mobile = false;
  const pull_data = (data) => {
    mobile = data; // LOGS DATA FROM CHILD (My name is Dean Winchester... &)
  };
  var allthecolors = [];
  
  for(let i = 0; i < 1002; i++) {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    allthecolors.push('#'+randomColor)
  }
 
  const [secondGroup, setSecondGroup] = useState(true)

  document.body.onkeydown = function(e){
    if(e.keyCode == 32){
      setSecondGroup(!secondGroup)
    }
}
  return (
    <>
      {/* <Canvas concurrent dpr={[1, 1.5]} shadows camera={{rotation:[-.31,0,0], position: [1, 10.133,20.67], fov: 30 }} gl={{ alpha: false }}> */}



     <Canvas
        concurrent
        dpr={[1, 1.5]}
        shadows
        camera={{
          rotation: [-0.31, 0, 0],
          position: [1, 10.133, 20.67],
          fov: 45,
        }}
        gl={{ alpha: true, antialias: true }}
      >
          {/* <Menu /> */}

        <fog attach="fog" args={["#000000", 20, 80]} />
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.2} />
        <directionalLight
          castShadow
          intensity={1}
          position={[0, 6, 0]}
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera
            attach="shadow-camera"
            left={-20}
            right={20}
            top={20}
            bottom={0}
          />
        </directionalLight>
        <Suspense fallback={null}>
          <PresentationControls
            global={false} // Spin globally or by dragging the model
            snap={true} // Snap-back to center (can also be a spring config)
            speed={0.5} // Speed factor
            zoom={mobile ? 0.01 : 0.3} // Zoom factor when half the polar-max is reached
            rotation={[-0.8, 0, 0]} // Default rotation
            polar={[Math.PI / 4, 0]} // Vertical limits
            azimuth={[-Math.PI / 3, Math.PI / 6]} // Horizontal limits
          >
            <ScrollControls pages={150} horizontal={true}>
            
                {
                  secondGroup?
                  
      (          Array.from({ length: count }, (_, i) => (
                  <Scenee
                    func={pull_data}
                    index={i}
                    colorIndex={i}
                    key={i}
                    punkListData={punkListData}
                  />
                ))):
                (          Array.from({ length: 501 }, (_, i) => (
                  <Scenee
                    func={pull_data}
                    index={i}
                    colorIndex={i + 500}
                    key={i}
                    punkListData={punkListData}
                  />
                )))
                
                }

              
   
            </ScrollControls>

            <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1000, 1000, 50, 50]} />
              <MeshReflectorMaterial
                // wireframe={true}
                blur={[400, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={3.5}
                depthScale={1}
                minDepthThreshold={0.85}
                color="#ffffff"
                metalness={0.1}
                roughness={1}
              />
            </mesh>
          </PresentationControls>

          <Environment preset="dawn" />

          <Preload all />
        </Suspense>
      </Canvas>

    </>
  );
}



 colors = ["#fec89a",
    "#b5838d",
    "#83264c",
    "#7d8c4c",
    "#830d8c",
    "#6b51ba",
    "#d3bb39",
    "#10d381",
    "#8e056a",
    "#194f44",
    "#cdeb0f",
    "#d7bb3d",
    "#ff91af",
    "#7dd03e",
    "#b34a49",
    "#3b5f33",
    "#f14e6a",
    "#56508c",
    "#48d4d7",
    "#14feef",
    "#cddaa6",
    "#268410",
    "#8ac74e",
    "#1b0645",
    "#c95097",
    "#3b6591",
    "#63e4e0",
    "#28fdde",
    "#b41aa3",
    "#f65a0b",
    "#56a9c3",
    "#76e131",
    "#f2f44e",
    "#1ccbb9",
    "#b632b9",
    "#60d8cb",
    "#5b23b6",
    "#6608fe",
    "#8ddd70",
    "#4d5028",
    "#c4ac55",
    "#f4416e",
    "#143c98",
    "#c2d559",
    "#da3df3",
    "#5c305a",
    "#314223",
    "#85ebe9",
    "#397776",
    "#77790d",
    "#ea87b2",
    "#25ad23",
    "#447746",
    "#f493f8",
    "#f5de57",
    "#d8b6b6",
    "#c92468",
    "#b9693c",
    "#cb5940",
    "#2e5243",
    "#94aeaa",
    "#47bbfd",
    "#b791e6",
    "#ec420b",
    "#177778",
    "#712d78",
    "#e436bc",
    "#5a268f",
    "#472393",
    "#1010a0",
    "#9d64dc",
    "#27dad3",
    "#7222c1",
    "#e0dd92",
    "#47717f",
    "#a8489d",
    "#c9123f",
    "#afd2eb",
    "#4cd55f",
    "#9cc08d",
    "#bc1ef9",
    "#b5db6c",
    "#c83230",
    "#88bd4f",
    "#b948a6",
    "#c95ade",
    "#46cf82",
    "#c5b7cb",
    "#a10dbd",
    "#1a6a78",
    "#853b9d",
    "#78fce5",
    "#1642c3",
    "#84cc93",
    "#a0b755",
    "#f16058",
    "#f112ea",
    "#3ca216",
    "#d3fbc9",
    "#a3eccf",
    "#a3d973",
    "#14ab24",
    "#bf7bf1",
    "#200e7a",
    "#b8b921",
    "#937fa5",
    "#96e214",
    "#a983a4",
    "#32a88d",
    "#d6aa40",
    "#ccd48c",
    "#309af6",
    "#ddcbbb",
    "#367ca7",
    "#c63ecf",
    "#109ccf",
    "#991e20",
    "#502a55",
    "#2b5059",
    "#3b9dbc",
    "#7f28d4",
    "#3015a2",
    "#b7029d",
    "#bc9fe3",
    "#ef7f8c",
    "#a33945",
    "#67ba79",
    "#a7c778",
    "#67689c",
    "#50323c",
    "#51998e",
    "#258c84",
    "#8aa103",
    "#b38ab3",
    "#c7b9f5",
    "#6ccc4c",
    "#e236ff",
    "#206981",
    "#f2d40b",
    "#ec22db",
    "#c1de86",
    "#b8322e",
    "#b076b5",
    "#a172ca",
    "#5b2aec",
    "#bd05e7",
    "#4a867b",
    "#8ddd18",
    "#7f2554",
    "#ab1982",
    "#2d7a53",
    "#d7391d",
    "#d1a85f",
    "#94b10e",
    "#46e9b7",
    "#2b9469",
    "#47bcb8",
    "#345670",
    "#57776f",
    "#6a3315",
    "#450984",
    "#be4934",
    "#1903b1",
    "#5a567d",
    "#9538d5",
    "#a622f6",
    "#f58812",
    "#e77bf2",
    "#274b68",
    "#a85fac",
    "#b6e325",
    "#dd4526",
    "#8e8c53",
    "#39eff0",
    "#9b5d63",
    "#bdcda3",
    "#4cddda",
    "#42de09",
    "#e3cbfa",
    "#e9cffd",
    "#63f890",
    "#1c42a5",
    "#f93608",
    "#3f9dbb",
    "#c83077",
    "#a128a8",
    "#e6064c",
    "#d719f0",
    "#f21b64",
    "#1b0e9a",
    "#85d158",
    "#66a313",
    "#7a1e76",
    "#bc95d6",
    "#ba48ff",
    "#4263b3",
    "#5f18b1",
    "#2031d8",
    "#b00420",
    "#8303e1",
    "#af4dc6",
    "#fb6800",
    "#82c3ad",
    "#d2a6ea",
    "#791bb5",
    "#86ef2d",
    "#14ad5c",
    "#1129da",
    "#45100a",
    "#b0e74c",
    "#8c7e9a",
    "#9202d9",
    "#68764c",
    "#7d226e",
    "#eaba77",
    "#b54d85",
    "#6192be",
    "#68f7a3",
    "#fec8d6",
    "#6d6d37",
    "#b8bfdf",
    "#d25476",
    "#ba8cd2",
    "#5a4d4a",
    "#77479a",
    "#1d69e8",
    "#11dcf0",
    "#d1496a",
    "#590158",
    "#aaa763",
    "#60adfa",
    "#3fc8f7",
    "#998152",
    "#20cf9c",
    "#806685",
    "#132fdb",
    "#e661c6",
    "#752b7c",
    "#3be5c1",
    "#697a03",
    "#7a06d1",
    "#89624a",
    "#d651bd",
    "#8db2d3",
    "#2fd102",
    "#8c6735",
    "#97c863",
    "#ec96d5",
    "#f76a18",
    "#358110",
    "#6032c0",
    "#b2d6ad",
    "#eafb59",
    "#bb5d9d",
    "#bf7257",
    "#672af4",
    "#fb2d5d",
    "#5b400d",
    "#a7e6bf",
    "#cf27ff",
    "#46ca73",
    "#e9e2be",
    "#63cecf",
    "#e49859",
    "#4fd153",
    "#ad77e1",
    "#c16a3d",
    "#316c30",
    "#f75da7",
    "#e7a266",
    "#861539",
    "#72abc7",
    "#6a36aa",
    "#c1586e",
    "#df907e",
    "#49713c",
    "#e79ea9",
    "#406355",
    "#3bbf84",
    "#91ca61",
    "#921163",
    "#678caa",
    "#168641",
    "#e64f22",
    "#a87a56",
    "#cbd68e",
    "#a839be",
    "#209cac",
    "#8a03a9",
    "#6939cd",
    "#2bbcdc",
    "#1ddc68",
    "#e80987",
    "#3922e1",
    "#be2730",
    "#95ab43",
    "#98a0a6",
    "#c808d8",
    "#c9acd4",
    "#9baafe",
    "#2541e4",
    "#3fb404",
    "#17dc6c",
    "#ca0d3a",
    "#445d58",
    "#4dcddb",
    "#5b3c78",
    "#746cf4",
    "#eaf12c",
    "#b30ad4",
    "#4f250f",
    "#340b01",
    "#eb389a",
    "#18506f",
    "#3bb275",
    "#918cde",
    "#717dfb",
    "#ab4495",
    "#639e51",
    "#87d31e",
    "#8bf388",
    "#de0634",
    "#6aac2c",
    "#18cbfd",
    "#5a5055",
    "#36f354",
    "#bf1446",
    "#bc2415",
    "#7c97fe",
    "#bd32ec",
    "#13155b",
    "#a0de53",
    "#ed5f5b",
    "#7d912c",
    "#f073cc",
    "#39e036",
    "#24551a",
    "#d9c232",
    "#137e5f",
    "#848e58",
    "#cb02f7",
    "#d5aac8",
    "#208e6c",
    "#57a678",
    "#c39a20",
    "#53fdff",
    "#1c6670",
    "#51f1f9",
    "#2fb18a",
    "#b1c187",
    "#322374",
    "#857beb",
    "#1ecc73",
    "#d4bd11",
    "#7741e7",
    "#fa3439",
    "#b1d571",
    "#e550b0",
    "#a10f1d",
    "#83bda9",
    "#5c2044",
    "#cffd25",
    "#d58e49",
    "#f79ac4",
    "#afe15a",
    "#c1de0c",
    "#9d741b",
    "#c0c716",
    "#771dd7",
    "#23a3dd",
    "#b2bd6d",
    "#23778f",
    "#c6d3fc",
    "#201b95",
    "#5cfa2c",
    "#fe1e84",
    "#b0a50f",
    "#fd41ec",
    "#4897b1",
    "#80211f",
    "#b1f5d8",
    "#f67486",
    "#ffd5c4",
    "#513824",
    "#7d44c1",
    "#965532",
    "#a2f492",
    "#cebf1f",
    "#18b46e",
    "#e21505",
    "#4433dd",
    "#49cecf",
    "#d22c10",
    "#3a09f9",
    "#80fab4",
    "#823e75",
    "#88073a",
    "#573dde",
    "#16b91e",
    "#83d8e3",
    "#d39af9",
    "#e97526",
    "#f1a952",
    "#975baf",
    "#578e05",
    "#b31fc7",
    "#636936",
    "#3ee7d3",
    "#4eb079",
    "#dfb354",
    "#8e3109",
    "#e60d9e",
    "#7e46c9",
    "#6392dd",
    "#899be6",
    "#1e62b7",
    "#177844",
    "#520dc0",
    "#9bac31",
    "#a2fa0c",
    "#d2c715",
    "#4455a4",
    "#eecbc6",
    "#988dcc",
    "#8a8a48",
    "#e834e9",
    "#76a349",
    "#3d451b",
    "#164a5e",
    "#4dab9a",
    "#c19ede",
    "#f5994f",
    "#264723",
    "#5f26d6",
    "#749e47",
    "#72b73e",
    "#fb7548",
    "#24b777",
    "#4fd514",
    "#84c0c3",
    "#fb74ed",
    "#47eed0",
    "#8589b5",
    "#29bba1",
    "#cc9327",
    "#5d907d",
    "#d5f233",
    "#14595b",
    "#57df82",
    "#966d63",
    "#a843a4",
    "#986082",
    "#1f5e3a",
    "#41d281",
    "#dfd71a",
    "#fd576b",
    "#a07252",
    "#8a1549",
    "#899a24",
    "#4dec18",
    "#6ffe3e",
    "#fa0696",
    "#358a96",
    "#857116",
    "#c5d35e",
    "#112972",
    "#c6d137",
    "#f809ef",
    "#14e1cc",
    "#7126e6",
    "#c577d6",
    "#5b602b",
    "#14b4d9",
    "#55d66b",
    "#2c922a",
    "#f4da8c",
    "#c7d8fd",
    "#95545c",
    "#90392e",
    "#8d052b",
    "#cf67d8",
    "#41b5d1",
    "#b4f92c",
    "#817693",
    "#620097",
    "#3c6b3b",
    "#c8a8ec",
    "#5fc7e0",
    "#e3c5ae",
    "#1739a1",
    "#681a28",
    "#84bca7",
    "#2e990f",
    "#318ae1",
    "#f38dda",
    "#ebfcf1",
    "#5b6cca",
    "#7fbc1d",
    "#bae18e",
    "#cb9cfd",
    "#c422f8",
    "#8f4cc6",
    "#9bd04b",
    "#2c432a",
    "#23dc67",
    "#3df910",
    "#e29a09",
    "#767058",
    "#6e267f",
    "#70baca",
    "#f69d7a",
    "#2c01f7",
    "#659abc",
    "#fec682",
    "#ef36db",
    "#d3881e",
    "#66496e",
    "#63c6cf",
    "#4cdb1c",
    "#41f554",
    "#b5caf8",
    "#9fe008",
    "#ad6a8c",
    "#2806af",
    "#1b9c5c",
    "#f80c5c",
    "#630599",
    "#85014f",
    "#c81cbf",
    "#c12ebc",
    "#2370e4",
    "#3ef4e7",
    "#cea84a",
    "#b8d953",
    "#1b9980",
    "#e3e969",
    "#f085a5",
    "#333e68",
    "#5b51fc",
    "#2d16b0",
    "#b556b8",
    "#8d79cb",
    "#3e8fd1",
    "#d47fbc",
    "#e1ad6c",
    "#241d49",
    "#b5e922",
    "#2ad363",
    "#eb6ec5",
    "#55548a",
    "#11a8b7",
    "#479fdf",
    "#c6c1ce",
    "#263135",
    "#a6a0c1",
    "#2af115",
    "#5471e7",
    "#bcd4c8",
    "#45caa3",
    "#7e04ae",
    "#bfb96e",
    "#432f36",
    "#ce8dfb",
    "#148cdf",
    "#3cf549",
    "#cc46cc",
    "#b9b2b5",
    "#e166b0",
    "#bea17d",
    "#6458e0",
    "#c85c4d",
    "#ee78d3",
    "#a9aea2",
    "#360d10",
    "#8d3537",
    "#e6760b",
    "#35f2bc",
    "#dd02f7",
    "#cfd347",
    "#a4114a",
    "#b1b96f",
    "#42c520",
    "#db7827",
    "#f78393",
    "#983124",
    "#ff012e",
    "#e065c0",
    "#acde20",
    "#a5bdfd",
    "#94e2f2",
    "#7a39a7",
    "#116dcc",
    "#4c776a",
    "#b0ef3b",
    "#b08171",
    "#52b13e",
    "#ee307b",
    "#b28f53",
    "#38b078",
    "#65e0a1",
    "#152b3c",
    "#421f0a",
    "#8a65c7",
    "#8cdad3",
    "#4447be",
    "#ac283e",
    "#9df79f",
    "#3a523b",
    "#37e1b1",
    "#515186",
    "#699367",
    "#18344e",
    "#2aac66",
    "#f8f2d4",
    "#ec590f",
    "#2005e2",
    "#402582",
    "#bad386",
    "#999476",
    "#1fb28a",
    "#5f43a1",
    "#4c58e1",
    "#5f7a6c",
    "#30df44",
    "#6da6d1",
    "#a49ed5",
    "#658108",
    "#4cd694",
    "#d9d327",
    "#1024c8",
    "#ec5447",
    "#19d115",
    "#fc403b",
    "#b2be25",
    "#74bee3",
    "#9b7da8",
    "#b406dc",
    "#f323f0",
    "#ef5d6c",
    "#ce9d34",
    "#e21222",
    "#e2a55e",
    "#e9f03c",
    "#ce61c8",
    "#e07458",
    "#fedf10",
    "#72869c",
    "#513607",
    "#696676",
    "#181054",
    "#b6a70e",
    "#767eef",
    "#8635f8",
    "#876a7f",
    "#ad78a1",
    "#4738ee",
    "#b8bc2f",
    "#13c293",
    "#9da1ed",
    "#31bb45",
    "#aa2775",
    "#3ec381",
    "#19db37",
    "#191fc0",
    "#c48e0a",
    "#9ee6f6",
    "#61dfd5",
    "#91b9ec",
    "#26584d",
    "#bfacab",
    "#cb1bf7",
    "#bc4624",
    "#8fd811",
    "#6f3c30",
    "#766174",
    "#aa94d6",
    "#da89a9",
    "#3f609c",
    "#da4ef1",
    "#a357dc",
    "#c66837",
    "#d5d21c",
    "#dfb207",
    "#75708c",
    "#eec6fd",
    "#8ef0b0",
    "#c9a5d1",
    "#332419",
    "#93593c",
    "#4cc5f3",
    "#15f167",
    "#c3efa0",
    "#8015e0",
    "#933ad9",
    "#6596f0",
    "#553eb4",
    "#7c37d6",
    "#4c94f0",
    "#5dc5e8",
    "#a879d6",
    "#33c0f9",
    "#cf2a4b",
    "#420b49",
    "#e4e411",
    "#29c860",
    "#7f75f4",
    "#72d86f",
    "#7e595b",
    "#db66e4",
    "#74fa9f",
    "#d90c44",
    "#9a9d77",
    "#d22634",
    "#c9bf3a",
    "#817928",
    "#160eb6",
    "#3104e5",
    "#6f8509",
    "#e90b8c",
    "#e8810a",
    "#a5216d",
    "#39fd2c",
    "#deafbc",
    "#546708",
    "#4f28ff",
    "#967a16",
    "#80d39a",
    "#ff7c70",
    "#362f2e",
    "#cf6ce9",
    "#9bb0da",
    "#dcb55f",
    "#69b1a3",
    "#8d5f57",
    "#aada0f",
    "#6d8400",
    "#48337b",
    "#7b12ef",
    "#1f2ebe",
    "#9029ea",
    "#6be551",
    "#a9670f",
    "#1fec17",
    "#462569",
    "#444f95",
    "#4dfc02",
    "#bfbcb2",
    "#9c0c3e",
    "#81981c",
    "#b25a44",
    "#d12cd4",
    "#18f82c",
    "#8ff62c",
    "#627845",
    "#e21185",
    "#e631b3",
    "#266816",
    "#85723a",
    "#a29e7b",
    "#153df6",
    "#608da1",
    "#f908cc",
    "#788d71",
    "#9fe7d9",
    "#fa198b",
    "#19710f",
    "#1cb0ed",
    "#c460f0",
    "#683e9f",
    "#fc5dbf",
    "#c40ba7",
    "#18b402",
    "#25c457",
    "#69b9a4",
    "#5b40c1",
    "#2b2c64",
    "#4ea516",
    "#a9b816",
    "#3411bf",
    "#96bdb1",
    "#1f5cc3",
    "#509552",
    "#5a1b57",
    "#2b7524",
    "#27c14a",
    "#b52aca",
    "#aaf711",
    "#2d6f7c",
    "#c09dc5",
    "#2eef7d",
    "#ace77f",
    "#f27cca",
    "#44f2f1",
    "#62577d",
    "#f51fba",
    "#15fa26",
    "#1e1f93",
    "#d66314",
    "#d819c7",
    "#bc2848",
    "#f0d71e",
    "#b29aef",
    "#6f0c87",
    "#949830",
    "#e62f2e",
    "#790a6a",
    "#af4c90",
    "#f5a0e0",
    "#669592",
    "#6d2a27",
    "#eff5ae",
    "#994a85",
    "#aabcf3",
    "#3fa283",
    "#f3836b",
    "#9f0d64",
    "#8d96ab",
    "#3d346e",
    "#174e1d",
    "#8aee06",
    "#e9780a",
    "#64a453",
    "#fa5adf",
    "#4261f0",
    "#f40365",
    "#fdda6b",
    "#ca1fbe",
    "#4c9db0",
    "#f047b0",
    "#73b7df",
    "#9110e9",
    "#d6c6cf",
    "#f46bfe",
    "#b65f54",
    "#a66f71",
    "#811766",
    "#987684",
    "#81ef46",
    "#b15fa6",
    "#dc6348",
    "#d461e0",
    "#f5987f",
    "#e441b8",
    "#3e7534",
    "#5b6f3a",
    "#234118",
    "#6819d4",
    "#ff4524",
    "#c0a755",
    "#ef71a6",
    "#321982",
    "#8d83dc",
    "#f9b0d3",
    "#4ae3e8",
    "#9eb450",
    "#aaa97d",
    "#ec1ddb",
    "#790176",
    "#6e5530",
    "#ff7fdc",
    "#b1f047",
    "#505b80",
    "#9dfa31",
    "#604575",
    "#2d7865",
    "#6ab640",
    "#960840",
    "#a50603",
    "#d3efce",
    "#e8a4c8",
    "#12e6f0",
    "#e2c659",
    "#8264fe",
    "#3c0a10",
    "#eed641",
    "#3ec170",
    "#128219",
    "#688aa8",
    "#999349",
    "#8cd0bc",
    "#901ca6",
    "#395c10",
    "#b4f070",
    "#60d40e",
    "#19a5d4",
    "#9d688b",
    "#ce7e11",
    "#dd3c68",
    "#650f6e",
    "#2fd38e",
    "#24fd94",
    "#94ef32",
    "#edd700",
    "#d1ba85",
    "#91d033",
    "#fdbbb6",
    "#aa9c96",
    "#eb148c",
    "#dcf4cc",
    "#141a12",
    "#f81c03",
    "#953390",
    "#9312d7",
    "#b03b14",
    "#b1085e",
    "#92f1e2",
    "#62b382",
    "#c18107",
    "#d1f1d6",
    "#fe29cc",
    "#c9d8f8",
    "#5d5c9e",
    "#7a7d93",
    "#4ed6c2",
    "#8d4be2",
    "#5e849a",
    "#21f31f",
    "#1fb856",
    "#5d32fe",
    "#1e5646",
    "#907c4f",
    "#3be602",
    "#f93664",
    "#3b799d",
    "#a1bb18",
    "#ee90ad",
    "#ca9c02",
    "#16eebe",
    "#406a82",
    "#720a53",
    "#f77e00",
    "#698c8b",
    "#7d0cbf",
    "#ffdd4c",
    "#4566ed",
    "#933307",
    "#b37c44",
    "#b6698e",
    "#d28ff0",
    "#2bf728",
    "#1e357d",
    "#f9a3f0",
    "#75b84e",
    "#fd3213",
    "#f5932e",
    "#ea965a",
    "#532b84",
    "#2bd14c",
    "#7814dd",
    "#589f31",
    "#3772e7",
    "#139d1c",
    "#917ec8",
    "#c763a1",
    "#3b6f5a",
    "#76fc96",
    "#7c2c73",
    "#6aa226",
    "#9acffc",
    "#d6b209",
    "#390fca",
    "#1a0421",
    "#b5b512",
    "#e73933",
    "#86f20f",
    "#773b9a",
    "#e2996c",
    "#ba50f7",
    "#56f93f",
    "#7001da",
    "#1d8bce",
    "#70bb69",
    "#748941",
    "#607667",
    "#838eda",
    "#cac909",
    "#c9e346",
    "#5d6aac",
    "#fb389b",
    "#eec42f",
    "#46a2ac",
    "#273140",
    "#592d68",
    "#31de1a",
    "#19879a",
    "#1db0a2",
    "#f3d1a0",
    "#1d920f",
    "#59cef3",
    "#a1d2bd",
    "#b5d54b",
    "#1365cf",
    "#cb3252",
    "#3ddee1",
    "#f4c85b",
    "#203197",
    "#40d3a0",
    "#4ab4da",
    "#1e2bae",
    "#735a69",
    "#65ff00",


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

console.log('does this shist havbe dfupluis' + hasDuplicates(colors));

{
  /* <Html className="input-field">
        <div className="search-container">
      <fieldset >
        <legend> s e a r c h</legend>
        <input className="input-search" type="text"  onChange={handleChange} />
      </fieldset>
    </div>
    </Html> */
}
