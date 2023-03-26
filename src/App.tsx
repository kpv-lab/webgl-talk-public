import { Canvas, extend, useThree } from '@react-three/fiber'
import { Fragment, ReactElement } from 'react'
import './App.css'
import { EndSlide } from './slides/EndSlide'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Text } from 'troika-three-text'
import { COLORS } from './assets/colors'
import { useSlides } from './lib/use-slides'
import { Background } from './slides/Background'
import { History } from './slides/components/History'
import { IllusionOfSmooth } from './slides/components/IllusionOfSmooth'
import { VerticesAndNormals } from './slides/components/VerticesAndNormals'
import { VerticesAndPixels } from './slides/components/VerticesAndPixels'
import { ControlExample } from './slides/ControlExample'
import { CoreConcepts } from './slides/CoreConcepts'
import { Cover } from './slides/Cover'
import { Dots } from './slides/Dots'
import { FishExample } from './slides/FishExample'
import { FishProblems } from './slides/FishProblems'
import { ImporterReference } from './slides/ImporterReference'
import { PlatonicExample } from './slides/PlatonicExample'
import { Script } from './slides/Script'
import { Splash } from './slides/Splash'
import { ThreeFiber } from './slides/ThreeFiber'
import { TimelineContext } from './slides/TimelineContext'
import { TitleSlide } from './slides/TitleSlide'
extend({ Text })

export function App(): ReactElement {

  return (
    <TimelineContext>
      <Main />
    </TimelineContext>
  )
}


function Main(): ReactElement {
  return (
    <div className="app">
      <Script>
        <Canvas shadows>
          <Slides />
        </Canvas>
        <div className="dots">
          <Dots />
        </div>
      </Script>
    </div>
  )
}

const { BLUE, GREY, PINK } = COLORS.BACKGROUND

