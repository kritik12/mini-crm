import { LoadingSpinner } from "@/components/shared/LoaderSpinner";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl, validateForm } from "@/lib/utils";
import { SegmentFormType, SegmentSchemaForm } from "@/types";
import { useState } from "react";

const SegmentForm = () => {
  const [formData, setFormData] = useState<SegmentFormType>({
    segmentName: "",
    lowPar: 0,
    highPar: 0,
    leastVisits: 0,
    mostVisits: 0,
    lastVisitDays: 0,
  });
  const { toast } = useToast();
  const [errors, setErrors] = useState<
    Partial<Record<keyof SegmentFormType, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "segmentName" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Reset errors

    // Validate the form data using the utility function
    const { validatedData, errors: validationErrors } = validateForm(
      formData,
      SegmentSchemaForm
    );

    if (validationErrors) {
      setErrors(validationErrors);
      toast({
        title: "Error",
        description: "Please check the form for errors",
        variant: "warning",
      });
      return;
    }

    // Proceed with the API call if validation is successful
    try {
      setIsLoading(true);
      const response = await fetch(`${getApiUrl()}/create-segment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });
      const result = await response.json();
      console.log("API Response:", result);
      toast({
        title: "Success",
        description: "Segment created successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the segment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="size-full bg-sidebar-primary-foreground rounded-xl mx-auto p-4 border shadow">
      {isLoading && <LoadingSpinner />}
      <h2 className="font-bold mb-4 tracking-tight">Add Segment Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="segmentName">
            Segment Name
          </label>
          <input
            id="segmentName"
            name="segmentName"
            type="text"
            value={formData.segmentName}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${
              errors.segmentName ? "border-red-500" : ""
            }`}
          />
          {errors.segmentName && (
            <p className="text-red-500 text-sm">{errors.segmentName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" htmlFor="lowPar">
            Low Parameter
          </label>
          <input
            id="lowPar"
            name="lowPar"
            type="number"
            value={formData.lowPar}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${
              errors.lowPar ? "border-red-500" : ""
            }`}
          />
          {errors.lowPar && (
            <p className="text-red-500 text-sm">{errors.lowPar}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" htmlFor="highPar">
            High Parameter
          </label>
          <input
            id="highPar"
            name="highPar"
            type="number"
            value={formData.highPar}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${
              errors.highPar ? "border-red-500" : ""
            }`}
          />
          {errors.highPar && (
            <p className="text-red-500 text-sm">{errors.highPar}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" htmlFor="leastVisits">
            Least Visits
          </label>
          <input
            id="leastVisits"
            name="leastVisits"
            type="number"
            value={formData.leastVisits}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${
              errors.leastVisits ? "border-red-500" : ""
            }`}
          />
          {errors.leastVisits && (
            <p className="text-red-500 text-sm">{errors.leastVisits}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" htmlFor="mostVisits">
            Most Visits
          </label>
          <input
            id="mostVisits"
            name="mostVisits"
            type="number"
            value={formData.mostVisits}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${
              errors.mostVisits ? "border-red-500" : ""
            }`}
          />
          {errors.mostVisits && (
            <p className="text-red-500 text-sm">{errors.mostVisits}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" htmlFor="lastVisitDays">
            Last Visit Days
          </label>
          <input
            id="lastVisitDays"
            name="lastVisitDays"
            type="number"
            value={formData.lastVisitDays}
            onChange={handleChange}
            className={`border rounded w-full p-2 ${
              errors.lastVisitDays ? "border-red-500" : ""
            }`}
          />
          {errors.lastVisitDays && (
            <p className="text-red-500 text-sm">{errors.lastVisitDays}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 font-bold text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SegmentForm;
