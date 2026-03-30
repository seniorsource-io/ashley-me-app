const Footer = () => {
    return (
        <footer className="bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-heading text-sm text-[hsl(var(--faint))]">
                    &copy; {new Date().getFullYear()} Senior One Source
                </p>
                <div className="flex gap-6 text-xs text-[hsl(var(--faint))]">
                    <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
                    <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
                    <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
