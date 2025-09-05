import { HandHeart, Twitter, Facebook, Linkedin, Github } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12" data-testid="footer-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <HandHeart className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AgniAid</h3>
                <p className="text-sm opacity-80">Disaster Relief Platform</p>
              </div>
            </div>
            <p className="opacity-80 text-sm mb-6">
              Connecting survivors, volunteers, NGOs, and donors with AI-powered coordination and blockchain transparency. No cry for help goes unheard.
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

          <div>
            <h4 className="font-bold mb-4">For Survivors</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/emergency" className="hover:text-primary transition-colors" data-testid="link-emergency-help">Request Emergency Help</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-track-case">Track Your Case</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-local-resources">Find Local Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-community-support">Community Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-recovery-planning">Recovery Planning</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">For Helpers</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/volunteer" className="hover:text-primary transition-colors" data-testid="link-volunteer-registration">Volunteer Registration</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-ngo-partnership">NGO Partnership</a></li>
              <li><Link href="/donate" className="hover:text-primary transition-colors" data-testid="link-corporate-donations">Corporate Donations</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-skill-matching">Skill-Based Matching</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-impact-tracking">Impact Tracking</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-emergency-preparedness">Emergency Preparedness</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-documentation">Platform Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-api">API for Developers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-security">Security & Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-blockchain-explorer">Blockchain Explorer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm opacity-80">
              © 2024 AgniAid Platform. All rights reserved. • Emergency Hotline: 1-800-AGNIAID
            </div>
            <div className="flex space-x-6 text-sm opacity-80">
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
