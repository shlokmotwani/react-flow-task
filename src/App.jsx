import { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  useOnSelectionChange,
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
  const [selectedNode, setSelectedNode] = useState(null);
  const [textAreaValue, setTextAreaValue] = useState(
    selectedNode?.data?.label || ""
  );
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

  const onChange = useCallback(({ nodes }) => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0]);
      setTextAreaValue(nodes[0].data.label);
    } else {
      setSelectedNode(null);
      setTextAreaValue("");
    }
  }, []);

  useOnSelectionChange({ onChange });

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

  const handleSaveChanges = () => {
    if (!selectedNode) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: textAreaValue } }
          : node
      )
    );
  };

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
        {/* Nodes Panel */}
        <Panel
          hidden={!!selectedNode}
          position="right"
          style={{
            width: "20vw",
            height: "90vh",
            border: "1px solid black",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <span>Nodes Panel</span>
            <p></p>
            <span>(draggable items)</span>
          </div>
          <div
            draggable={true}
            onDragStart={(event) => handleDragStart(event, "default")}
            style={{
              width: "fit-content",
              border: "1px solid black",
              margin: "1rem auto",
              padding: "10px",
            }}
          >
            Text Message
          </div>
        </Panel>

        {/* Settings Panel */}
        <Panel
          hidden={!selectedNode}
          position="right"
          style={{
            width: "20vw",
            height: "90vh",
            border: "1px solid black",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <span>Settings Panel</span>
            <div>
              <div>
                <span>Text</span>
              </div>
              <div>
                <textarea
                  name="textarea"
                  id="textarea"
                  value={textAreaValue}
                  onChange={(event) => setTextAreaValue(event.target.value)}
                ></textarea>
              </div>
              <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
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
