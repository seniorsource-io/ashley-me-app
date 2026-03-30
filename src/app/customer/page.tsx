import Navbar from "@/components/navbar";
import CustomerContact from "@/components/customer-contact";
import Footer from "@/components/footer";

export default function CustomerForm() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CustomerContact />
      <Footer />
    </div>
  );
}
