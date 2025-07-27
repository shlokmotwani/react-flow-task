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
import NodesPanel from "./components/NodesPanel";
import SettingsPanel from "./components/SettingsPanel";
import { useFlowHandlers } from "./hooks/useFlowHandlers";
import TopBar from "./components/TopBar";

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
  const [theme, setTheme] = useState("light");

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  // React Flow events
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

  const { handleDragStart, handleDragOver, handleDrop, handleSave } =
    useFlowHandlers({
      nodes,
      setNodes,
      edges,
      selectedNode,
      textAreaValue,
      screenToFlowPosition,
    });

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

  // CSS for panels
  const panelStyle = {
    width: "20vw",
    height: "90vh",
    border: `1px solid ${theme === "light" ? "black" : "white"}`,
    backgroundColor: theme === "light" ? "#fff" : "#222",
    color: theme === "light" ? "#000" : "#fff",
  };

  //CSS for panel items
  const panelItemStyle = {
    width: "fit-content",
    margin: "1rem auto",
    padding: "10px",
    border: `1px solid ${theme === "light" ? "black" : "white"}`,
    color: theme === "light" ? "#000" : "#fff",
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={reactFlowWrapper}>
      <TopBar theme={theme} setTheme={setTheme} handleSave={handleSave} />

      <ReactFlow
        id="canvas"
        colorMode={theme}
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
        <Panel hidden={!!selectedNode} position="right" style={panelStyle}>
          <NodesPanel
            handleDragStart={handleDragStart}
            panelItemStyle={panelItemStyle}
          />
        </Panel>

        {/* Settings Panel */}
        <Panel hidden={!selectedNode} position="right" style={panelStyle}>
          <SettingsPanel
            textAreaValue={textAreaValue}
            setTextAreaValue={setTextAreaValue}
          />
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
