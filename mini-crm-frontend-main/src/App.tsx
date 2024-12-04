import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, Route, BrowserRouter as Router, Routes, Outlet } from "react-router-dom";
import SignInPage from "./app/auth/SignIn";
import SignUpPage from "./app/auth/SignUp";
import NotFound from "./components/shared/NotFound";
import SegmentForm from "./app/features/SegmentForm";
import RootLayout from "./app/layout/RootLayout";
import OrderForm from "./app/features/OrderForm";
import AllSegments from "./app/features/AllSegments";
import Segment from "./app/features/Segment";
import AllCampaigns from "./app/features/AllCampaigns";
import Campaign from "./app/features/Campaign";
import Homepage from "./app/layout/Homepage";

export default function App() {
  return (
    <Router>
      <main className="min-h-dvh min-w-full overflow-hidden bg-primary">
        <Routes>
          {/* Routes for Signed Out users */}
          <Route
            path="/sign-in"
            element={
              <SignedOut>
                <SignInPage />
              </SignedOut>
            }
          />
          <Route
            path="/sign-up"
            element={
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            }
          />

          {/* Routes for Signed In users */}
          <Route
            element={
              <SignedIn>
                <RootLayout>
                  <Outlet />
                </RootLayout>
              </SignedIn>
            }
          >
            <Route path="/home" element={<Homepage/>} />
            <Route path="/create-order" element={<OrderForm/>} />
            <Route path="/create-segment" element={<SegmentForm />} />
            <Route path="/segments" element={<AllSegments />} />
            <Route path="/segments/:segmentId" element={<Segment />} />
            <Route path="/campaigns" element={<AllCampaigns />} />
            <Route path="/campaigns/:campaignId" element={<Campaign />} />
          </Route>

          {/* Default and Fallback Routes */}
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Navigate to="/home" />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" />
                </SignedOut>
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}
