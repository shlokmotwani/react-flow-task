export default function NodesPanel({ handleDragStart, panelItemStyle }) {
  return (
    <>
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
    </>
  );
}
