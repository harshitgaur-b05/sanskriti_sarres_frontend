export default function ContactPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
       <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-label-md text-[10px] md:text-xs uppercase tracking-[0.25em] text-on-surface-variant block mb-4">Get in Touch</span>
          <h1 className="font-headline-lg lg:font-display-md text-headline-lg-mobile md:text-headline-lg lg:text-display-md text-on-surface mb-6">Concierge & Support</h1>
          <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
            Whether you are inquiring about a bespoke bridal trousseau, tracking an existing order, or simply wish to learn more about our archival weaves, our dedicated concierge team is here to assist you.
          </p>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Contact Information */}
        <div className="space-y-12">
          <div>
            <h3 className="font-title-lg text-xl text-on-surface mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">store</span>
              Varanasi Mill (Flagship)
            </h3>
            <p className="font-body-md text-on-surface-variant mb-2">Sankriti Sarees Mill, Weaver's District</p>
            <p className="font-body-md text-on-surface-variant mb-2">Varanasi, Uttar Pradesh, India - 221001</p>
            <p className="font-body-md text-on-surface-variant">Visits by appointment only for bridal consultations.</p>
          </div>
          
          <div>
            <h3 className="font-title-lg text-xl text-on-surface mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">mail</span>
              General Inquiries
            </h3>
            <p className="font-body-md text-on-surface-variant mb-2">Email: heritage@sankritisarees.com</p>
            <p className="font-body-md text-on-surface-variant">Phone: +91 98765 43210 (Mon-Sat, 10 AM - 6 PM IST)</p>
          </div>
           
           <div>
            <h3 className="font-title-lg text-xl text-on-surface mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">support_agent</span>
              Bridal Concierge
            </h3>
            <p className="font-body-md text-on-surface-variant mb-2">Email: bridal@sankritisarees.com</p>
            <p className="font-body-md text-on-surface-variant">Dedicated styling and trousseau curation.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-lg shadow-sm border border-outline-variant/20">
          <h3 className="font-title-lg text-2xl text-on-surface mb-6">Send a Message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="firstName" className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">First Name</label>
                <input type="text" id="firstName" className="border-b border-outline-variant/50 bg-transparent py-2 focus:outline-none focus:border-primary text-on-surface font-body-md transition-colors" />
              </div>
               <div className="flex flex-col">
                <label htmlFor="lastName" className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Last Name</label>
                <input type="text" id="lastName" className="border-b border-outline-variant/50 bg-transparent py-2 focus:outline-none focus:border-primary text-on-surface font-body-md transition-colors" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="email" className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
              <input type="email" id="email" className="border-b border-outline-variant/50 bg-transparent py-2 focus:outline-none focus:border-primary text-on-surface font-body-md transition-colors" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="subject" className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Inquiry Type</label>
               <select id="subject" className="border-b border-outline-variant/50 bg-transparent py-2 focus:outline-none focus:border-primary text-on-surface font-body-md transition-colors appearance-none">
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Tracking</option>
                  <option value="bridal">Bridal Consultation</option>
                  <option value="returns">Returns & Exchanges</option>
               </select>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="message" className="font-label-md text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Message</label>
              <textarea id="message" rows={4} className="border-b border-outline-variant/50 bg-transparent py-2 focus:outline-none focus:border-primary text-on-surface font-body-md transition-colors resize-none"></textarea>
            </div>
            
            <button type="button" className="w-full bg-primary text-on-primary font-label-md text-xs uppercase tracking-widest py-4 rounded-sm hover:bg-tertiary-container transition-colors mt-4 shadow-md">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
