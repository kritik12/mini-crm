import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '@/lib/utils';
import { SegmentType } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoaderSpinner';
import { useToast } from '@/hooks/use-toast';

const Segment: React.FC = () => {
    const { segmentId } = useParams<{ segmentId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [segment, setSegment] = useState<SegmentType | null>(null);
    const [audienceSize, setAudienceSize] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSegmentDetails = async () => {
            try {
                // Fetch Segment Details
                const segmentResponse = await fetch(`${getApiUrl()}/get-segment-details/${segmentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authorization headers if needed
                        // 'Authorization': `Bearer ${token}`
                    },
                });

                if (!segmentResponse.ok) {
                    const errorBody = await segmentResponse.text();
                    throw new Error(`Segment fetch error: ${segmentResponse.status} - ${errorBody}`);
                }

                const segmentData: SegmentType = await segmentResponse.json();

                // Validate segment data
                if (!segmentData || !segmentData.segment_name) {
                    throw new Error('Invalid segment data');
                }

                setSegment(segmentData);

                // Fetch Audience Size
                const audienceResponse = await fetch(`${getApiUrl()}/get-audience-size/${segmentId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!audienceResponse.ok) {
                    const errorBody = await audienceResponse.text();
                    throw new Error(`Audience size fetch error: ${audienceResponse.status} - ${errorBody}`);
                }

                const audienceData: { audienceSize: number } = await audienceResponse.json();
                setAudienceSize(audienceData.audienceSize);

            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: 'Error',
                    description: error instanceof Error 
                        ? error.message 
                        : 'Failed to fetch segment details',
                    variant: 'destructive'
                });
                
                // Optionally redirect on error
                navigate('/segments');
            } finally {
                setLoading(false);
            }
        };

        fetchSegmentDetails();
    }, [segmentId, navigate, toast]);

    const handleCampaignSubmit = async () => {
        // Validate message
        if (!message.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a campaign message',
                variant: 'destructive'
            });
            return;
        }

        try {
            const response = await fetch(`${getApiUrl()}/add-campaign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization headers if needed
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    segmentId: segmentId,
                    audienceSize,
                    message,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Campaign submission error: ${response.status} - ${errorBody}`);
            }

          //  const data = await response.json();

            // Show success toast
            toast({
                title: 'Success',
                description: 'Campaign added successfully',
                variant: 'success'
            });

            // Clear the message
            setMessage('');

            // Optionally navigate to campaigns or do something else
            navigate('/campaigns');

        } catch (error) {
            console.error('Error adding campaign:', error);
            toast({
                title: 'Error',
                description: error instanceof Error 
                    ? error.message 
                    : 'Failed to add campaign',
                variant: 'destructive'
            });
        }
    };

    if (loading) return <LoadingSpinner />;

    if (!segment) {
        return (
            <div className="p-4 text-center text-gray-500">
                No segment details found
            </div>
        );
    }

    return (
        <div className="p-4 min-w-full mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">{segment.segment_name}</h1>
                
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">
                            <strong>Low Par:</strong> {segment.low_par}
                        </p>
                        <p className="text-gray-600">
                            <strong>High Par:</strong> {segment.high_par}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">
                            <strong>Visits:</strong> {segment.least_visits} - {segment.most_visits}
                        </p>
                        <p className="text-gray-600">
                            <strong>Last Visit Days:</strong> {segment.last_visit_days}
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-700">Audience Size</h2>
                    <p className="text-blue-600 font-bold text-lg">{audienceSize}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-700">Create Campaign</h2>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter campaign message..."
                        className="w-full border rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows={4}
                    />
                    <button
                        onClick={handleCampaignSubmit}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Submit Campaign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Segment;