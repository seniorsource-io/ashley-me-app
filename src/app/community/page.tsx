//import { createHubSpotCompany } from './actions'
import Navbar from "@/components/Navbar";
import CommunityContact from "@/components/CommunityContact";
import CommunityJoinUs from "@/components/CommunityJoinUs";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  formatDetection: {
    address: false,
    email: false,
  },
}

export default function CommunityForm() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <CommunityContact />
            <CommunityJoinUs />
            <Footer />
        </div>
    );
}