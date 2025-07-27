export default function SettingsPanel({ textAreaValue, setTextAreaValue }) {
  return (
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
  );
}
