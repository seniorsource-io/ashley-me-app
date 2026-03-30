import Navbar from "@/components/navbar";
import CommunityContact from "@/components/community-contact";
import CommunityJoinUs from "@/components/community-join-us";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  formatDetection: {
    address: false,
    email: false,
  },
};

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
