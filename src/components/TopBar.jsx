export default function TopBar({ theme, setTheme, handleSave }) {
  return (
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
  );
}