const SLIDES = [
  (active: number) => (
    <Splash
      active={active}
      background={PINK}
      script="[Use left/right arrow keys or buttons to change slide]"
    />
  ),
  (active: number) => (
    <Cover
      active={active}
      background={BLUE}
      script={[
        `This introduction to WebGL is aimed at entry-level software developers or developers with little-to-no
         knowledge of WebGL. In this talk I'll talk about three things`,
        `Firstly, I will discuss what WebGL is for, and why it exists at all. Then, I will try to give those of you who
         are interested in learning it a way to get started. Finally, I will try to teach two foundational concepts of
         WebGL.`
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={GREY}
      text={['What is WebGL for?','Why does it exist?']}
      script={[
        `If you are relatively new to web development, you probably think of the web front-end as HTML and JavaScript
         or TypeScript. Mostly, that's right.`,
        `The value of HTML is that its structure makes information relatively easy to display. Its problem is that the
         structure is highly constrained.`,
        `Almost as soon as the web became mainstream, a web graphics community grew around a common interest to push
         against the constraints of HTML. That community sought to break down those constraints by taking a block of
         HTML and saying that within this block, every pixel is under my control.`
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={GREY}
      text="WebGL extends web browers' ability to render 3D graphics"
      script={[
        `All technology is a collection of trade-offs: the more structure you create, the more constrained that
        structure becomes. The web graphics community explored various different ways to expand the ability to do
        graphics on the web.`,
        `WebGL is the second most recent technology that achieves this. The most recent, WebGPU is an emerging
        technology that will eventually replace it, but it is an emergent technology. You can assume that in this talk,
        what is true for WebGL is also true for WebGPU.`
      ]}
    />
  ),
  (active: number) => (
    <History
      active={active}
      background={GREY}
      script={[
        'We\'ve been exploring what standards should extend our ability to do graphics on the web for 25 years.',
        `Flash was an early plugin that allowed much more flexibility in what could be rendered. It's an important
         technology to note. Despite its reputation, many of the current web graphics development community first
         experimented with web graphics through Flash, including Mr Doob who created ThreeJS.`,
        `SVG and Flash have some commonality as their primary approach was to allow vector graphics for the web. SVG is
         in some ways Flash's natural successor.`,
        'Canvas allows developers to draw at the level of pixels, and is very useful, but still somewhat limited.',
        `What all of them are doing in one way or another is creating a graphics library that uses computers' Graphics
         Processing Unit to write pixels to the screen.`
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={GREY}
      text="WebGL (and WebGPU) allow much more direct access to the GPU"
      script={[
        `Of all of these technologies, WebGL and WebGPU get closest to the GPU which makes them more powerful,
       as there are fewer constraints. Fewer constraints mean more power, but greater complexity.`
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={GREY} text={['WebGL is a low-level API', 'it is powerful, but hard to use.']}
      script={[
        `This isn't the end of the process either. From a games developer perspective, WebGL is very heavily
         constrained. WebGPU is a successor to it that is even less constrained, and even more powerful (and even more
         complex!).`,
        `The difficulty the people developing the core technologies have is that they wish to build software that will
         work universally across the web, working on a myriad of underlying technologies.`,
        `The Playstation, XBox, Switch or iPhone developer doesn't need to worry this level of complexity because the
         hardware is relatively fixed, which makes the problem simpler to solve.`,
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={BLUE} text="Getting Started"
      script={[
        `OK, so I've tried to explain how complicated it is! But I've also said I'm pitching this at entry-level
        developers … so is it realistic to imagine that you can get started with this technology?`,
        `Well, there are a bunch of libraries out there that can help give anyone looking to get started with a way of
         producing some really interesting results in a relatively short period of time.`
      ]}
    />
  ),
  (active: number) => (
    <ThreeFiber
      active={active}
      background={BLUE}
      script={[
        `Just as React is built on top of HTML, so too ThreeJS is built on top of WebGL. And in recent years,
         @react-three/fiber has been developed to integrate ThreeJS into React.`,
        `Each library builds on top of the standards below it. It is the nature of libraries that they become
         increasingly high-level: they make things simpler to do but at the same time add constraints to what is
         possible. When you hit on something they can't do, then you can go down to the level below and work there.`
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={BLUE}
      text="@react-three/fiber lets you write 3D scenes declaratively"
      script={[
        `For reference, this presentation is written in @react-three/fiber. It is an impressive tool that removes a lot
         of the complexity you can face when you first start working with ThreeJS.`,
        `Ive had issues with @react-three/fiber in the past, and I think those issues still remain. While it makes it
         very easy to write ThreeJS and WebGL, it also gives developers licence to write code that is slower, or more
         bloated than it needs to be. React has that problem too, and there is a risk that @react-three/fiber multiplies
         those two problems together.`,
      ]}
    />
  ),
  (active: number) => (
    <CoreConcepts
      active={active}
      background={BLUE}
      script={[
        'Before looking at code let\'s introduce some names that ThreeJS and WebGL use.',
        `The first is that all objects are created out of triangles of vertices; points in space. These make up what
         we call "geometry"`,
        `The second is that how these triangles are then coloured is controlled by its "material". Together, geometry
         and material make up a "mesh".`,
      ]}
    />
  ),
  (active: number) => (
    <PlatonicExample
      active={active}
      background={BLUE}
      script={[
        `This code produces the dodecahedron at the back. I've clipped out the code that does the rotation, and the
         colour animation, but other than that, this is all you need.`,
        `Those of you familiar with ThreeJS will notice that we haven't had to create a scene, or a camera. This allows
         much more rapid onboarding, and if you have React hot-reloading working (standard using create-react-app or
          vite), you get update-on-save too.`,
        `After creating a canvas to hold everything, and lighting (because without lights you can't see anything!) you
         can see the mesh, the geometry, and the material.`,
      ]}
    />
  ),
  (active: number) => (
    <ControlExample
      active={active}
      background={BLUE}
      script={[
        `It's worth noting that through JavaScript we have control over everything. Here I'm rotating the mesh, changing
         the material's opacity, and then overwriting the geometry's position data in an animation loop. Each part of
         the object can be separately controlled, animated, or changed.`
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={BLUE} text="We can also use 3D models created by artists"
      script={[
        `Programmatic animation is all well and good, and maybe it's impressive compared to a flat HTML page … but it
         doesn't exactly look like the fancy 3D graphics that we're all used to in games and on TV.`,
        `But if you can use 3D modelling software, or find appropriate models online, you don't need to be so
         constrained. Here's a very similar example, but with a much more impressive result.`
      ]}
    />
  ),
  (active: number) => (
    <FishExample
      active={active}
      background={BLUE}
      script={[
        `This is the same code as before, but with a fish model provided by an artist called Denys Almaral. Instead
         of defining the geometry and material separately here, the fish is imported and used as a mesh.`,
        `This might look like cheating: it's a complex model, but that <BlackFish /> component appears as one line
          here... how hard is it to import the model in the first place?`,
      ]}
    />
  ),
  (active: number) => (
    <ImporterReference
      active={active}
      background={BLUE}
      script={[
        `In fact, while the code needed to import the model is relatively complex, it is quite easy to do, as there
         is an online tool that will do it for you. This is the tool I used to import the fish model.`,
        `The only thing I did extra to the generated code was to import the model slightly differently as I am using
         vite, and then to add some logic to trigger the swim animation.`
      ]}
    />
  ),
  (active: number) => (
    <FishProblems
      active={active}
      background={BLUE}
      script={[
        `Though, I should offer a small note of caution. I had originally intended a much more extensive use of fish in
         this presentation, but spent a week emailing back and forth with the fishes' creator Denys to understand why
         they animated like the violet fish on the left, not the striped fish on the right.`,
        `The answer is complicated, but the broader lesson is jut to be aware: as soon as you start to pull in
         third-party assets, you should be prepared to need to spend time making sure it works as you want it to.`,
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={BLUE} text="WebGL Fundamentals"
      script={[
        `Hopefully these snippets of code are enough to get those of you interested to start exploring the world of 3D
         graphics on the web. If you do, good luck! And welcome to the web graphics community.`,
        `I want to change pace a bit at the end and talk a bit more about what is happening under the hood; about two
         important concepts that underpin WebGL.`,
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={BLUE} text="Vertices & Pixels"
      script={[
        'Earlier we noticed that we call objects meshes and that they are made up of geometry and materials.',
        `When we talk about geometry, we are talking about vertices, almost always in threes to form triangles. When we
         talk about material, we are talking about pixels.`,
        `You might see pixels referred to as "fragments" in some places, but they are the same thing. As standard, the
         WebGL community uses the words "vertex shader" and "fragment shader" to describe the programs that calculate
         vertex positions and pixel colours respectively.`,
      ]}
    />
  ),
  (active: number) => (
    <VerticesAndPixels
      active={active}
      background={BLUE}
      script={[
        `Under the hood, all WebGL programs are about positioning triangles of vertices, and then deciding how to colour
         those triangles`,
        `We write programs that determine how each pixel is coloured, based on the triangle that it's a part of. In this
         simulation, we assign a colour to each vertex, and just use that to colour the triangle without adding any
         lighting logic. When we give different colours to the three vertices, WebGL will automatically blend those
         colours together differently for each pixel, like this.`,
      ]}
    />
  ),
  (active: number) => (
    <TitleSlide
      active={active}
      background={BLUE} text="Normals & Lights"
      script={[
        `We can use that blending to create the illusion of smooth surfaces by simulating light. To do that, we need to
         introduce another concept, a "normal".`,
        `A normal is a vector that defines what "up" is. The simplest way to define normals is that for each vertex on
         a triangle, its normal is perpendicular to the surface of the triangle. When you define it that way, you get
         a perfectly flat surface`,
      ]}
    />
  ),
  (active: number) => (
    <VerticesAndNormals
      active={active}
      background={BLUE}
      script={[
        `We can imagine writing some logic to calculate lighting. When light hits the surface and bounces off close to
         the eye, the light colour will overwhelm the colour of the surface, but if it bounces off away from the eye,
         the surface colour comes through.`,
        `We have full control over each vertex normal, and we can use that to manipulate how light bounces off our
         triangle.`,
        `In this example, we start with light directly facing the triangle, but then we manipulate the normals to
         pretend that the triangle is curved, and we can see how light causes each pixel to be differently coloured.`,
      ]}
    />
  ),
  (active: number) => (
    <IllusionOfSmooth
      active={active}
      background={BLUE}
      script={[
        `What that simulation attempts to demonstrate is what is happening here. This is a cylinder with 16 vertices
         around the bottom and 16 vertices around the top. Each face of the cylinder is two triangles, making 32
         triangles in total.`,
        `I am manipulating the normals for this cylinder, flipping between calculating the normal to stand perpendicular
         from the triangles they are part of, and calculating the normal as if it was part of a smooth cylinder.`,
        `What I find fascinating is that if you say that the normals are part of a smooth cylinder, then even though we
         are drawing out a cylinder with 16 faces, the illusion of smoothness makes it look like a cylinder.`,
      ]}
    />
  ),
  (active: number) => (
    <EndSlide
      active={active}
      background={PINK}
      script={[
        `These last two parts were really to help you peek under the cover to consider that each part of how we render
         things in 3D is made up of clever maths that create an illusion of reality.`,
        `The examples before hopefully convinced you that you don't need to understand this maths to get started with
         3D graphics on the web, and might convince you to start exploring for yourself.`,
        `I hope you enjoyed the presentation. My name is Alec McEachran, I am Principal Developer at KPV Labs Edinbrugh,
         where we build 3D graphics web applications. We are hiring! If you are interested, build something in 3D and
         send it to us!`,
        'If you have any questions or comments, you can find me on Twitter @alecmce.',
      ]}
    />
  ),
]

function Slides(): ReactElement {
  const slide = useSlides({ slides: SLIDES })

  const { gl, camera } = useThree()
  gl.localClippingEnabled = true
  camera.near = 0.1
  camera.far = 1000

  return (
    <Fragment>
      <ambientLight />
      <spotLight
        castShadow
        position={[0, 0, 5]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
      />
      <Background color={COLORS.BACKGROUND.PINK}>
        {slide}
      </Background>
    </Fragment>
  )
}
