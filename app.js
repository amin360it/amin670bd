/* ===================================================
   CV DATA (Reactive — loaded from JSON for projects)
   =================================================== */
const DATA = Vue.reactive({
  personal: {
    name: 'Md. Asaduzzaman',
    nickname: 'Aminur',
    title: 'IT & Digital Operations Specialist',
    phone1: '+880 1979 670601',
    phone2: '+880 1719 670601',
    email: 'amin670bd@gmail.com',
    email2: 'amin670job@gmail.com',
    location: 'Ashuliya, Savar, Dhaka, Bangladesh',
    linkedin: 'linkedin.com/in/aminur670bd',
    website: 'https://amin670bd.github.io',
    photo: 'assets/images/profile.jpg',
    dob: '22/01/1997',
    blood: 'O+',
    religion: 'Islam',
    currentSalary: '21,800 BDT',
    expectedSalary: 'Negotiable',
    available: 'Immediately'
  },
  languages: [
    { name: '🇧🇩 Bangla', level: 'Native', pct: 100 },
    { name: '🇬🇧 English', level: 'Fluent', pct: 85 },
    { name: '🇮🇳 Hindi', level: 'Intermediate', pct: 60 }
  ],
  objective: 'I offer a unique blend of creative, technical, and support-based services that span across IT support, ERP operations, digital systems, and administrative workflows. My goal is to contribute to a company\'s IT infrastructure with hands-on experience in system maintenance, user support, and process improvement.',
  summary: 'Versatile IT & Digital Operations Specialist with 7.5+ years of total experience (including 3.5+ years formal), supporting businesses through system administration, ERP operations, and technical support. Skilled in troubleshooting, hardware/software setup, ERP data entry, and user support. Adept at managing in-house workflows, enhancing digital visibility, and ensuring smooth technical and administrative operations.',
  stats: [
    { value: '15+', label: 'Sites Built' },
    { value: '60%', label: 'Efficiency Boost' },
    { value: '100+', label: 'Users Managed' }
  ],
  skills: [
    { title: 'Office & Productivity', icon: 'description', items: ['MS Office (Word, Excel, PowerPoint, Outlook)', 'Google Workspace', 'Excel Automation & Macros', 'Report Generation', 'PDF Editing'] },
    { title: 'Design & Graphics', icon: 'palette', items: ['Photoshop', 'Illustrator', 'Canva', 'Infographics', 'Posters / Labels', 'Logos', 'Invoices'] },
    { title: 'Video & AI Multimedia', icon: 'movie', items: ['Filmora (Video Editing)', 'AI Image Manipulation & Editing', 'AI Audio & Multimedia'] },
    { title: 'ERP & Business Systems', icon: 'storage', items: ['GPRO ERP (All Modules)', 'Inventory Management', 'Payroll / Billing', 'Data Entry & Verification', 'POS Systems', 'File Handling', 'ERP Install & Support', 'Garments Systems', 'RFID Tag Generation'] },
    { title: 'E-Commerce & Marketplaces', icon: 'shopping_cart', items: ['Product Listing', 'Order / Shipping Handling', 'Customer Support', 'Bundle Tracking', 'Amazon Seller Central', 'eBay', 'WooCommerce', 'WordPress'] },
    { title: 'C / C++ & .NET Stack', icon: 'code', items: ['C / C++', 'C# & WinForms', '.NET SDK 9/10', 'ADO.NET', 'Crystal Reports', '.NET Framework', 'MS Access'] },
    { title: 'PHP & Laravel Stack', icon: 'code', items: ['Laravel', 'Blade Templates', 'Eloquent ORM', 'Artisan CLI', 'REST APIs', 'MVC Architecture', 'PHP & MySQL', 'PDO'] },
    { title: 'Frontend Stack', icon: 'code', items: ['Vue 3 (Options / Composition API)', 'Vue Router', 'Pinia', 'Vite', 'HTML / CSS / JavaScript', 'Tailwind / Bootstrap 4/5', 'jQuery', 'Responsive Design'] },
    { title: 'Databases & SQL', icon: 'table_chart', items: ['MySQL / phpMyAdmin', 'MySQL Workbench', 'SQL Server', 'MS Access', 'Excel VBA Macros'] },
    { title: 'AI & Automation Tools', icon: 'smart_toy', items: ['Prompt Engineering', 'GitHub Copilot', 'ChatGPT', 'Opencode / OpenRouter', 'Qwen AI / Gemini', 'n8n Workflow Automation'] },
    { title: 'Web Dev & CMS', icon: 'travel_explore', items: ['WordPress', 'Elementor', 'WooCommerce', 'LMS', 'Plugin Dev', 'Payment Systems', 'ACF', 'Custom Post Types', 'REST API', 'Child Themes', 'SEO Plugins'] },
    { title: 'IT Support & System Admin', icon: 'dns', items: ['Windows / Linux OS Install', 'Hard / Soft Diagnostics', 'Remote IT Support', 'System Maintenance', 'User Training', 'Driver Setup', 'PC Assembly & Upgrade'] },
    { title: 'System Integration & Hardware', icon: 'settings_ethernet', items: ['Barcode Printer Configuration', 'Automated Label Printing', 'Weight Scale Integration', 'NXP MCU RFID Terminals', 'MOXA Serial Cards', 'Network Configuration'] },
    { title: 'Email & Communication', icon: 'forward_to_inbox', items: ['Corporate Email Setup', 'Bulk Mailing Tools', 'Email Automation', 'Face-to-Face Communication', 'Social Media Management'] },
    { title: 'Networking & Security', icon: 'lan', items: ['IP Config & Subnetting', 'LAN / Router Setup', 'File / Printer Sharing', 'Firewall & Antivirus', 'IP Camera Installation', 'Network Cabling', 'RS-485 Cabling'] }
  ],
  experience: [
    {
      title: 'Sr. Officer (In-Charge, Barcode)', company: 'Dhaka Thai ALCOMAXX PLC', location: 'Ashuliya, Savar, Dhaka', period: 'Sep 2025 - Present', highlights: [
        'Lead barcode operations, product labeling, bundling, and production coordination across packing lines',
        'Developed and maintained C# desktop applications for weight scale integration with LightHouse ERP',
        'Troubleshot utility software, barcode printers, and IT systems across packing lines',
        'Improved workflow efficiency and reduced downtime through barcode system optimization',
        'Designed and implemented automated label printing systems increasing daily output from 2,500 to 8,000+ labels',
        'Coordinated with production and quality teams to ensure accurate product tracking and traceability'
      ]
    },
    {
      title: 'Officer - IT (G-Pro)', company: 'Keya Cosmetic Ltd.', location: 'Gazipur, Dhaka', period: 'May 2022 - Jul 2025', highlights: [
        'Administered GPRO ERP modules including cutting, store, production, payroll, billing, and inventory management',
        'Configured IP settings and network cabling for 30+ production floor workstations',
        'Set up and maintained printer connectivity across the facility',
        'Installed and configured IP cameras for production floor surveillance',
        'Managed 30+ production lines each with 10+ NXP MCU-based RFID terminals as IoT checkpoints',
        'Configured and maintained MOXA multiport serial cards over RS-485 telephone-type cabling to collect data from RFID terminals into GPRO ERP',
        'Provided IT training and support to 30+ end-users on ERP modules and software tools',
        'Assisted with routine server backups and basic system maintenance',
        'Automated routine data entry and reporting tasks using Excel macros and ERP export tools'
      ]
    },
    {
      title: 'IT Assistant', company: 'Rahamat Sweaters Ltd.', location: 'Gazipur, Dhaka', period: 'Jan 2022 - May 2022', highlights: [
        'Designed barcode and label systems for production tracking and warehouse management',
        'Performed ERP data entry, verification, and synchronization across multiple departments',
        'Provided hardware and software support for production floor workstations',
        'Assisted in inventory reconciliation and stock movement documentation'
      ]
    },
    {
      title: 'Web Developer', company: 'Faith Media Ltd.', location: 'Mohakhali, Dhaka', period: 'Jan 2021 - Jul 2021', highlights: [
        'Developed and maintained WordPress/WooCommerce websites with custom themes and plugins',
        'Created SEO-optimized content, product listings, and competitive pricing strategies for e-commerce clients',
        'Designed infographics, promotional banners, and website visuals using Photoshop and Illustrator',
        'Implemented LMS and membership plugins for client educational platforms',
        'Optimized site performance through caching, image compression, and database optimization'
      ]
    },
    {
      title: 'Remote IT Assistant to CEO', company: 'TIC Accessories Inc.', location: 'New York, USA', period: 'Jan 2020 - Dec 2020', highlights: [
        'Managed Amazon Seller Central and eBay Seller Hub — listings, pricing, inventory sync, and order processing for 200+ products',
        'Automated Excel reports and email marketing campaigns for sales and inventory tracking',
        'Provided remote IT support via AnyDesk and TeamViewer to New York office staff',
        'Created professional product photography and edited images for marketplace listings',
        'Monitored competitor pricing and adjusted listings to maintain competitive edge'
      ]
    },
    {
      title: 'ICT Teacher & IT Trainer', company: 'EEE & IT Training Center', location: 'Naogaon', period: 'Jul 2019 - Dec 2019', highlights: [
        'Trained SSC and HSC students in MS Office, programming fundamentals, and hardware troubleshooting',
        'Developed practical IT curriculum modules with hands-on exercises for real-world skill building',
        'Guided students through computer assembly, OS installation, and basic networking labs',
        'Conducted assessments and provided one-on-one mentoring to improve student outcomes'
      ]
    },
    {
      title: 'IT Assistant', company: 'ZSN Computers', location: 'Naogaon', period: 'Jul 2018 - Dec 2018', highlights: [
        'Assembled custom PCs and installed operating systems, drivers, and essential software',
        'Provided hardware diagnostics, repair services, and software troubleshooting for walk-in clients',
        'Maintained workshop inventory of components and managed customer service requests',
        'Performed system upgrades including RAM, storage, and graphics card installations'
      ]
    }
  ],
  education: [
    { degree: 'Diploma in Computer Engineering', school: 'Bogura Polytechnic Institute', year: '2018', grade: 'CGPA: 2.92 / 4.00' },
    { degree: 'S.S.C. (Vocational, ICT)', school: 'Naogaon Technical School & College', year: '2013', grade: 'GPA: 4.88 / 5.00' }
  ],
  training: [
    { title: 'Web Design & Development (WordPress, PHP & MySQL)', institution: 'Bangladesh IT Institute, Dhaka', year: '2017', duration: '3 months' },
    { title: 'Software Development (Win-Forms, C#.NET & SQL Server)', institution: 'Smart Softwares & Training Center, Bogura', year: '2016', duration: '6 months' },
    { title: 'Graphics Design (Photoshop & Illustrator)', institution: 'Rahim IT Solutions, Bogura', year: '2015', duration: '3 months' },
    { title: 'CompTIA A+ (Hardware, Software, IT-ICT & MS Office)', institution: 'Opurbo Computers & Training Center, Naogaon', year: '2013', duration: '6 months' }
  ],
  featuredProject: {},
  projectDetails: {},
  projectCategories: [],
  projectsLoaded: false,
  achievementCategories: [
    {
      title: 'Technical Impact',
      icon: 'rocket_launch',
      color: 'var(--primary)',
      items: [
        'Developed a desktop app for YAOHUA digital scale, reducing packing production time by 60% and tripling bundle QR label output from 2.5K to 8K+ daily.',
        'Developed 15+ responsive websites and e-commerce platforms using WordPress + Elementor.',
        'Managed 200+ SEO-optimized product listings for Amazon, eBay, and WooCommerce.'
      ]
    },
    {
      title: 'Training & Leadership',
      icon: 'school',
      color: 'var(--accent-emerald)',
      items: [
        'Administered and trained 30+ users on ERP modules including HR, Payroll, Store, Inventory.',
        'Delivered IT training to 80+ students on MS Office and system troubleshooting during session.'
      ]
    },
    {
      title: 'Awards & Recognition',
      icon: 'emoji_events',
      color: 'var(--accent-amber)',
      items: [
        'Res-Q — Champion, BPI College Projects Fair 2017',
        'BPI Virtual Institute — Champion, ICT Fair 2017, Bogura District & Rajshahi Division Level'
      ]
    }
  ],
  references: [
    { name: 'Md. Mamunur Rashid', title: 'Manager (IT, G-Pro)', company: 'Keya Knit Composite Ltd.', phone: '01906-472201' },
    { name: 'Md. Al Amin', title: 'Sr. Officer (IT, G-Pro)', company: 'Keya Knit Composite Ltd.', phone: '01521-447631' },
    { name: 'Md. Abdur Rahim', title: 'Head of Sales & Marketing', company: 'Alpha.Net.Bd', phone: '01712-685203' },
    { name: 'Md. Sagar Islam', title: 'Production Coordinator', company: 'Casual Garments Ltd.', phone: '01727-831168' },
    { name: 'Md. Mamunur Rashid', title: 'Manager (IT, G-Pro)', company: 'Keya Knit Composite Ltd.', phone: '01906-472201' },
    { name: 'Md. Al Amin', title: 'Sr. Officer (IT, G-Pro)', company: 'Keya Knit Composite Ltd.', phone: '01521-447631' },
    { name: 'Md. Abdur Rahim', title: 'Head of Sales & Marketing', company: 'Alpha.Net.Bd', phone: '01712-685203' },
    { name: 'Md. Sagar Islam', title: 'Production Coordinator', company: 'Casual Garments Ltd.', phone: '01727-831168' }
  ],
  menuItems: [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/about', label: 'About', icon: 'person' },
    { path: '/skills', label: 'Skills', icon: 'settings' },
    { path: '/experience', label: 'Experience', icon: 'work' },
    { path: '/education', label: 'Education', icon: 'school' },
    { path: '/projects', label: 'Projects', icon: 'folder_open' },
    { path: '/achievements', label: 'Achievements', icon: 'emoji_events' },
    { path: '/references', label: 'References', icon: 'people' },
    { path: '/contact', label: 'Contact', icon: 'email' }
  ]
});

