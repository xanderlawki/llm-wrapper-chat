import MainContent from "@/components/MainContent/MainContent";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <div
      style={{ position: "relative", flexDirection: "row", display: "flex" }}
    >
      <div>
        <Sidebar />
      </div>

      <MainContent />
    </div>
  );
}
