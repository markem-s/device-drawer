import { useState } from "react";
import { DeviceDetailsDrawer } from "./components/DeviceDetailsDrawer";

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Open Device Details
      </button>

      <DeviceDetailsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}
