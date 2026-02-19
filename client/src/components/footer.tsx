import { HandHeart, Twitter, Facebook, Linkedin, Github } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-12" data-testid="footer-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <HandHeart className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">RescueHub</h3>
                <p className="text-sm opacity-80">Disaster Relief Platform</p>
              </div>
            </div>
            <p className="opacity-80 text-sm mb-6">
              Connecting survivors, volunteers, NGOs, and donors with AI-powered coordination. No cry for help goes unheard.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors" data-testid="link-social-twitter">
                <Twitter className="text-white h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors" data-testid="link-social-facebook">
                <Facebook className="text-white h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors" data-testid="link-social-linkedin">
                <Linkedin className="text-white h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors" data-testid="link-social-github">
                <Github className="text-white h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 dark:border-stone-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              © 2025 RescueHub Platform. All rights reserved. • Emergency Hotline: 1-800-RescueHub
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-privacy-policy">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-terms">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