/* ===================================================
   UTILITY HELPERS
   =================================================== */
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

/* ===================================================
   VIEW COMPONENTS (Options API)
   =================================================== */

// --- HOME VIEW ---
const HomeView = {
  name: 'HomeView',
  template: `
    <div class="hero-section">
      <span class="section-tag">{{ expYears }}+ Years Experience</span>

      <!-- Title + Image row -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-4">
        <div class="flex-1">
          <h1 class="hero-title">{{ DATA.personal.name }} <br><span class="gradient-text">({{ DATA.personal.nickname }})</span></h1>
        </div>
        <div class="lg:shrink-0 w-full lg:w-48 xl:w-56">
          <img :src="DATA.personal.photo" :alt="DATA.personal.name"
            class="w-full h-auto rounded-2xl object-cover"
            style="box-shadow:0 8px 32px rgba(20,184,166,0.15);border:2px solid var(--border)">
        </div>
      </div>

      <p class="hero-subtitle mt-4 mb-2" style="color:var(--text)">
        <span>A unique fusion of </span>
        <strong><span class="typewriter-cursor">{{ currentRole }}</span></strong>
      </p>
      <p class="text-base mb-8" style="color:var(--text-muted)">
        Dedicated to automating workflows, reducing production costs, and modernizing digital infrastructure.
      </p>

      <div class="flex flex-wrap gap-3 mb-10">
        <router-link to="/contact" class="hero-btn btn-shimmer inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg transition-all duration-300" style="box-shadow:0 4px 15px rgba(20,184,166,0.3)">
          <i class="material-icons text-lg">send</i> Contact Me
        </router-link>
        <a href="./Assaduzzaman_Aminur_CV_2026.pdf" download class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">
          <i class="material-icons text-lg">download</i> Download CV
        </a>
        <router-link to="/projects" class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">
          View Portfolio <i class="material-icons text-lg">arrow_forward</i>
        </router-link>
      </div>

      <!-- Highlights -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <router-link v-for="(h,i) in highlights" :key="i" :to="h.link" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 gradient-bg" :style="{animation:'float 3s ease-in-out infinite',animationDelay: (i * 0.3) + 's'}">
            <i class="material-icons text-white" style="font-size:20px">{{ h.icon }}</i>
          </div>
          <div>
            <h4 class="font-semibold text-lg" style="color:var(--text-heading)">{{ h.title }}</h4>
            <p class="text-md mt-0.5" style="color:var(--text-muted)">{{ h.text }}</p>
          </div>
        </router-link>
      </div>

      <!-- Stats -->
      <div class="hero-stats">
        <div v-for="(s,i) in DATA.stats" :key="i" class="flex items-center gap-4">
          <div class="text-center">
            <div class="hero-stat-value">{{ s.value }}</div>
            <div class="text-lg" style="color:var(--text-muted)">{{ s.label }}</div>
          </div>
          <div v-if="i < DATA.stats.length-1" style="width:1px;height:40px;background:var(--border)"></div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      DATA,
      expYears: '7.5',
      typeInterval: null,
      roles: ['IT Support Specialist', 'ERP Systems Specialist', 'Web Developer', 'Digital Operations Expert', 'Systems Integrator'],
      currentRole: 'IT Support Specialist',
      roleIndex: 0,
      charIndex: 0,
      isDeleting: false,
      highlights: [
        { icon: 'speed', title: '60% Efficiency Boost', text: 'Reduced packing time with automated weight scale integration', link: '/projects' },
        { icon: 'web', title: '15+ Sites Built', text: 'WordPress, WooCommerce & custom web solutions', link: '/projects' },
        { icon: 'group', title: '100+ Users Managed', text: 'ERP training, IT support & system administration', link: '/experience' }
      ]
    };
  },
  mounted() {
    // fade handled by Vue transition
    this.startTypewriter();
  },
  beforeUnmount() {
    if (this.typeInterval) clearInterval(this.typeInterval);
  },
  methods: {
    startTypewriter() {
      this.typeInterval = setInterval(() => {
        const full = this.roles[this.roleIndex];
        if (this.isDeleting) {
          this.charIndex--;
          this.currentRole = full.substring(0, this.charIndex);
          if (this.charIndex === 0) {
            this.isDeleting = false;
            this.roleIndex = (this.roleIndex + 1) % this.roles.length;
          }
        } else {
          this.charIndex++;
          this.currentRole = full.substring(0, this.charIndex);
          if (this.charIndex === full.length) {
            setTimeout(() => { this.isDeleting = true; }, 1500);
          }
        }
      }, 80);
    }
  }
};

// --- ABOUT VIEW ---
const AboutView = {
  name: 'AboutView',
  template: `
      <div class="section">
        <span class="section-tag">About Me</span>
        <h2 class="section-title">Who I Am</h2>

        <!-- Full-width Visiting Card -->
        <div class="card-glass p-6 mb-6">
          <div class="flex flex-col sm:flex-row items-start gap-5">
            <div class="w-full sm:w-44 md:w-52 lg:w-60 shrink-0 rounded-2xl overflow-hidden aspect-square" style="border:3px solid rgba(20,184,166,0.3)">
              <img :src="DATA.personal.photo" :alt="DATA.personal.name" class="w-full h-full object-cover">
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-xl font-bold" style="color:var(--text-heading)">{{ DATA.personal.name }}</h3>
              <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal.nickname }})</p>
              <p class="text-base mt-1" style="color:var(--text-muted)">{{ DATA.personal.title }}</p>
              <hr class="my-4" style="border-color:var(--border)">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base">
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">phone</i>
                  <span style="color:var(--text)">{{ DATA.personal.phone1 }} / {{ DATA.personal.phone2 }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">email</i>
                  <span style="color:var(--text)">{{ DATA.personal.email }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">location_on</i>
                  <span style="color:var(--text)">{{ DATA.personal.location }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">link</i>
                  <a :href="'https://' + DATA.personal.linkedin" target="_blank" style="color:var(--primary)">{{ DATA.personal.linkedin }}</a>
                </div>
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">language</i>
                  <a :href="DATA.personal.website" target="_blank" style="color:var(--primary)">amin670bd.github.io</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-5">

            <!-- Personal Details -->
          <div class="card-glass">
            <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">badge</i> Personal Details</h4>
            <div class="space-y-2">
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span style="color:var(--text-muted);font-size:0.9rem">Date of Birth</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.dob }}</span></div>
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span style="color:var(--text-muted);font-size:0.9rem">Blood Group</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.blood }}</span></div>
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span style="color:var(--text-muted);font-size:0.9rem">Religion</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.religion }}</span></div>
            </div>
          </div>

          <!-- Languages -->
          <div class="card-glass">
            <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">translate</i> Languages</h4>
            <div class="space-y-3">
              <div v-for="l in DATA.languages" :key="l.name">
                <div class="flex justify-between mb-1"><span style="font-size:0.9rem">{{ l.name }}</span><span style="color:var(--text-muted);font-size:0.9rem">{{ l.level }}</span></div>
                <div class="skill-bar-track"><div class="skill-bar-fill" :style="{ width: l.pct + '%' }"></div></div>
              </div>
            </div>
          </div>

          <!-- Employment Details -->
          <div class="card-glass">
            <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">work</i> Employment Details</h4>
            <div class="space-y-2">
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span style="color:var(--text-muted);font-size:0.9rem">Current Salary</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.currentSalary }}</span></div>
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span style="color:var(--text-muted);font-size:0.9rem">Expected Salary</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.expectedSalary }}</span></div>
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span style="color:var(--text-muted);font-size:0.9rem">Available</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.available }}</span></div>
              <div class="flex justify-between py-1"><span style="color:var(--text-muted);font-size:0.9rem">Location</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.location }}</span></div>
            </div>
          </div>

        </div>

        <!-- Right Column -->
        <div class="lg:col-span-3 space-y-5">

          <!-- Objective -->
          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">psychology</i> Career Objective</h3>
            <p class="leading-relaxed" style="color:var(--text)">{{ DATA.objective }}</p>
          </div>

          <!-- Professional Summary + Stats -->
          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">assignment</i> Professional Summary</h3>
            <p class="leading-relaxed mb-5" style="color:var(--text)">{{ DATA.summary }}</p>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="s in DATA.stats" :key="s.label" class="text-center py-4 rounded-xl" style="background:rgba(20,184,166,0.06);border:1px solid rgba(20,184,166,0.1)">
                <div class="text-2xl font-extrabold gradient-text">{{ s.value }}</div>
                <div class="text-md font-medium mt-1" style="color:var(--text-muted)">{{ s.label }}</div>
              </div>
            </div>
          </div>

          <!-- Training & Certifications -->
          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">verified</i> Training & Certifications</h3>
            <div class="space-y-3">
              <div v-for="t in DATA.training" :key="t.title" class="flex items-start gap-3 p-3 rounded-xl" style="background:rgba(20,184,166,0.04);border:1px solid rgba(20,184,166,0.06)">
                <i class="material-icons" style="color:var(--primary);font-size:20px">check_circle</i>
                <div>
                  <h4 class="font-semibold text-lg" style="color:var(--text-heading)">{{ t.title }}</h4>
                  <p class="text-md" style="color:var(--text-muted)">{{ t.institution }} — {{ t.duration }}, {{ t.year }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div class="space-y-4">
            <h3 class="text-lg font-bold flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">school</i> Education</h3>
            <div v-for="e in DATA.education" :key="e.degree" class="card-glass p-5">
              <div class="flex items-start gap-3">
                <i class="material-icons" style="color:var(--primary);font-size:20px">book</i>
                <div>
                  <h4 class="font-semibold text-lg" style="color:var(--text-heading)">{{ e.degree }}</h4>
                  <p class="text-md" style="color:var(--text-muted)">{{ e.school }} — {{ e.year }} | {{ e.grade }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- SKILLS VIEW ---
const SkillsView = {
  name: 'SkillsView',
  template: `
    <div class="section">
      <span class="section-tag">Tech Stack Matrix</span>
      <h2 class="section-title">Technical & Creative Inventory</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(skill,i) in DATA.skills" :key="i" class="card-glass">
          <h3 class="text-base font-bold mb-4 flex items-center gap-2" style="color:var(--text-heading)">
            <i class="material-icons text-lg" style="color:var(--primary)">{{ skill.icon }}</i> {{ skill.title }}
          </h3>
          <div class="flex flex-wrap">
            <span v-for="(item,j) in skill.items" :key="j" class="skill-pill">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- EXPERIENCE VIEW ---
const ExperienceView = {
  name: 'ExperienceView',
  template: `
    <div class="section">
      <span class="section-tag">Career Trajectory</span>
      <h2 class="section-title">Employment History</h2>
      <div class="timeline ">
          <div v-for="(exp,i) in DATA.experience" :key="i" class="timeline-item">
          <div class="timeline-dot"></div>
          <span class="timeline-date">{{ exp.period }}</span>
          <h3 class="text-lg font-bold" style="color:var(--text-heading)">{{ exp.title }}</h3>
          <p class="text-base sm:text-lg font-medium mb-2" style="color:var(--primary)">{{ exp.company }} <span style="color:var(--text-muted)">| {{ exp.location }}</span></p>
          <ul class="space-y-1 text-lg" style="color:var(--text)">
            <li v-for="(h,j) in exp.highlights" :key="j" class="flex items-start gap-2 text-sm">
              <i class="material-icons" style="font-size:6px;color:var(--primary)">circle</i>
              <span>{{ h }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- EDUCATION VIEW ---
const EducationView = {
  name: 'EducationView',
  template: `
    <div class="section">
      <span class="section-tag">Knowledge Base</span>
      <h2 class="section-title">Education & Certifications</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="card-glass">
          <h3 class="text-base font-bold mb-5 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">account_balance</i> Academic Background</h3>
          <div v-for="(edu,i) in DATA.education" :key="i" class="mb-4 pb-4 flex items-start gap-3" :style="i < DATA.education.length-1 ? 'border-bottom:1px solid var(--border)' : ''">
            <span class="text-lg mt-0.5" style="color:var(--primary)">•</span>
            <div>
              <h4 class="font-bold text-lg" style="color:var(--text-heading)">{{ edu.degree }}</h4>
              <p class="text-md" style="color:var(--text-muted)">{{ edu.school }} | {{ edu.grade }} | {{ edu.year }}</p>
            </div>
          </div>
        </div>
        <div class="card-glass">
          <h3 class="text-base font-bold mb-5 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">verified</i> Trainings & Courses</h3>
          <div v-for="(t,i) in DATA.training" :key="i" class="flex gap-3 mb-4">
            <span class="text-lg mt-0.5" style="color:var(--primary)">•</span>
            <div>
              <h4 class="font-semibold text-lg" style="color:var(--text-heading)">{{ t.title }}</h4>
              <p class="text-md" style="color:var(--text-muted)">{{ t.institution }} | {{ t.year }} | {{ t.duration }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- PROJECTS VIEW ---
const ProjectsView = {
  name: 'ProjectsView',
  data() {
    return {
      DATA,
      activeFilter: 'all'
    };
  },
  computed: {
    allProjects() {
      const items = [];
      this.DATA.projectCategories.forEach(cat => {
        cat.items.forEach(item => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon });
        });
      });
      return items;
    },
    filteredProjects() {
      if (this.activeFilter === 'all') return this.allProjects;
      return this.allProjects.filter(p => p.categoryKey === this.activeFilter);
    }
  },
  methods: {
    setFilter(key) { this.activeFilter = key; }
  },
  template: `
    <div class="section">
      <span class="section-tag">Case Studies</span>
      <h2 class="section-title">Key Projects & Recent Works</h2>

      <!-- Featured Project -->
      <div v-if="DATA.featuredProject.title" class="card-glass-alt p-6 lg:p-8 mb-10">
        <span class="inline-block text-md font-bold px-3 py-1 rounded-full mb-4 gradient-bg text-white">🏆 Top Achievement</span>
        <h3 class="text-xl lg:text-2xl font-extrabold mb-4" style="color:var(--sidebar-heading)">{{ DATA.featuredProject.title }}</h3>
        <div v-if="DATA.featuredProject.images && DATA.featuredProject.images.length" class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div class="md:col-span-2 rounded-xl overflow-hidden" style="background:var(--sidebar-divider)">
            <img :src="DATA.featuredProject.images[0]" alt="Project screenshot" class="w-full h-auto object-cover" loading="lazy">
          </div>
          <div class="space-y-3">
            <div v-for="(img,i) in DATA.featuredProject.images.slice(1)" :key="i" class="rounded-xl overflow-hidden" style="background:var(--sidebar-divider)">
              <img :src="img" alt="Project screenshot" class="w-full h-auto object-cover" loading="lazy">
            </div>
          </div>
        </div>
        <p class="text-lg mb-2" v-if="DATA.featuredProject.tech"><span class="font-semibold">Technologies:</span> {{ DATA.featuredProject.tech }}</p>
        <p class="text-lg mb-4" v-if="DATA.featuredProject.company"><span class="font-semibold">Company:</span> {{ DATA.featuredProject.company }}</p>
        <ul class="space-y-2 text-lg mb-5" v-if="DATA.featuredProject.details">
          <li v-for="(d,i) in DATA.featuredProject.details" :key="i" class="flex items-start gap-2 text-sm">
            <i class="material-icons" style="color:var(--primary-light);font-size:18px">check_circle</i>
            <span>{{ d }}</span>
          </li>
        </ul>
        <router-link :to="'/project/' + DATA.featuredProject.id" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-lg font-semibold transition" v-if="DATA.featuredProject.id">
          Project Details <i class="material-icons" style="font-size:14px">open_in_new</i>
        </router-link>
      </div>

      <!-- All Projects Grid -->
      <span class="section-tag">All Works</span>
      <h2 class="section-title">Projects & Client Works</h2>
      <div class="sticky top-0 z-10 flex flex-wrap gap-2 mb-6 pt-4 pb-3 -mx-6 px-6" style="background:var(--bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border)" v-if="allProjects.length">
        <button v-for="cat in [{key:'all',label:'All'}].concat(DATA.projectCategories.map(c=>({key:c.key,label:c.name})))" :key="cat.key"
          @click="setFilter(cat.key)"
          class="project-filter-btn" :class="{ active: activeFilter === cat.key }">
          {{ cat.label }}
        </button>
      </div>
    <transition-group
  :key="activeFilter"
  name="project"
  tag="div"
  class="grid grid-cols-1 sm:grid-cols-2 gap-6"
  mode="out-in"
  v-if="filteredProjects.length"
>
  <div
    v-for="(project, i) in filteredProjects"
    :key="project.id || i"
      class="project-card-item rounded-xl p-5 flex flex-col"
  >
    <div class="flex items-center justify-between mb-3">
      <span
        class="project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1"
      >
        <i class="material-icons text-xs">{{ project.categoryIcon }}</i>
        {{ project.categoryName }}
      </span>
      <span
        v-if="project.tech"
        class="text-xs ml-2"
        style="color:var(--text-muted)"
      >
        {{ project.tech }}
      </span>
    </div>

    <router-link
      v-if="project.id"
      :to="'/project/' + project.id"
      class="project-title-link font-semibold text-base"
    >
      {{ project.title }}
    </router-link>
    <span
      v-else
      class="font-semibold text-base"
      style="color:var(--text-heading)"
    >
      {{ project.title }}
    </span>

    <p
      class="text-sm mt-2 mb-4 leading-relaxed"
      style="color:var(--text)"
    >
      {{ project.description }}
    </p>

    <router-link
      v-if="project.id"
      :to="'/project/' + project.id"
      class="btn-outline self-start mt-auto"
    >
      View Details
      <i class="material-icons text-xs">arrow_forward</i>
    </router-link>
  </div>
</transition-group>

      <div v-if="!allProjects.length && !DATA.featuredProject.title" class="text-center py-8" style="color:var(--text-muted)">
        Loading projects...
      </div>
    </div>
  `,
  beforeRouteLeave(to, from, next) {
    if (to.path.startsWith('/project/')) {
      sessionStorage.setItem('projectsScrollY', window.scrollY);
    }
    next();
  },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- ACHIEVEMENTS VIEW ---
const AchievementsView = {
  name: 'AchievementsView',
  data() {
    return { DATA };
  },
  template: `
    <div class="section">
      <span class="section-tag">Recognitions</span>
      <h2 class="section-title">Professional Achievements</h2>
      <div v-for="(cat,ci) in DATA.achievementCategories" :key="ci" class="mb-8 last:mb-0">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2" :style="{ color: cat.color }">
          <i class="material-icons">{{ cat.icon }}</i> {{ cat.title }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(a,ai) in cat.items" :key="ai" class="achievement-card" :style="{ borderLeftColor: cat.color }">
            <p class="leading-relaxed" style="color:var(--text)">{{ a }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    // fade handled by Vue transition
  }
};

// --- REFERENCES VIEW ---
const ReferencesView = {
  name: 'ReferencesView',
  data() {
    return { DATA };
  },
  template: `
    <div class="section">
      <span class="section-tag">Endorsements</span>
      <h2 class="section-title">References</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div v-for="(ref,i) in DATA.references" :key="i" class="ref-card flex items-start gap-4">
          <div class="ref-avatar">{{ ref.name.charAt(0) }}</div>
          <div>
            <h4 class="font-bold text-md" style="color:var(--text-heading)">{{ ref.name }}</h4>
            <p class=" font-medium" style="color:var(--primary)">{{ ref.title }}</p>
            <p class="font-medium mb-2" style="color:var(--text-muted)">{{ ref.company }}</p>
            <a :href="'tel:' + ref.phone" class="inline-flex items-center gap-1.5 text-md font-medium px-3 py-1 rounded-full transition" style="background:rgba(20,184,166,0.08);color:var(--primary)">
              <i class="material-icons" style="font-size:12px;color:var(--primary)">call</i> {{ ref.phone }}
        </router-link>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    // fade handled by Vue transition
  }
};

// --- CONTACT VIEW ---
const ContactView = {
  name: 'ContactView',
  data() {
    return {
      DATA,
      form: { name: '', email: '', message: '' },
      submitted: false,
      formError: { name: false, email: false, message: false },
      formSuccess: { name: false, email: false, message: false }
    };
  },
  methods: {
    validateField(field) {
      if (this.form[field].trim()) {
        this.formError[field] = false;
        this.formSuccess[field] = true;
      } else {
        this.formError[field] = true;
        this.formSuccess[field] = false;
      }
    },
    submitForm() {
      ['name', 'email', 'message'].forEach(f => this.validateField(f));
      if (this.form.name && this.form.email && this.form.message) {
        this.submitted = true;
        // Web3Forms submission
        const formData = new FormData();
        formData.append('access_key', '10c1a904-df2c-4b15-8e7c-6407e5ae6943');
        formData.append('name', this.form.name);
        formData.append('email', this.form.email);
        formData.append('message', this.form.message);
        formData.append('redirect', 'thanks.html');
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => { if (data.success) window.location.href = 'thanks.html'; })
          .catch(() => { this.submitted = false; });
      }
    }
  },
  template: `
    <div class="section">
      <span class="section-tag">Get In Touch</span>
      <h2 class="section-title">Contact Me</h2>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Info -->
        <div class="lg:col-span-2 space-y-5">
          <div class="card-glass contact-info">
            <div class="space-y-3 text-lg">
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">phone</i><div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.phone1 }}</div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.phone2 }}</div></div></div>
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">email</i><div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.email }}</div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.email2 }}</div></div></div>
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">location_on</i><span>{{ DATA.personal.location }}</span></div>
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">link</i><a :href="'https://' + DATA.personal.linkedin" target="_blank" class="hover:underline">{{ DATA.personal.linkedin }}</a></div>
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">language</i><a :href="DATA.personal.website" target="_blank" class="hover:underline">{{ DATA.personal.website }}</a></div>
            </div>
          </div>

          <div class="card-glass">
            <h3 class="text-lg font-bold mb-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">info</i>Availability</h3>
            <div class="space-y-2 text-lg">
              <div class="flex justify-between"><span style="color:var(--text-muted)">Current Salary</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.currentSalary }}</span></div>
              <div class="flex justify-between"><span style="color:var(--text-muted)">Expected Salary</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.expectedSalary }}</span></div>
              <div class="flex justify-between"><span style="color:var(--text-muted)">Available</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.available }}</span></div>
              <div class="flex justify-between"><span style="color:var(--text-muted)">Relocation</span><span class="font-medium" style="color:var(--text-heading)">Yes</span></div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="lg:col-span-3">
          <div class="card-glass">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">send</i>Send a Message</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="text-md font-medium mb-1 block" style="color:var(--text-muted)">Your Name</label>
                <input type="text" v-model="form.name" required class="contact-input" :class="{ error: formError.name, success: formSuccess.name }" placeholder="Enter your name" @blur="validateField('name')">
              </div>
              <div>
                <label class="text-md font-medium mb-1 block" style="color:var(--text-muted)">Your Email</label>
                <input type="email" v-model="form.email" required class="contact-input" :class="{ error: formError.email, success: formSuccess.email }" placeholder="Enter your email" @blur="validateField('email')">
              </div>
              <div>
                <label class="text-md font-medium mb-1 block" style="color:var(--text-muted)">Message</label>
                <textarea v-model="form.message" required class="contact-input" :class="{ error: formError.message, success: formSuccess.message }" placeholder="Write your message..." @blur="validateField('message')"></textarea>
              </div>
              <button type="submit" :disabled="submitted" class="btn-shimmer w-full py-3 px-6 gradient-bg text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2" :style="{opacity: submitted ? 0.7 : 1}">
                <i class="material-icons" :class="{ 'animate-spin': submitted }">{{ submitted ? 'sync' : 'send' }}</i> {{ submitted ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    // fade handled by Vue transition
  }
};

