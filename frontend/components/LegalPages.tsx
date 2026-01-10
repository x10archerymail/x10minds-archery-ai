import React, { useEffect } from "react";
import { ArrowLeft, Shield, Scale, Cookie, Lock } from "lucide-react";

interface LegalPageProps {
  onBack: () => void;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const LegalPageBase: React.FC<LegalPageProps> = ({
  onBack,
  title,
  icon,
  content,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Landing
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-orange-500/10 rounded-2xl">{icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {title}
          </h1>
        </div>

        <div className="prose prose-invert prose-orange max-w-none">
          {content}
        </div>

        <div className="mt-20 pt-10 border-t border-white/10 text-neutral-500 text-sm text-center">
          © 2024 X10Minds Inc. All rights reserved. Last Updated: December 2024.
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <LegalPageBase
    onBack={onBack}
    title="Privacy Policy"
    icon={<Shield className="w-8 h-8 text-orange-500" />}
    content={
      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p className="italic text-sm text-neutral-500">
          Effective Date: December 19, 2024
        </p>
        <p>
          At X10Minds, accessible from ai.x10minds.com, one of our main
          priorities is the privacy of our visitors. This Privacy Policy
          document contains types of information that is collected and recorded
          by X10Minds and how we use it. We understand that as an archery AI
          service, you trust us with sensitive biomechanical and performance
          data. This document outlines our commitment to protecting that trust.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          1. Detailed Information Collection
        </h2>
        <p>
          X10Minds collects information in several ways when you interact with
          our platform. This collection is necessary for the AI to function and
          to provide you with a personalized coaching experience.
        </p>
        <div className="pl-4 border-l-2 border-orange-500/20 space-y-4">
          <p>
            <strong>A. Account Information:</strong> When you register, we
            collect your full name, email address, date of birth, and age. This
            allows us to calibrate our exercise (SPT) models based on
            age-appropriate physical loads.
          </p>
          <p>
            <strong>B. Biomechanical and Multimedia Content:</strong> This is
            the core of our service. When you upload photos or videos for "Form
            Analysis" or "Target Analysis", our computer vision models process
            these files to extract skeletal coordinates, joint angles, and
            anchor point data. While the metadata of the analysis is saved for
            your progression tracking, the raw files are treated with the
            highest tier of confidentiality.
          </p>
          <p>
            <strong>C. Chat Conversations:</strong> Our AI Coach (Coach X10)
            records chat history to maintain context across sessions. This
            allows the AI to remember your previous equipment settings, goals,
            and training progress.
          </p>
          <p>
            <strong>D. Automated Logging:</strong> We utilize standard server
            log files. This includes IP addresses, browser types, Internet
            Service Providers (ISP), date/time stamps, referring/exit pages, and
            click counts. We use this strictly for load balancing, debugging,
            and preventing unauthorized access.
          </p>
        </div>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          2. Processing of AI Analysis Data
        </h2>
        <p>
          Our "AI Archery Coach" uses advanced multimodal models. This means it
          doesn't just "see" an image; it interprets the physics of your shot.
          We use the extracted data to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Detect micro-collapses in the release phase.</li>
          <li>
            Calculate the alignment between the target-arm and the
            draw-shoulder.
          </li>
          <li>
            Measure anchor point consistency across different shooting sessions.
          </li>
          <li>
            Predict potential for repetitive strain injuries based on form
            irregularities.
          </li>
        </ul>
        <p>
          This data is stored in your private performance profile. We do not
          aggregate this data for public display unless you explicitly opt-in to
          the "Global Leaderboard" or "Community Review" features.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          3. Data Sharing and Disclosure
        </h2>
        <p>
          We firmly believe that your training data should remain yours.
          X10Minds does not sell or rent your personal information to data
          brokers or advertising networks. We only share information in the
          following limited circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Service Providers:</strong> We work with trusted
            infrastructure partners like Google Cloud and Firebase for data
            storage and AI model hosting. These partners are bound by strict
            data processing agreements.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your
            information if required to do so by law or in response to valid
            requests by public authorities (e.g., a court or a government
            agency).
          </li>
          <li>
            <strong>Business Transfers:</strong> If X10Minds is involved in a
            merger, acquisition, or asset sale, your personal data may be
            transferred. We will provide notice before your personal data is
            transferred and becomes subject to a different Privacy Policy.
          </li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          4. International Data Transfers
        </h2>
        <p>
          Your information, including Personal Data, is processed at the
          Company's operating offices and in any other places where the parties
          involved in the processing are located. It means that this information
          may be transferred to — and maintained on — computers located outside
          of your state, province, country or other governmental jurisdiction
          where the data protection laws may differ than those from your
          jurisdiction.
        </p>
        <p>
          Your consent to this Privacy Policy followed by your submission of
          such information represents your agreement to that transfer. X10Minds
          will take all steps reasonably necessary to ensure that your data is
          treated securely and in accordance with this Privacy Policy.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          5. Data Retention Policy
        </h2>
        <p>
          We will retain your Personal Data only for as long as is necessary for
          the purposes set out in this Privacy Policy. We will retain and use
          your Personal Data to the extent necessary to comply with our legal
          obligations, resolve disputes, and enforce our legal agreements and
          policies.
        </p>
        <p>
          Performance analysis data (joint angles, scores) is retained for the
          lifetime of your account to provide you with "Progression Charts". If
          you choose to delete your account, this data is purged from our active
          databases within 30 days.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          6. GDPR and CCPA Compliance
        </h2>
        <p>
          Depending on your location, you have specific rights regarding your
          data.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Right to Access:</strong> You can request a full export of
            your archery performance data and personal profile at any time.
          </li>
          <li>
            <strong>Right to Erasure:</strong> You can request that we delete
            all data associated with your account ("The right to be forgotten").
          </li>
          <li>
            <strong>Right to Object:</strong> You can opt-out of "form data
            collection" even as a Pro user, although this will limit the AI's
            ability to provide historical comparisons.
          </li>
          <li>
            <strong>California Privacy Rights (CCPA):</strong> We do not "sell"
            your data in the traditional sense. However, we allow you to opt-out
            of any third-party analytics cookies.
          </li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          7. Contact our Data Protection Officer
        </h2>
        <p>
          If you have questions about this policy or our data practices, please
          reach out to our privacy team at{" "}
          <strong>privacy@ai.x10minds.com</strong>.
        </p>
      </div>
    }
  />
);

export const TermsOfService: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => (
  <LegalPageBase
    onBack={onBack}
    title="Terms of Service"
    icon={<Scale className="w-8 h-8 text-blue-500" />}
    content={
      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p className="italic text-sm text-neutral-500">
          Last Revised: December 19, 2024
        </p>
        <p>
          Welcome to X10Minds! By using our platform, you are agreeing to these
          terms. Please read them carefully. Our platform provides advanced
          AI-driven coaching, which involves physical activity and the use of
          archery equipment. Your safety and legal understanding are paramount.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using the X10Minds website, AI coaching services, or
          mobile applications, you ("User" or "you") agree to be bound by these
          Terms of Service. These terms form a legally binding agreement between
          you and X10Minds Inc. If you do not agree to these terms, you must
          immediately cease all use of our services.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          2. Archery Safety & Physical Risks (CRITICAL)
        </h2>
        <p>
          <strong>A. Educational Nature:</strong> X10Minds is an artificial
          intelligence-based educational tool. It provides technical analysis
          and exercise recommendations based on generic biomechanical models.
        </p>
        <p>
          <strong>B. Safety First:</strong> Archery involves the use of weapons
          that can cause serious injury or death. You agree that you will only
          practice archery in sanctioned environments (e.g., archery ranges) and
          follow all local safety regulations. Our AI cannot detect if your
          environment is safe.
        </p>
        <p>
          <strong>C. Physical Consultation:</strong> Before starting any
          Specific Physical Training (SPT) plans suggested by the AI, you should
          consult with a qualified medical professional. X10Minds is not
          responsible for injuries sustained while performing exercises
          recommended by the platform.
        </p>
        <p>
          <strong>D. Equipment Integrity:</strong> Our AI cannot inspect the
          physical state of your bow, arrows, or accessories. You are solely
          responsible for ensuring your equipment is in safe, working condition.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          3. User Accounts & Responsibilities
        </h2>
        <p>
          To access certain features (like Form Analysis or Pro history), you
          must create an account. You agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Provide accurate and complete information during registration.
          </li>
          <li>Keep your password secure and confidential.</li>
          <li>Promptly update your email address if it changes.</li>
          <li>
            Notify us immediately of any unauthorized use of your account.
          </li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          4. User Conduct and Restrictions
        </h2>
        <p>
          You agree not to use X10Minds for any unlawful purpose. Prohibited
          behaviors include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Uploading content that infringes on third-party intellectual
            property or privacy rights.
          </li>
          <li>
            Attempting to reverse-engineer our AI models or proprietary "X10
            Analysis" algorithms.
          </li>
          <li>
            Using the platform for "Deepfake" creation or non-archery related
            video analysis.
          </li>
          <li>Scraping data from the site for use in competing AI models.</li>
          <li>Harassing other users in the community sections.</li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          5. Intellectual Property Rights
        </h2>
        <p>
          <strong>A. Our Content:</strong> The X10Minds name, logo, software, AI
          models, and original content are the exclusive property of X10Minds
          Inc. and its licensors.
        </p>
        <p>
          <strong>B. Your Content:</strong> When you upload videos for analysis,
          you retain ownership of that content. However, you grant X10Minds a
          non-exclusive, royalty-free license to process this data to provide
          analysis and to improve our AI models (as detailed in our Privacy
          Policy).
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          6. Subscription, Payments, and Refunding
        </h2>
        <p>We offer "Sniper Pro" and "Ultra" membership tiers.</p>
        <div className="pl-4 border-l-2 border-blue-500/20 space-y-4">
          <p>
            <strong>Billing:</strong> Paid subscriptions are billed in advance
            on a recurring monthly or annual basis. Your subscription will
            automatically renew unless cancelled.
          </p>
          <p>
            <strong>Cancellations:</strong> You may cancel your subscription at
            any time via the User Settings. Your access will continue until the
            end of the current billing cycle.
          </p>
          <p>
            <strong>Refunds:</strong> Since our AI resources (GPU time) are
            consumed per-request, we do not generally offer refunds for partial
            months. However, if you experience technical failure that prevents
            analysis, please contact support for a credit.
          </p>
        </div>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          7. Limitation of Liability
        </h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, X10MINDS INC. SHALL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
          DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
          INTANGIBLE LOSSES, RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR
          INABILITY TO ACCESS OR USE THE SERVICES; (ii) ANY CONDUCT OR CONTENT
          OF ANY THIRD PARTY ON THE SERVICES.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          8. Governing Law
        </h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of the State of Gujarat, India, without regard to its conflict of
          law provisions. Any legal action or proceeding arising under these
          Terms will be brought exclusively in the courts located in Gujarat,
          India.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          9. Termination
        </h2>
        <p>
          We may terminate or suspend your account and bar access to the Service
          immediately, without prior notice or liability, under our sole
          discretion, for any reason whatsoever and without limitation,
          including but not limited to a breach of the Terms.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          10. Modifications to Service and Terms
        </h2>
        <p>
          We reserve the right to withdraw or amend our Service, and any service
          or material we provide via the platform, in our sole discretion
          without notice. We will inform users of significant changes to these
          Terms via email or a prominent notice on our site.
        </p>
      </div>
    }
  />
);

export const CookiePolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <LegalPageBase
    onBack={onBack}
    title="Cookie Policy"
    icon={<Cookie className="w-8 h-8 text-yellow-500" />}
    content={
      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p className="italic text-sm text-neutral-500">
          Effective Date: December 19, 2024
        </p>
        <p>
          This is the Cookie Policy for X10Minds, accessible from
          ai.x10minds.com. We believe in being transparent about how we collect
          and use data related to you. In the spirit of transparency, this
          policy provides detailed information about how and when we use cookies
          on our Website.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          1. What Are Cookies?
        </h2>
        <p>
          Cookies are small pieces of text sent by your web browser by a website
          you visit. A cookie file is stored in your web browser and allows the
          Service or a third-party to recognize you and make your next visit
          easier and the Service more useful to you.
        </p>
        <p>
          Cookies can be "persistent" or "session" cookies. Persistent cookies
          remain on your personal computer or mobile device when you go offline,
          while session cookies are deleted as soon as you close your web
          browser.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          2. How X10Minds Uses Cookies
        </h2>
        <p>
          When you use and access the Service, we may place a number of cookies
          files in your web browser. We use cookies for the following purposes:
        </p>
        <div className="pl-4 border-l-2 border-yellow-500/20 space-y-4">
          <p>
            <strong>Essential Cookies:</strong> These are necessary for the
            website to function. They include cookies that allow you to log into
            secure areas of our site, use a shopping cart, or make use of
            e-billing services. Without these, the AI coach cannot maintain your
            session.
          </p>
          <p>
            <strong>Preference Cookies:</strong> These are used to recognize you
            when you return to our website. This enables us to personalize our
            content for you, greet you by name, and remember your preferences
            (for example, your choice of language or region, or your Dark/Light
            mode setting).
          </p>
          <p>
            <strong>Analytics Cookies:</strong> We use these to understand how
            visitors interact with the website. This helps us improve the user
            experience by identifying which pages are performing well and which
            need optimization. We primarily use Google Analytics for this
            purpose.
          </p>
          <p>
            <strong>Marketing Cookies:</strong> These cookies record your visit
            to our website, the pages you have visited, and the links you have
            followed. We may use this information to make our website and the
            advertising displayed on it more relevant to your archery interests.
          </p>
        </div>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          3. Third-Party Cookies
        </h2>
        <p>
          In addition to our own cookies, we may also use various third-parties
          cookies to report usage statistics of the Service, deliver
          advertisements on and through the Service, and so on.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Google Analytics:</strong> To measure training session
            duration and bounce rates to optimize our AI response speed.
          </li>
          <li>
            <strong>Firebase Auth:</strong> To manage secure login sessions
            across different devices (Mobile/Desktop).
          </li>
          <li>
            <strong>Cloudinary/Pollinations:</strong> To manage the delivery of
            AI-generated visualizations and form analysis overlays.
          </li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          4. Your Choices Regarding Cookies
        </h2>
        <p>
          If you'd like to delete cookies or instruct your web browser to delete
          or refuse cookies, please visit the help pages of your web browser.
        </p>
        <p>
          Please note, however, that if you delete cookies or refuse to accept
          them, you might not be able to use all of the features we offer, you
          may not be able to store your preferences, and some of our pages might
          not display properly.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            For the Chrome web browser, please visit this page from Google:{" "}
            <a
              href="https://support.google.com/accounts/answer/32050"
              className="text-orange-500 hover:underline"
            >
              Support Link
            </a>
          </li>
          <li>
            For the Internet Explorer web browser, please visit this page from
            Microsoft:{" "}
            <a
              href="http://support.microsoft.com/kb/278835"
              className="text-orange-500 hover:underline"
            >
              Support Link
            </a>
          </li>
          <li>
            For the Firefox web browser, please visit this page from Mozilla:{" "}
            <a
              href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored"
              className="text-orange-500 hover:underline"
            >
              Support Link
            </a>
          </li>
          <li>
            For any other web browser, please visit your web browser's official
            web pages.
          </li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          5. More Information
        </h2>
        <p>
          Check back regularly for updates to our Cookie Policy. As browsers
          evolve and new privacy regulations (like ePrivacy Directive) emerge,
          we will adjust our practices to ensure you remain protected and
          informed.
        </p>
      </div>
    }
  />
);

export const SecurityPolicy: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => (
  <LegalPageBase
    onBack={onBack}
    title="Security"
    icon={<Lock className="w-8 h-8 text-green-500" />}
    content={
      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <p className="italic text-sm text-neutral-500">
          Document Version: 1.41 - Security Operations
        </p>
        <p>
          X10Minds handles sensitive biomechanical data, personal performance
          metrics, and proprietary AI analysis. Security is not an afterthought
          for us; it is built into every layer of our stack. This document
          details our technical and organizational security measures.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          1. Encryption and Data Protection
        </h2>
        <div className="pl-4 border-l-2 border-green-500/20 space-y-4">
          <p>
            <strong>A. Transmission (Data in Transit):</strong> All
            communications between the X10Minds client and our servers use TLS
            1.3 encryption. This prevents "Man-in-the-Middle" (MITM) attacks and
            ensures your analysis videos are private during upload.
          </p>
          <p>
            <strong>B. Storage (Data at Rest):</strong> We use AES-256
            encryption for all data stored in our databases. This includes your
            chat history, score progression, and account details. Even in the
            unlikely event of physical hardware theft, your data remains
            unreadable.
          </p>
          <p>
            <strong>C. Cryptographic Hashing:</strong> User passwords are never
            stored. We use Argon2 or bcrypt with high work factors and unique
            salts for every user to ensure password integrity.
          </p>
        </div>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          2. Infrastructure and Network Security
        </h2>
        <p>
          Our infrastructure is hosted on Google Cloud Platform (GCP). This
          allows us to leverage world-class security features:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Virtual Private Cloud (VPC):</strong> Our AI processing
            nodes are isolated from the public internet in private subnets.
          </li>
          <li>
            <strong>Cloud Armor:</strong> We utilize advanced DDoS protection
            and Web Application Firewall (WAF) to prevent SQL injection and
            Cross-Site Scripting (XSS).
          </li>
          <li>
            <strong>Identity and Access Management (IAM):</strong> We follow the
            principle of "Least Privilege". Only automated systems have access
            to primary data stores; human access is restricted to emergency
            "break-glass" scenarios only.
          </li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          3. AI Safety & Model Integrity
        </h2>
        <p>
          As an AI-first company, we monitor our models for "Jailbreaking" or
          "Prompt Injection" attempts. We use specialized guardrail layers to
          ensure that Coach X10 only provides relevant, safe, and technically
          accurate archery advice. Our models are periodically audited for bias
          and response consistency.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          4. Vulnerability Management
        </h2>
        <p>
          We perform daily automated vulnerability scanning across our entire
          containerized environment. This includes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Static Application Security Testing (SAST):</strong>{" "}
            Scanning our codebase for security flaws before deployment.
          </li>
          <li>
            <strong>Dependency Monitoring:</strong> Utilizing tools like Snyk to
            ensure all third-party libraries (React, Lucide, etc.) are up to
            date and free of known CVEs.
          </li>
          <li>
            <strong>Incidence Response:</strong> We maintain a 24/7 on-call
            rotation to respond to any security incidents within 15 minutes of
            detection.
          </li>
        </ul>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          5. Compliance and Physical Security
        </h2>
        <p>
          Our data centers are SOC 2 Type II, ISO 27001, and PCI-DSS compliant.
          Physical access to these servers is restricted by biometric scanners
          and industrial-grade security personnel. While X10Minds is a cloud
          service, we treat the physical security of our infrastructure as if it
          were on-premise.
        </p>

        <h2 className="text-white text-2xl font-bold mt-8 border-b border-white/5 pb-2">
          6. Reporting a Security Issue
        </h2>
        <p>
          If you believe you have found a security vulnerability in our
          platform, please do not disclose it publicly. Email us at{" "}
          <strong>security@ai.x10minds.com</strong>. We take all reports
          seriously and offer a "Reputation Hall of Fame" for researchers who
          help us make X10Minds safer.
        </p>
      </div>
    }
  />
);
