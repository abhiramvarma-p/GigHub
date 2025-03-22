export const predefinedCategories = [
  {
    id: 'web-development',
    name: 'Web Development',
    children: [
      {
        id: 'frontend',
        name: 'Frontend',
        children: [
          {
            id: 'markup-styling',
            name: 'Markup & Styling',
            skills: [
              { id: 'html5', name: 'HTML5' },
              { id: 'css3', name: 'CSS3' },
              { id: 'sass', name: 'Sass/SCSS' },
              { id: 'less', name: 'LESS' },
              { id: 'bootstrap', name: 'Bootstrap' },
              { id: 'tailwind', name: 'Tailwind CSS' },
              { id: 'material-ui', name: 'Material-UI' }
            ]
          },
          {
            id: 'programming',
            name: 'Programming',
            skills: [
              { id: 'javascript', name: 'JavaScript (ES6+)' },
              { id: 'typescript', name: 'TypeScript' },
              { id: 'coffeescript', name: 'CoffeeScript' }
            ]
          },
          {
            id: 'frameworks-libraries',
            name: 'Frameworks/Libraries',
            skills: [
              { id: 'react', name: 'React' },
              { id: 'redux', name: 'Redux' },
              { id: 'angular', name: 'Angular (AngularJS, Angular 2+)' },
              { id: 'vue', name: 'Vue.js (Vuex, Nuxt.js)' },
              { id: 'ember', name: 'Ember.js' },
              { id: 'jquery', name: 'jQuery' }
            ]
          },
          {
            id: 'state-management-routing',
            name: 'State Management & Routing',
            skills: [
              { id: 'redux-toolkit', name: 'Redux Toolkit' },
              { id: 'mobx', name: 'MobX' },
              { id: 'react-router', name: 'React Router' },
              { id: 'vue-router', name: 'Vue Router' },
              { id: 'nextjs', name: 'Next.js' },
              { id: 'gatsby', name: 'Gatsby' }
            ]
          },
          {
            id: 'frontend-concepts',
            name: 'Concepts',
            skills: [
              { id: 'responsive-design', name: 'Responsive Design' },
              { id: 'mobile-first', name: 'Mobile-First Design' },
              { id: 'pwa', name: 'Progressive Web Apps (PWA)' },
              { id: 'spa', name: 'Single Page Applications (SPA)' },
              { id: 'cross-browser', name: 'Cross-Browser Compatibility' },
              { id: 'accessibility', name: 'Web Accessibility (WCAG)' },
              { id: 'seo', name: 'SEO Best Practices' }
            ]
          }
        ]
      },
      {
        id: 'backend',
        name: 'Backend',
        children: [
          {
            id: 'languages-frameworks',
            name: 'Languages/Frameworks',
            skills: [
              { id: 'nodejs', name: 'Node.js (Express.js, Koa, Hapi, NestJS)' },
              { id: 'php', name: 'PHP (Laravel, Symfony, CodeIgniter, Zend)' },
              { id: 'python', name: 'Python (Django, Flask, Pyramid, FastAPI)' },
              { id: 'ruby', name: 'Ruby (Rails, Sinatra)' },
              { id: 'java', name: 'Java (Spring Boot, Java EE, Jakarta EE)' },
              { id: 'csharp', name: 'C# (.NET, ASP.NET MVC/Core)' },
              { id: 'go', name: 'Go (Gin, Echo)' },
              { id: 'scala', name: 'Scala (Play Framework)' }
            ]
          },
          {
            id: 'apis',
            name: 'APIs',
            skills: [
              { id: 'rest', name: 'RESTful API' },
              { id: 'graphql', name: 'GraphQL (Apollo Server, Relay)' },
              { id: 'soap', name: 'SOAP' },
              { id: 'websockets', name: 'WebSockets' },
              { id: 'grpc', name: 'gRPC' }
            ]
          },
          {
            id: 'database-integration',
            name: 'Database Integration',
            skills: [
              { id: 'sql', name: 'SQL (MySQL, PostgreSQL, MSSQL, SQLite, Oracle)' },
              { id: 'nosql', name: 'NoSQL (MongoDB, Cassandra, CouchDB, Firebase)' },
              { id: 'in-memory', name: 'In-Memory (Redis, Memcached)' }
            ]
          },
          {
            id: 'auth-security',
            name: 'Authentication & Security',
            skills: [
              { id: 'jwt', name: 'JWT' },
              { id: 'oauth', name: 'OAuth' },
              { id: 'passport', name: 'Passport.js' },
              { id: 'bcrypt', name: 'bcrypt' },
              { id: 'cors', name: 'CORS' },
              { id: 'csrf', name: 'CSRF Protection' }
            ]
          }
        ]
      },
      {
        id: 'fullstack',
        name: 'Full-Stack/Other',
        children: [
          {
            id: 'stacks-architectures',
            name: 'Stacks & Architectures',
            skills: [
              { id: 'mern', name: 'MERN' },
              { id: 'mean', name: 'MEAN' },
              { id: 'pern', name: 'PERN' },
              { id: 'jamstack', name: 'JAMstack' },
              { id: 'lamp', name: 'LAMP' }
            ]
          },
          {
            id: 'tools',
            name: 'Tools',
            skills: [
              { id: 'git', name: 'Git/GitHub' },
              { id: 'docker', name: 'Docker' },
              { id: 'kubernetes', name: 'Kubernetes' },
              { id: 'cicd', name: 'CI/CD (Jenkins, GitLab CI)' },
              { id: 'nginx', name: 'Nginx' },
              { id: 'apache', name: 'Apache' },
              { id: 'webpack', name: 'Webpack' },
              { id: 'babel', name: 'Babel' },
              { id: 'eslint', name: 'ESLint' },
              { id: 'prettier', name: 'Prettier' }
            ]
          },
          {
            id: 'testing',
            name: 'Testing',
            skills: [
              { id: 'jest', name: 'Jest' },
              { id: 'mocha', name: 'Mocha' },
              { id: 'chai', name: 'Chai' },
              { id: 'cypress', name: 'Cypress' },
              { id: 'selenium', name: 'Selenium' },
              { id: 'puppeteer', name: 'Puppeteer' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'game-development',
    name: 'Game Development',
    children: []
  },
  {
    id: 'app-development',
    name: 'App Development',
    children: []
  },
  {
    id: 'data-science-analytics',
    name: 'Data Science & Analytics',
    children: []
  },
  {
    id: 'ui-ux-graphic-design',
    name: 'UI/UX & Graphic Design',
    children: []
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    children: []
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    children: []
  },
  {
    id: 'cloud-computing-devops',
    name: 'Cloud Computing & DevOps',
    children: []
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    children: []
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    children: []
  },
  {
    id: 'product-management',
    name: 'Product Management',
    children: []
  },
  {
    id: 'quality-assurance-testing',
    name: 'Quality Assurance & Testing',
    children: []
  },
  {
    id: 'business-analysis',
    name: 'Business Analysis',
    children: []
  },
  {
    id: 'customer-technical-support',
    name: 'Customer & Technical Support',
    children: []
  },
  {
    id: 'ecommerce-retail-tech',
    name: 'E-commerce & Retail Tech',
    children: []
  },
  {
    id: 'ai-machine-learning',
    name: 'AI & Machine Learning',
    children: []
  },
  {
    id: 'iot-embedded-systems',
    name: 'IoT & Embedded Systems',
    children: []
  },
  {
    id: 'blockchain-cryptocurrency',
    name: 'Blockchain & Cryptocurrency',
    children: []
  },
  {
    id: 'ar-vr-development',
    name: 'AR/VR Development',
    children: []
  },
  {
    id: 'networking-system-administration',
    name: 'Networking & System Administration',
    children: []
  }
]; 