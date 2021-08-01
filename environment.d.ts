declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGODB_URI: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
        SENDGRID_KEY?: string;
        SENDGRID_EMAIL?: string;
        SMTP_EMAIL: string;
        SMTP_PWD: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}