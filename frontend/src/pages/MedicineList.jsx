import { useEffect, useState } from "react";
import { getMedicines } from "../services/api";
import { PackageSearch, AlertCircle, Pill, ChevronRight, Loader } from "lucide-react";

// Dummy data for testing UI without backend
  const dummyMedicines = [
    {
      _id: "1",
      brandName: "Paracet Plus",
      genericName: "Paracetamol",
      status: "Active",
      strength: "500 mg",
      dosageForm: "Tablet",
      category: "Analgesic",
      batchNumber: "BATCH-2024-09",
      expiryDate: "2026-12-01",
      stage: "Manufactured",
      blockchainStatus: "confirmed", // confirmed | pending | failed
      blockchainUpdatedAt: "2025-01-29T14:22:00Z"
    },
    {
      _id: "2",
      brandName: "Amoxil",
      genericName: "Amoxicillin",
      status: "Active",
      strength: "250 mg",
      dosageForm: "Capsule",
      category: "Antibiotic",
      batchNumber: "BATCH-2024-06",
      expiryDate: "2025-10-15",
       stage: "Distributed",
      blockchainStatus: "pending", // confirmed | pending | failed
      blockchainUpdatedAt: "2025-11-30T14:22:00Z"
    },
    {
      _id: "3",
      brandName: "Ibu Relief",
      genericName: "Ibuprofen",
      status: "Discontinued",
      strength: "400 mg",
      dosageForm: "Tablet",
      category: "Anti-inflammatory",
      batchNumber: "BATCH-2023-11",
      expiryDate: "2024-12-01",
      stage: "Retail",
      blockchainStatus: "failed", // confirmed | pending | failed
      blockchainUpdatedAt: "2025-06-29T14:22:00Z"
    },
  ];

  
// Metadata for stages
const stageMeta = {
  Ordered: { label: "Ordered", icon: "📝" },
  RawMaterialSupplied: { label: "Raw Material Supplied", icon: "🧪" },
  Manufactured: { label: "Manufactured", icon: "🏭" },
  Distributed: { label: "Distributed", icon: "🚚" },
  Retail: { label: "Retail", icon: "🏪" },
  Sold: { label: "Sold", icon: "✅" },
};

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await getMedicines();
        setMedicines(response.data);
      } catch (error) { // Handle errors more gracefully
        console.error("Error fetching medicines:", error);

        // Fallback to dummy data for UI demonstration
        setMedicines(dummyMedicines);
        setError("Live data unavailable. Displaying demo data for preview purposes.");
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const getStageColor = (stage) => {
    const stageColors = {
      "Ordered": "bg-yellow-100 text-yellow-800",
      "RawMaterialSupplied": "bg-blue-100 text-blue-800",
      "Manufactured": "bg-purple-100 text-purple-800",
      "Distributed": "bg-green-100 text-green-800",
      "Retail": "bg-indigo-100 text-indigo-800",
      "Sold": "bg-gray-100 text-gray-800"
    };
    return stageColors[stage] || "bg-gray-100 text-gray-800";
  };

  const stageCounts = medicines.reduce((acc, med) => {
    acc[med.stage] = (acc[med.stage] || 0) + 1;
    return acc;
  }, {});

  const blockchainMeta = {
  confirmed: {
    label: "Recorded",
    color: "text-green-600",
    icon: "🔗",
  },
  pending: {
    label: "Pending",
    color: "text-yellow-600",
    icon: "⏳",
  },
  failed: {
    label: "Failed",
    color: "text-red-600",
    icon: "⚠️",
  },
};
  
  const getStatusColor = (status) => {
    const map = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-gray-100 text-gray-800",
      Discontinued: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  console.log("Medicines state:", medicines);
  return (
    <div className="min-h-screen bg-gray-800 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 rounded-lg mr-4 shadow-md">
            <PackageSearch className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Medicine List</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="h-10 w-10 text-green-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading medicines...</p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-center">
            <AlertCircle className="h-8 w-8 text-blue-500 mr-4" />
            <p className="text-blue-700">No medicines found.</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
                <p className="text-yellow-800 text-sm">{error}</p>
              </div>
            )}

            {/* Status summary bar */}
            <div className="mb-6 flex flex-wrap gap-3">
              {Object.entries(stageCounts).map(([stage, count]) => (
                <span
                  key={stage}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(stage)}`}
                >
                  {stageMeta[stage]?.label || stage}: {count}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {medicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all
                    ${medicine.status === "Discontinued"
                      ? "opacity-80 grayscale cursor-not-allowed"
                      : "hover:shadow-lg"
                    }`}
                >

                  <div className="border-b border-gray-100 p-4 flex items-center gap-3">
                    {/* Icon */}
                  <div className="bg-green-100 p-2 rounded-full">
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                    {/* Title */}
                  <h3 className="font-semibold text-lg text-black">
                    {medicine.brandName}
                    <span className="text-sm text-gray-500 ml-1">
                      ({medicine.genericName})
                    </span>
                  </h3>
                      {/* RIGHT SIDE BADGES */}
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStageColor(
                        medicine.stage
                      )}`}
                    >
                      {stageMeta[medicine.stage]?.icon}{" "}
                      {stageMeta[medicine.stage]?.label}
                    </span>

                      {/* Status */}
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(
                          medicine.status
                        )}`}
                      >
                        {medicine.status}
                      </span>
                    </div>
                        
      
                  <div className="p-4">
                    {/* Two-column info row */}
                    <div className="flex justify-between gap-4">
                      {/* LEFT */}
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          {medicine.strength} • {medicine.dosageForm}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Category: {medicine.category}
                        </p>
                      </div>

                      {/* RIGHT */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Batch: {medicine.batchNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Expiry:{" "}
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 text-xs flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          blockchainMeta[medicine.blockchainStatus]?.color
                        }`}
                      >
                        {blockchainMeta[medicine.blockchainStatus]?.icon} Blockchain:{" "}
                        {blockchainMeta[medicine.blockchainStatus]?.label}
                      </span>

                      <span className="text-gray-400">
                        • {new Date(medicine.blockchainUpdatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    {/* Actions */}
                    <div className="relative group mt-4">
                      <button
                        disabled
                        className="w-full flex items-center justify-center text-gray-400 text-sm font-medium cursor-not-allowed"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>

                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                                      opacity-0 group-hover:opacity-100 transition
                                      bg-black text-white text-xs rounded px-3 py-1
                                      pointer-events-none whitespace-nowrap">
                        Feature will be enabled after deployment
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicineList;