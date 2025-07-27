import { useCallback } from "react";

export function useFlowHandlers({
  nodes,
  setNodes,
  selectedNode,
  edges,
  textAreaValue,
  screenToFlowPosition,
}) {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // for future enhancement - has no use as of now
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
    [setNodes, screenToFlowPosition]
  );

  const handleSave = () => {

    //make sure all nodes are connected
    const allNodeIds = nodes.map((node) => node.id);
    const connectedNodeIds = new Set();

    edges.forEach((edge) => {
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
        node.id === selectedNode?.id
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
  return { handleDragStart, handleDragOver, handleDrop, handleSave };
}