/* ===================================================
   PROJECT DETAIL VIEW
   =================================================== */
const ProjectDetailView = {
  name: 'ProjectDetailView',
  data() {
    return { DATA };
  },
  computed: {
    project() {
      const id = this.$route.params.id;
      return this.DATA.projectDetails[id] || null;
    }
  },
  methods: {
    placeholderImg(e) {
      e.target.style.display = 'none';
      const parent = e.target.parentElement;
      const ph = document.createElement('div');
      ph.className = 'img-placeholder';
      parent.appendChild(ph);
    },
    hasImages(project) {
      return project.images && project.images.length > 0;
    },
    firstImage(project) {
      return this.hasImages(project) ? project.images[0] : '';
    }
  },
  template: `
    <div v-if="project">
      <!-- Breadcrumb Nav (desktop/tablet only) -->
      <div class="hidden lg:flex items-center gap-2 text-sm font-medium px-6 py-3 sticky top-0 z-20" style="background:var(--bg);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);color:var(--text-muted)">
        <router-link to="/" style="color:var(--primary)" class="hover:underline">Home</router-link>
        <i class="material-icons" style="font-size:14px">chevron_right</i>
        <router-link to="/projects" style="color:var(--primary)" class="hover:underline">Projects</router-link>
        <i class="material-icons" style="font-size:14px">chevron_right</i>
        <span class="truncate max-w-xs" style="color:var(--text-heading)">{{ project.title }}</span>
      </div>
      <!-- Hero -->
      <div class="section" style="background:var(--sidebar-bg);color:var(--sidebar-text);border-radius:0 0 40px 40px;padding-bottom:60px">
        <span class="section-tag" style="background:rgba(20,184,166,0.15);padding:4px 14px;border-radius:20px">TOP ACHIEVEMENT</span>
        <h1 class="section-title" style="color:var(--sidebar-heading);font-size:2.2rem;margin-top:12px">{{ project.title }}</h1>
        <p style="color:var(--sidebar-text);font-size:1.1rem;opacity:0.8">{{ project.subtitle }}</p>
        <div class="flex flex-wrap gap-5 mt-6" style="color:var(--sidebar-text)">
          <div><small style="opacity:0.6">Company</small><br><strong style="color:var(--sidebar-heading)">{{ project.company }}</strong></div>
          <div><small style="opacity:0.6">Developer</small><br><strong style="color:var(--sidebar-heading)">{{ project.developer }}</strong></div>
        </div>
      </div>

      <!-- Gallery -->
      <div v-if="hasImages(project)" style="margin-top:-60px;margin-bottom:2rem;padding:0 60px">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div class="lg:col-span-2 rounded-2xl overflow-hidden project-card" style="border:1px solid var(--border);box-shadow:var(--shadow-lg);height:400px">
            <img :src="firstImage(project)" @error="placeholderImg" class="w-full h-full" style="object-fit:cover" loading="lazy">
          </div>
          <div class="space-y-3">
            <div v-for="img in project.images.slice(1)" :key="img" class="rounded-2xl overflow-hidden project-card" style="border:1px solid var(--border);height:192px">
              <img :src="img" @error="placeholderImg" class="w-full h-full" style="object-fit:cover" loading="lazy">
            </div>
          </div>
        </div>
      </div>
      <div v-else style="margin-top:-60px;margin-bottom:2rem;padding:0 60px;height:200px">
        <div class="rounded-2xl img-placeholder" style="height:100%"></div>
      </div>

      <!-- Metrics -->
      <div style="padding:0 60px;margin-bottom:2rem">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="m in project.metrics" :key="m.label" class="card-glass text-center py-5">
            <div class="text-3xl font-extrabold gradient-text">{{ m.value }}</div>
            <div class="text-md font-medium mt-1" style="color:var(--text-muted)">{{ m.label }}</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="padding:0 60px 40px">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <!-- Abstract -->
            <div class="card-glass">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="border-left:4px solid var(--primary);padding-left:12px">System Abstract & Objective</h2>
              <p style="color:var(--text)">{{ project.abstract }}</p>
            </div>
            <!-- Flow -->
            <div class="card-glass">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="border-left:4px solid var(--primary);padding-left:12px">Precision Engineering & Program Flow</h2>
              <div v-for="(step,i) in project.flow" :key="i" class="flex gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0">
                  <i class="material-icons" style="font-size:20px">{{ step.icon }}</i>
                </div>
                <div>
                  <h4 class="font-bold text-lg" style="color:var(--text-heading)">{{ step.title }}</h4>
                  <p class="text-lg mt-1" style="color:var(--text)">{{ step.text }}</p>
                </div>
              </div>
            </div>
            <!-- Details -->
            <div class="card-glass">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="border-left:4px solid var(--primary);padding-left:12px">Key Achievements</h2>
              <ul class="space-y-2">
                <li v-for="(d,i) in project.details" :key="i" class="flex items-start gap-2 text-md">
                  <i class="material-icons" style="color:var(--primary);font-size:18px">check_circle</i>
                  <span>{{ d }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- Sidebar -->
          <div class="space-y-4">
            <div class="card-glass">
              <span class="text-md font-bold uppercase tracking-wider" style="color:var(--primary)">Tech Stack</span>
              <div class="flex flex-wrap gap-2 mt-3">
                <span v-for="t in project.tech" :key="t" class="skill-pill">{{ t }}</span>
              </div>
            </div>
            <div class="card-glass" style="background:var(--sidebar-bg);color:var(--sidebar-text)">
              <h4 class="font-bold text-lg mb-3" style="color:var(--sidebar-heading)">Need Something Similar?</h4>
              <p class="text-md mb-4">I build specialized industrial digital solutions, ERP integrations, and automation tools.</p>
              <router-link to="/contact" class="inline-block w-full py-2.5 text-center text-lg font-semibold rounded-xl gradient-bg text-white transition">
                Hire Me for This Project
              </router-link>
            </div>
            <router-link to="/projects" class="inline-flex items-center gap-2 text-lg font-medium hover:underline" style="color:var(--primary)">
              <i class="material-icons" style="font-size:16px">arrow_back</i> Back to Projects
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="section text-center">
      <p>Project not found.</p>
      <router-link to="/projects" style="color:var(--primary)">Back to Projects</router-link>
    </div>
  `,
  mounted() {
    // fade handled by Vue transition
  }
};

