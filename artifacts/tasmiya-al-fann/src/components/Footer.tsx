import { Link } from "wouter";
import { FaInstagram, FaPinterest, FaTwitter } from "react-icons/fa";
import { GeometricPattern } from "./svgs/GeometricPattern";

export function Footer() {
  return (
    <footer className="relative bg-foreground text-background pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <GeometricPattern />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h3 className="font-heading text-3xl mb-4">TASMIYA AL-FANN</h3>
            <p className="text-muted-foreground max-w-md font-body font-light leading-relaxed mb-6">
              Curated Art, Timeless Expression. A luxury online gallery for original artwork where Islamic minimalism meets modern editorial elegance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-muted-foreground/30 rounded-full hover:bg-primary hover:border-primary transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 border border-muted-foreground/30 rounded-full hover:bg-primary hover:border-primary transition-colors">
                <FaPinterest className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 border border-muted-foreground/30 rounded-full hover:bg-primary hover:border-primary transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-xl mb-6 text-primary">Explore</h4>
            <ul className="space-y-4 font-body font-light text-sm text-muted-foreground">
              <li><Link href="/gallery" className="hover:text-background transition-colors">All Artwork</Link></li>
              <li><Link href="/gallery" className="hover:text-background transition-colors">Islamic Art</Link></li>
              <li><Link href="/gallery" className="hover:text-background transition-colors">Abstract Collection</Link></li>
              <li><Link href="/about" className="hover:text-background transition-colors">About Tasmiya</Link></li>
              <li><Link href="/commission" className="hover:text-background transition-colors">Commission a Piece</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-xl mb-6 text-primary">Newsletter</h4>
            <p className="text-muted-foreground text-sm font-light mb-4">
              Join our private list to receive early access to new collections.
            </p>
            <form className="flex border-b border-muted-foreground/30 pb-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent border-none outline-none flex-1 text-sm text-background placeholder:text-muted-foreground/50"
              />
              <button type="submit" className="text-xs uppercase tracking-widest hover:text-primary transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-muted-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground font-light">
          <p>&copy; {new Date().getFullYear()} Tasmiya Al-Fann. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-background">Privacy Policy</a>
            <a href="#" className="hover:text-background">Terms of Service</a>
            <a href="#" className="hover:text-background">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
