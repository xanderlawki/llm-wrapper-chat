import MainContent from "../components/MainContent/MainContent";
import Sidebar from "../components/Sidebar/sidebar";

export default function Home() {
  return (
    <div
      style={{ position: "relative", flexDirection: "row", display: "flex" }}
    >
      <div style={{ position: "fixed" }}>
        <Sidebar />
      </div>

      <MainContent />
    </div>
  );
}
