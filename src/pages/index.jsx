import MainContent from "@/Components/MainContent";
import Sidebar from "@/Components/Sidebar";

export default function Home() {
  return (
    <div
      style={{ position: "relative", flexDirection: "row", display: "flex" }}
    >
      <Sidebar />

      <MainContent />
    </div>
  );
}
