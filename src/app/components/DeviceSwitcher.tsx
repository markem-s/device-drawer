import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Smartphone, MapPin, AlertTriangle } from "lucide-react";

interface Device {
  id: string;
  model: string;
  location: string;
  threatScore: number;
  lastSeen: string;
}

interface DeviceSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentDeviceId: string;
  onDeviceSelect: (deviceId: string) => void;
}

// Mock device data - replace with actual data source
const generateMockDevices = (): Device[] => {
  const models = ["iPhone 13 Pro", "iPhone 14 Pro Max", "iPhone 12", "iPhone 15 Pro", "Samsung Galaxy S23", "Google Pixel 8"];
  const locations = ["Tehran, Iran", "Dubai, UAE", "Istanbul, Turkey", "London, UK", "Paris, France", "Berlin, Germany"];

  return Array.from({ length: 100 }, (_, i) => ({
    id: String(837365 + i),
    model: models[i % models.length],
    location: locations[i % locations.length],
    threatScore: Math.floor(Math.random() * 100),
    lastSeen: `${Math.floor(Math.random() * 60)} min ago`,
  }));
};

export function DeviceSwitcher({ isOpen, onClose, currentDeviceId, onDeviceSelect }: DeviceSwitcherProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [devices] = useState<Device[]>(generateMockDevices());
  const [filteredDevices, setFilteredDevices] = useState<Device[]>(devices);

  // Filter devices based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDevices(devices);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = devices.filter(
      (device) =>
        device.id.includes(query) ||
        device.model.toLowerCase().includes(query) ||
        device.location.toLowerCase().includes(query)
    );
    setFilteredDevices(filtered);
  }, [searchQuery, devices]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDeviceSelect = (deviceId: string) => {
    onDeviceSelect(deviceId);
    onClose();
  };

  const getThreatColor = (score: number) => {
    if (score >= 70) return "text-[#ff6b6b]";
    if (score >= 40) return "text-[#ffa500]";
    return "text-[#4ade80]";
  };

  const getThreatLabel = (score: number) => {
    if (score >= 70) return "HIGH";
    if (score >= 40) return "MEDIUM";
    return "LOW";
  };

  // Get recently viewed devices (first 5 for demo)
  const recentDevices = devices.slice(0, 5);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-[10%] -translate-x-1/2 w-full max-w-[600px] z-[70] bg-[#0d0d0d] border border-[#2b2b2b] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2b2b2b]">
              <h2 className="text-[14px] font-['IBM_Plex_Sans:Regular',sans-serif] text-[#e5e5e5] uppercase">
                Switch Device
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
              >
                <X size={18} className="text-[#9b9b9b]" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-[#2b2b2b]">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b9b9b]" />
                <input
                  type="text"
                  placeholder="Search by ID, model, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#080808] border border-[#2b2b2b] rounded-md pl-10 pr-4 py-2 text-[12px] text-[#e5e5e5] placeholder-[#9b9b9b] focus:outline-none focus:border-[#4a4a4a] font-['IBM_Plex_Sans:Regular',sans-serif]"
                  autoFocus
                />
              </div>
            </div>

            {/* Device List */}
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
              {/* Recent Devices Section */}
              {!searchQuery && (
                <div className="p-4 border-b border-[#2b2b2b]">
                  <div className="text-[10px] text-[#9b9b9b] uppercase font-['IBM_Plex_Sans:Regular',sans-serif] mb-3">
                    Recent Devices
                  </div>
                  <div className="space-y-2">
                    {recentDevices.map((device) => (
                      <DeviceCard
                        key={device.id}
                        device={device}
                        isActive={device.id === currentDeviceId}
                        onClick={() => handleDeviceSelect(device.id)}
                        getThreatColor={getThreatColor}
                        getThreatLabel={getThreatLabel}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Devices Section */}
              <div className="p-4">
                <div className="text-[10px] text-[#9b9b9b] uppercase font-['IBM_Plex_Sans:Regular',sans-serif] mb-3">
                  {searchQuery ? `Results (${filteredDevices.length})` : "All Devices"}
                </div>
                <div className="space-y-2">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <DeviceCard
                        key={device.id}
                        device={device}
                        isActive={device.id === currentDeviceId}
                        onClick={() => handleDeviceSelect(device.id)}
                        getThreatColor={getThreatColor}
                        getThreatLabel={getThreatLabel}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#9b9b9b] text-[12px] font-['IBM_Plex_Sans:Regular',sans-serif]">
                      No devices found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#2b2b2b] bg-[#080808] rounded-b-lg">
              <div className="text-[10px] text-[#9b9b9b] font-['IBM_Plex_Sans:Regular',sans-serif] text-center">
                Press ESC to close • Use arrow keys to navigate
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface DeviceCardProps {
  device: Device;
  isActive: boolean;
  onClick: () => void;
  getThreatColor: (score: number) => string;
  getThreatLabel: (score: number) => string;
}

function DeviceCard({ device, isActive, onClick, getThreatColor, getThreatLabel }: DeviceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-md border transition-all text-left ${
        isActive
          ? "bg-[#1a1a1a] border-[#4a4a4a]"
          : "bg-[#080808] border-[#2b2b2b] hover:bg-[#0f0f0f] hover:border-[#3a3a3a]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left side - Device info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5">
            <Smartphone size={16} className="text-[#9b9b9b]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[13px] text-[#e5e5e5] font-['IBM_Plex_Sans:Regular',sans-serif]">
                {device.id}
              </div>
              {isActive && (
                <div className="text-[9px] text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded uppercase font-['IBM_Plex_Sans:Regular',sans-serif]">
                  Current
                </div>
              )}
            </div>
            <div className="text-[11px] text-[#9b9b9b] font-['IBM_Plex_Sans:Regular',sans-serif] mb-1">
              {device.model}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#9b9b9b] font-['IBM_Plex_Sans:Regular',sans-serif]">
              <MapPin size={10} />
              <span>{device.location}</span>
              <span className="mx-1">•</span>
              <span>{device.lastSeen}</span>
            </div>
          </div>
        </div>

        {/* Right side - Threat indicator */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <AlertTriangle size={12} className={getThreatColor(device.threatScore)} />
            <div className={`text-[11px] font-['IBM_Plex_Sans:Regular',sans-serif] ${getThreatColor(device.threatScore)}`}>
              {device.threatScore}
            </div>
          </div>
          <div className={`text-[9px] font-['IBM_Plex_Sans:Regular',sans-serif] uppercase ${getThreatColor(device.threatScore)}`}>
            {getThreatLabel(device.threatScore)}
          </div>
        </div>
      </div>
    </button>
  );
}
