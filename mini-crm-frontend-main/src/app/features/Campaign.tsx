import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { CampaignStatsType, DeliveryReceiptType } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoaderSpinner";
import { useToast } from "@/hooks/use-toast";

const mobileNumberSchema = z.string().min(10, "Invalid mobile number").max(10, "Invalid mobile number");

const Campaign: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaignStats, setCampaignStats] = useState<CampaignStatsType | null>(
    null
  );
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [mobileNumberError, setMobileNumberError] = useState<string | null>(null);
  const [deliveryReceipt, setDeliveryReceipt] =
    useState<DeliveryReceiptType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaignStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${getApiUrl()}/get-campaign-stats/${campaignId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Add authorization headers if needed
              // 'Authorization': `Bearer ${token}`
            },
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorBody}`
          );
        }

        const data: CampaignStatsType = await response.json();

        // Validate data structure
        if (!data || typeof data.campaign_id !== "number") {
          throw new Error("Invalid campaign stats data");
        }
        toast({
          title: "Success",
          description: "Campaign stats fetched successfully",
          variant: "success",
        })
        setCampaignStats(data);
      } catch (error) {
        console.error("Error fetching campaign stats:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch campaign stats",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignStats();
  }, [campaignId, toast]);

  const handleMobileNumberSubmit = async () => {
    // Clear previous state
    setMobileNumberError(null);
    setDeliveryReceipt(null);

    try {
      // Validate mobileNumber
      const parsedMobileNumber = mobileNumberSchema.safeParse(mobileNumber);
      if (!parsedMobileNumber.success) {
        setMobileNumberError("Invalid mobileNumber address");
        return;
      }

      // Call delivery receipt API
      const response = await fetch(`${getApiUrl()}/delivery-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          campaignId,
          mobileNumber: mobileNumber,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }

      const data: DeliveryReceiptType = await response.json();

      // Validate response data
      if (!data || !data.status) {
        throw new Error("Invalid delivery receipt data");
      }

      setDeliveryReceipt(data);

      // Show success toast
      toast({
        title: "Success",
        description: "Delivery receipt generated",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting mobileNumber:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate delivery receipt",
        variant: "destructive",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!campaignStats) {
    return (
      <div className="p-4 text-center text-gray-500">
        No campaign details found
      </div>
    );
  }

  const pieData = [
    { name: "Sent", value: campaignStats.total_sent },
    { name: "Failed", value: campaignStats.total_failed },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  return (
    <div className="p-4 space-y-6 mx-auto max-w-sm min-w-full sm:max-w-full">
      {/* Campaign Details */}
      <div className="border p-4 rounded shadow">
        <h1 className="text-xl font-bold">Campaign Details</h1>
        <p>
          <strong>Campaign ID:</strong> {campaignStats.campaign_id}
        </p>
        <p>
          <strong>Segment Name:</strong> {campaignStats.segment_name}
        </p>
        <p>
          <strong>Audience Size:</strong> {campaignStats.audience_size}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(campaignStats.created_at).toLocaleString()}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Delivery Status</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Email Input */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Send Delivery Receipt</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter Phone number"
            value={mobileNumber}
            maxLength={10}
            onChange={(e) => setMobileNumber(e.target.value)}
            className={`border rounded p-2 w-full ${mobileNumberError ? "border-red-500" : "border-gray-300"
              }`}
          />
          {mobileNumberError && <p className="text-red-500 text-sm">{mobileNumberError}</p>}
          <button
            onClick={handleMobileNumberSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Delivery Receipt */}
      {deliveryReceipt && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Delivery Receipt</h2>
          <p>
            <strong>Message:</strong> {deliveryReceipt.message}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-bold ${deliveryReceipt.status === "SENT"
                  ? "text-green-500"
                  : " text-red-500"
                }`}
            >
              {deliveryReceipt.status}
            </span>
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(deliveryReceipt.created_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Campaign;
