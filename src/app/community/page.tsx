//import { createHubSpotCompany } from './actions'
import Navbar from "@/components/Navbar";
import CommunityContact from "@/components/CommunityContact";
import CommunityJoinUs from "@/components/CommunityJoinUs";
import Footer from "@/components/Footer";

export default function CommunityForm() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <CommunityJoinUs />
            <CommunityContact />
            <Footer />
        </div>
    );
}