/* ===================================================
   ROUTER
   =================================================== */
const routes = [
  { path: '/', component: HomeView, meta: { title: 'Home' } },
  { path: '/about', component: AboutView, meta: { title: 'About' } },
  { path: '/skills', component: SkillsView, meta: { title: 'Skills' } },
  { path: '/experience', component: ExperienceView, meta: { title: 'Experience' } },
  { path: '/education', component: EducationView, meta: { title: 'Education' } },
  { path: '/projects', component: ProjectsView, meta: { title: 'Projects' } },
  { path: '/project/:id', component: ProjectDetailView, meta: { title: 'Project' } },
  { path: '/achievements', component: AchievementsView, meta: { title: 'Achievements' } },
  { path: '/references', component: ReferencesView, meta: { title: 'References' } },
  { path: '/contact', component: ContactView, meta: { title: 'Contact' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/projects') {
      const savedY = sessionStorage.getItem('projectsScrollY');
      if (savedY) {
        sessionStorage.removeItem('projectsScrollY');
        return { top: parseInt(savedY), behavior: 'smooth' };
      }
    }
    return { top: 0, behavior: 'smooth' };
  }
});

/* ===================================================
   APP
   =================================================== */
const App = {
  name: 'App',
  data() {
    return {
      DATA,
      darkMode: false,
      mobileMenuOpen: false,
      showScrollTop: false
    };
  },
  computed: {
    menuItems() { return this.DATA.menuItems; }
  },
  mounted() {
    if (typeof PROJECTS_DATA !== 'undefined') {
      DATA.featuredProject = PROJECTS_DATA.featuredProject;
      DATA.projectCategories = PROJECTS_DATA.projectCategories;
      DATA.projectDetails = PROJECTS_DATA.projectDetails;
      DATA.projectsLoaded = true;
    } else {
      DATA.projectsLoaded = true;
    }
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'true' || (saved === null && prefersDark)) {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    }
    window.addEventListener('scroll', this.handleScroll);
    this.observeSkillBars();
  },
  watch: {
    '$route'() {
      this.$nextTick(() => {
        this.observeSkillBars();
      });
    }
  },
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle('dark', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    },
    toggleMobile() { this.mobileMenuOpen = !this.mobileMenuOpen; },
    closeMobile() { this.mobileMenuOpen = false; },
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); },
    handleScroll() {
      this.showScrollTop = window.scrollY > 100;
    },
    getInitials(name) {
      return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    },
    observeSkillBars() {
      document.querySelectorAll('.skill-bar-track').forEach(el => {
        if (el._skillBarObserved) return;
        el._skillBarObserved = true;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              $(entry.target).find('.skill-bar-fill').each(function () {
                const w = this.style.width;
                $(this).css('width', '0');
                setTimeout(() => $(this).css('width', w), 100);
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        observer.observe(el);
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  template: `
    <div>
      <!-- Mobile Nav -->
      <nav class="mobile-nav">
        <div class="flex items-center justify-between px-4 py-3">
          <router-link to="/" @click="closeMobile" class="text-lg font-extrabold tracking-tight gradient-text">Amin670BD</router-link>
          <div class="flex items-center gap-2">
            <a href="./Assaduzzaman_Aminur_CV_2026.pdf" download
              class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300"
              style="border:1px solid var(--primary);color:var(--primary)">
              <i class="material-icons" style="font-size:16px">download</i>
              <span class="download-cv-short">CV</span><span class="download-cv-full">Download CV</span>
            </a>
            <button @click="toggleDark" class="theme-toggle" style="width:32px;height:32px">
              <i class="material-icons" style="font-size:18px">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
            </button>
            <button @click="toggleMobile" class="text-xl p-2" style="color:var(--text)">
              <i class="material-icons">{{ mobileMenuOpen ? 'close' : 'menu' }}</i>
            </button>
          </div>
        </div>
      </nav>

      <!-- Offcanvas Backdrop -->
      <transition name="fade">
        <div v-if="mobileMenuOpen" @click="closeMobile" class="fixed inset-0 z-40" style="background:rgba(0,0,0,0.5)"></div>
      </transition>

      <!-- Offcanvas Sidebar (Mobile) -->
      <transition name="offcanvas">
        <aside v-if="mobileMenuOpen" class="fixed top-0 right-0 h-full w-72 z-50 overflow-y-auto" style="background:var(--sidebar-bg)">
          <div class="p-6 text-center">
            <div class="w-full sm:w-44 md:w-52 lg:w-60 mx-auto mb-4 rounded-2xl overflow-hidden aspect-square" style="border:3px solid rgba(20,184,166,0.3)">
              <img :src="DATA.personal.photo" :alt="DATA.personal.name" class="w-full h-full object-cover" loading="lazy">
            </div>
            <h2 class="text-xl font-bold" style="color:var(--sidebar-heading)">{{ DATA.personal.name }}</h2>
            <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal.nickname }})</p>
             <p class="text-md mt-0.5" style="color:var(--sidebar-text)">{{ DATA.personal.title }}</p>
          </div>
          <div class="px-6 space-y-2.5 mb-4">
             <div class="flex items-center gap-3 "><i class="material-icons" style="color:var(--primary);font-size:16px">phone</i><div><div>{{ DATA.personal.phone1 }}</div><div>{{ DATA.personal.phone2 }}</div></div></div>
             <div class="flex items-center gap-3 "><i class="material-icons" style="color:var(--primary);font-size:16px">email</i><span class="truncate">{{ DATA.personal.email }}</span></div>
             <div class="flex items-center gap-3 "><i class="material-icons" style="color:var(--primary);font-size:16px">location_on</i><span>{{ DATA.personal.location }}</span></div>
             <div class="flex items-center gap-3 "><i class="material-icons" style="color:var(--primary);font-size:16px">link</i><a :href="'https://' + DATA.personal.linkedin" target="_blank" style="color:var(--primary-light)">{{ DATA.personal.linkedin }}</a></div>
             <div class="flex items-center gap-3 "><i class="material-icons" style="color:var(--primary);font-size:16px">language</i><a :href="DATA.personal.website" target="_blank" style="color:var(--primary-light)">amin670bd.github.io</a></div>
          </div>
          <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">
          <div class="px-4 py-3 space-y-0.5">
            <router-link v-for="item in menuItems" :key="item.path"
              @click="closeMobile" :to="item.path"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg  font-medium transition"
              :class="{ 'nav-link-active': $route.path === item.path }">
              <i class="material-icons w-4 text-center" style="font-size:18px">{{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </router-link>
          </div>
          <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">
          <div class="px-6 py-4 space-y-3">
            <a href="./Assaduzzaman_Aminur_CV_2026.pdf" download
              class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300"
              style="box-shadow:0 4px 12px rgba(20,184,166,0.25)">
              <i class="material-icons">download</i> Download CV
            </a>
            <div class="flex items-center justify-between">
            <span class="text-lg flex items-center gap-1.5" style="color:var(--sidebar-text)"><span class="w-1.5 h-1.5 rounded-full" style="background:var(--accent-emerald);box-shadow:0 0 6px rgba(16,185,129,0.4)"></span> Available</span>
            <button @click="toggleDark" class="theme-toggle">
                <i class="material-icons" style="transition:transform 0.3s ease">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
              </button>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-scroll">
          <div class="p-6 text-center">
              <div class="w-full sm:w-44 md:w-52 lg:w-60 mx-auto mb-4 rounded-2xl overflow-hidden aspect-square" style="border:3px solid rgba(20,184,166,0.3)">
                <img :src="DATA.personal.photo" :alt="DATA.personal.name" class="w-full h-full object-cover" loading="lazy">
              </div>
            <h2 class="text-xl font-bold" style="color:var(--sidebar-heading)">{{ DATA.personal.name }}</h2>
            <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal.nickname }})</p>
            <p class="text-lg mt-0.5" style="color:var(--sidebar-text)">{{ DATA.personal.title }}</p>
          </div>

          <div class="px-6 space-y-3 mb-4">
            <div class="flex items-center gap-3   font-medium"><i class="material-icons" style="color:var(--primary);font-size:18px">phone</i><div><div>{{ DATA.personal.phone1 }}</div><div>{{ DATA.personal.phone2 }}</div></div></div>
            <div class="flex items-center gap-3   font-medium"><i class="material-icons" style="color:var(--primary);font-size:18px">email</i><span class="truncate">{{ DATA.personal.email }}</span></div>
            <div class="flex items-center gap-3   font-medium"><i class="material-icons" style="color:var(--primary);font-size:18px">location_on</i><span>{{ DATA.personal.location }}</span></div>
            
          </div>

          <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">

          <!-- Sidebar Nav -->
          <div class="px-4 py-3 space-y-0.5">
            <router-link v-for="item in menuItems" :key="item.path"
              :to="item.path"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg  font-medium transition"
              :class="{ 'nav-link-active': $route.path === item.path }"
              @click="closeMobile">
              <i class="material-icons w-4 text-center" style="font-size:18px">{{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </router-link>
          </div>

          <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">
        </div>

        <!-- Download + Theme (fixed at bottom) -->
        <div class="px-6 py-4 space-y-3" style="border-top:1px solid var(--sidebar-divider)">
          <a href="./Assaduzzaman_Aminur_CV_2026.pdf" download
            class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300"
            style="box-shadow:0 4px 12px rgba(20,184,166,0.25)">
            <i class="material-icons">download</i> Download CV
          </a>
          <div class="flex items-center justify-between">
            <span class="text-lg flex items-center gap-1.5" style="color:var(--sidebar-text)"><span class="w-1.5 h-1.5 rounded-full" style="background:var(--accent-emerald);box-shadow:0 0 6px rgba(16,185,129,0.4)"></span> Available</span>
            <button @click="toggleDark" class="theme-toggle">
              <i class="material-icons" style="transition:transform 0.3s ease">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-view />
        <div class="footer">
          <p>&copy; 2026 Md. Asaduzzaman (Aminur). All rights reserved.</p>
        </div>
      </main>

      <!-- Scroll to top -->
      <button @click="scrollToTop" class="scroll-top gradient-bg" :class="{ visible: showScrollTop }" :style="{boxShadow: '0 4px 15px rgba(20,184,166,0.4)'}">
        <i class="material-icons" style="transition:transform 0.3s ease">arrow_upward</i>
      </button>
    </div>
  `
};

/* ===================================================
   MOUNT
   =================================================== */
const app = Vue.createApp(App);
app.use(router);
app.mount('#app');
