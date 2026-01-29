const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Expense Tracker. All rights reserved.
          </div>
          <div className="flex space-x-4 text-sm text-gray-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;