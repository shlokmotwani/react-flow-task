import { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

function Canvas() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log("Dropped");

      //check if dropped on canvas
      if (event.target.classList.contains("react-flow__pane")) {
        console.log("Dropped on canvas");

        //check if dropped element is valid
        const type = event.dataTransfer.getData("application/reactflow");
        console.log(`type = ${type}`);
        if (!type) return;

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        //add new node to canvas
        setNodes((nds) => {
          const newNode = {
            id: `n${nds.length + 1}`,
            position,
            type,
            data: { label: `Node ${nds.length + 1}` },
          };
          return [...nds, newNode];
        });
      }
    },
    [screenToFlowPosition]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={reactFlowWrapper}>
      <ReactFlow
        id="canvas"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        fitView
      >
        <Panel
          position="right"
          style={{
            width: "20vw",
            height: "90vh",
            border: "1px solid black",
          }}
        >
          <div style={{
            textAlign: "center"
          }}>
            Draggable Items
          </div>
          <div
            draggable={true}
            onDragStart={(event) => handleDragStart(event, "default")}
            style={{
              width: "fit-content",
              border: "1px solid black",
              margin: "1rem auto",
              padding: "10px"
            }}
          >
            Text Message
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}
