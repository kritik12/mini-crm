import React, { useState, useEffect } from "react";
import { CampaignType } from "@/types";
import { Link } from "react-router-dom";
import { getApiUrl } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoaderSpinner";
import { useToast } from "@/hooks/use-toast";

const AllCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${getApiUrl()}/fetch-all-campaigns`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers like authorization if needed
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          // Handle HTTP errors
          const errorBody = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorBody}`
          );
        }

        const data: CampaignType[] = await response.json();

        // Additional validation if needed
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        // Validate each campaign object
        const isValidCampaigns = data.every(
          (campaign) =>
            campaign &&
            typeof campaign.id === "number" &&
            typeof campaign.audience_size === "number"
        );

        if (!isValidCampaigns) {
          throw new Error("Invalid campaign data structure");
        }

        setCampaigns(data);
        toast({
          title: "Campaigns fetched successfully",
          description: "You can now view all your campaigns",
          variant: "success",
        });
      } catch (error) {
        console.error("Error fetching campaigns:", error);

        // Use toast for user-friendly error message
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch campaigns",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [toast]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      {campaigns.length > 0 ? (
        campaigns.map(
          ({ id, audience_size, segment_id, segment_name, created_at }) => (
            <Link
              to={`/campaigns/${id}`}
              key={id}
              className="border rounded-md shadow-md p-4 hover:shadow-lg transition-all relative"
            >
              <p>
                <strong>Campaign ID:</strong> {id}
              </p>
              <p>
                <strong>Audience Size:</strong> {audience_size}
              </p>
              <p>
                <strong>Segment ID:</strong> {segment_id}
              </p>
              <p>
                <strong>Segment Name:</strong> {segment_name}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(created_at).toLocaleString()}
              </p>
            </Link>
          )
        )
      ) : (
        <div className="col-span-full text-center text-gray-500">
          No campaigns found
        </div>
      )}
    </div>
  );
};

export default AllCampaigns;
