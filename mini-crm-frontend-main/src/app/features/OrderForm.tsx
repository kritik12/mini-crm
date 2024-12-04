import { LoadingSpinner } from "@/components/shared/LoaderSpinner";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl, validateForm } from "@/lib/utils";
import { NewOrderForm, NewOrderFormType } from "@/types";
import { useState } from "react";

const OrderForm = () => {
  const [formData, setFormData] = useState<NewOrderFormType>({
    customerId: 0,
    customerName: "",
    customerEmail: "",
    purchaseAmount: 0,
    purchaseDate: new Date().toISOString(),
    mobileNumber: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof NewOrderFormType, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "customerId" || name === "purchaseAmount"
          ? Number(value)
          : value,
    }));
  };

  const handlePreFill = async () => {
    // Check if email is valid before making the API call
    if (!formData.mobileNumber) {
      toast({
        title: "Error",
        description: "Please enter an email first",
        variant: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${getApiUrl()}/customer/${formData.mobileNumber}`
      );

      if (!response.ok) {
        throw new Error("Customer not found");
      }
      const customerData = await response.json();
      setFormData((prev) => ({
        ...prev,
        customerId: customerData.id || 0,
        customerName: customerData.name || prev.customerName,
        customerEmail: customerData.email || prev.customerEmail,
      }));
      toast({
        title: "Success",
        description: "Customer details retrieved",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find customer with this email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    // Validate the form data
    const { validatedData, errors: validationErrors } = validateForm(
      formData,
      NewOrderForm
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
    try {
      setIsLoading(true);
      const response = await fetch(`${getApiUrl()}/new-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();
      console.log("API response: ", result);
      toast({
        title: "Success",
        description: "Order created successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Unexpected error: ", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-sidebar-primary-foreground rounded-xl mx-auto p-4 border shadow">
      {isLoading && <LoadingSpinner />}
      <h2 className="font-bold mb-4">New Order Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="mobileNumber"
          >
            Customer Mobile Number
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="tel"
              name="mobileNumber"
              id="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md p-2 ${
                errors.mobileNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={handlePreFill}
              disabled={isLoading}
              className="mt-1 w-full max-w-40 bg-blue-500 whitespace-nowrap text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Pre-fill
            </button>
          </div>
          {errors.mobileNumber && (
            <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="customerEmail"
          >
            Customer Email
          </label>
          <input
            type="text"
            name="customerEmail"
            id="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.customerEmail ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">{errors.customerEmail}</p>
          )}
        </div>
        {/* Rest of the form remains the same */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="customerName"
          >
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            id="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.customerName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">{errors.customerName}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="purchaseAmount"
          >
            Purchase Amount
          </label>
          <input
            type="number"
            name="purchaseAmount"
            id="purchaseAmount"
            value={formData.purchaseAmount}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.purchaseAmount ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.purchaseAmount && (
            <p className="text-red-500 text-sm">{errors.purchaseAmount}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="purchaseDate"
          >
            Purchase Date
          </label>
          <input
            type="date"
            name="purchaseDate"
            id="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.purchaseDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.purchaseDate && (
            <p className="text-red-500 text-sm">{errors.purchaseDate}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
