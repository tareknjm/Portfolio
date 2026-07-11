import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Blobs décoratifs en fond */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}