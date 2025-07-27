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
  const [theme, setTheme] = useState("light");
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

  const handleLabelChange = (event) => {
    const newValue = event.target.value;
    setTextAreaValue(newValue);

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: newValue } }
          : node
      )
    );
  };

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

  const handleSave = () => {
    //make sure all nodes are connected
    const allNodeIds = nodes.map((node) => node.id);
    const connectedNodeIds = new Set();

    edges.map((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const unconnectedNodeIds = allNodeIds.filter(
      (id) => !connectedNodeIds.has(id)
    );
    if (unconnectedNodeIds.length > 0) {
      alert(
        `Save failed: the following node(s) are not connected to any other node: ${unconnectedNodeIds.join(
          ", "
        )}`
      );
      return;
    }

    // Update node label changes
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                label: textAreaValue,
              },
            }
          : node
      )
    );

    alert("All nodes are connected! Changes saved.");
  };

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
      <div
        style={{
          width: "100%",
          height: "50px",
          backgroundColor: theme === "light" ? "#fff" : "#222",
        }}
      >
        {" "}
        <div
          style={{
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <label style={{ color: theme === "dark" ? "#fff" : "#000" }}>
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
            />
            Dark Mode
          </label>

          <button
            onClick={handleSave}
            style={{
              marginRight: "100px",
              padding: "5px",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

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
            style={panelItemStyle}
          >
            Text Message
          </div>
        </Panel>

        {/* Settings Panel */}
        <Panel hidden={!selectedNode} position="right" style={panelStyle}>
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
                  onChange={(e) => setTextAreaValue(e.target.value)}
                  style={{ padding: "5px" }}
                ></textarea>
              </div>
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
