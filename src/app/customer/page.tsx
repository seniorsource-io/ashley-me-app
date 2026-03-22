import Navbar from "@/components/Navbar";
import CustomerContact from "@/components/CustomerContact";
import Footer from "@/components/Footer";

export default function CustomerForm() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CustomerContact />
      <Footer />
    </div>
  );
}
