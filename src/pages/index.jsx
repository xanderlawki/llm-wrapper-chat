import MainContent from "@/components/MainContent";
import Sidebar from "@/components/Sidebar";

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
