import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Matter from 'matter-js'

const ChainSimulation = forwardRef(({ linkCount }, ref) => {
  const sceneRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const runnerRef = useRef(null)
  const lastLinkRef = useRef(null)

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    addLink: () => {
      addNewLink()
    }
  }))

  useEffect(() => {
    // Setup Matter JS
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Constraint = Matter.Constraint,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: '#1a1a1a',
        wireframes: false,
        showAngleIndicator: false
      }
    });
    renderRef.current = render;

    // Create Anchor (Top point)
    const anchor = Bodies.circle(window.innerWidth / 2, 50, 20, { 
      isStatic: true,
      render: { fillStyle: '#ff4b4b' }
    });
    lastLinkRef.current = anchor;
    Composite.add(engine.world, anchor);

    // Add Mouse Control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Start simulation
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) render.canvas.remove();
    }
  }, [])

  // Rebuild chain when linkCount changes (initial load)
  useEffect(() => {
    if (!engineRef.current || !lastLinkRef.current) return;
    
    // Clear existing dynamic bodies (except anchor and mouse)
    const world = engineRef.current.world;
    const bodies = Matter.Composite.allBodies(world);
    bodies.forEach(body => {
      if (!body.isStatic && body.label !== 'Mouse Body') {
        Matter.Composite.remove(world, body);
      }
    });
    
    // Reset anchor reference
    const anchor = bodies.find(b => b.isStatic && b.render.fillStyle === '#ff4b4b');
    if (anchor) lastLinkRef.current = anchor;

    // Rebuild
    for (let i = 0; i < linkCount; i++) {
      addNewLink(true)
    }
  }, [linkCount]) // Only run if linkCount changes significantly or on mount logic

  const addNewLink = (isRebuilding = false) => {
    const Engine = Matter.Engine,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Constraint = Matter.Constraint;

    const prevBody = lastLinkRef.current;
    if (!prevBody) return;

    const x = prevBody.position.x;
    const y = prevBody.position.y + 50;

    // Create a chain link shape (Chamfered Rectangle)
    const link = Bodies.rectangle(x, y, 30, 60, {
      chamfer: { radius: 10 },
      render: {
        fillStyle: '#888',
        strokeStyle: '#555',
        lineWidth: 2
      },
      frictionAir: 0.05 // Dampening
    });

    // Connect to previous body
    const constraint = Constraint.create({
      bodyA: prevBody,
      bodyB: link,
      pointA: { x: 0, y: prevBody.circleRadius ? 0 : 30 }, // Offset if prev is anchor
      pointB: { x: 0, y: -25 },
      length: 10,
      stiffness: 0.8,
      damping: 0.1,
      render: {
        visible: true,
        strokeStyle: '#555',
        lineWidth: 5
      }
    });

    Composite.add(engineRef.current.world, [link, constraint]);
    lastLinkRef.current = link;
  }

  return (
    <div 
      ref={sceneRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: 0
      }} 
    />
  )
})

export default ChainSimulation
