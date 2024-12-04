import { LoadingSpinner } from "@/components/shared/LoaderSpinner";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/lib/utils";
import { SegmentType } from "@/types";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllSegments = () => {
  const [segments, setSegments] = useState<SegmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSegments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${getApiUrl()}/fetch-all-segments`, {
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

        const data: SegmentType[] = await response.json();

        // Additional validation if needed
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }
        toast({
          title: "Segments fetched successfully",
          description: "You can now view all your segments",
          variant: "success",
        });
        setSegments(data);
      } catch (error) {
        console.error("Error fetching segments:", error);

        // Use toast for user-friendly error message
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch segments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, [toast]);

  const deleteSegment = async (id: number) => {
    try {
      const response = await fetch(`${getApiUrl()}/delete-segment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers like authorization if needed
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorBody}`
        );
      }

      // Optimistically remove the segment from the list
      setSegments((prevSegments) =>
        prevSegments.filter((segment) => segment.id !== id)
      );

      // Show success toast
      toast({
        title: "Success",
        description: "Segment deleted successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting segment:", error);

      // Show error toast
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete segment",
        variant: "destructive",
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {segments.map(
        ({
          id,
          segment_name,
          low_par,
          high_par,
          least_visits,
          most_visits,
          last_visit_days,
        }) => (
          <Link
            to={`/segments/${id}`}
            key={id}
            className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:bg-neutral-50 relative"
          >
            <div className="text-xl font-semibold mb-3 text-gray-800">
              {segment_name}
            </div>
            <div className="mb-2">
              <p className="text-gray-600">
                <strong className="text-gray-900">Low Par:</strong> {low_par}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-900">High Par:</strong> {high_par}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-900">Visits:</strong>{" "}
                {least_visits} - {most_visits}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-900">Last Visit Days:</strong>{" "}
                {last_visit_days}
              </p>
            </div>
            <button
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
              onClick={() => deleteSegment(id)}
            >
              <Trash size={24} />
            </button>
          </Link>
        )
      )}

      {segments.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          No segments found
        </div>
      )}
    </div>
  );
};

export default AllSegments;
