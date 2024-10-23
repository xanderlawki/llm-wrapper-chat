import MainContent from "../components/MainContent/MainContent";
import Sidebar from "../components/Sidebar/sidebar";

export default function Home() {
  return (
    <div>
      <div style={{ position: "fixed" }}>
        <Sidebar />
      </div>

      <MainContent />
    </div>
  );
}
