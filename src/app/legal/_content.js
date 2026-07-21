import { siteConfig } from "@/seo/site";

export const legalContactEmail = "wyong@palworldwiki.org";
export const legalUpdatedDate = "July 15, 2026";
export const legalCopyrightNotice = `Copyright © ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved`;

export const legalRoutes = [
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/terms-of-service", label: "Terms of Service" },
  { href: "/legal/copyright", label: "Copyright" },
  { href: "/legal/about-us", label: "About Us" },
  { href: "/legal/contact-us", label: "Contact Us" },
];

export const legalPages = {
  privacyPolicy: {
    title: "Palworld Wiki Privacy Policy",
    seo: {
      title: "Palworld Wiki Privacy Policy and Data Use",
      description:
        "Palworld Wiki Privacy Policy explains technical data processing, email handling, cookies, third-party services, retention, and privacy contact options.",
      keywords: "Palworld Wiki Privacy Policy, Palworld Wiki privacy, Palworld Wiki data policy",
    },
    eyebrow: "Legal",
    description:
      "This Privacy Policy explains what information Palworld Wiki may collect, how it is used, and how players can contact us about privacy questions.",
    href: "/legal/privacy-policy",
    sections: [
      {
        title: "Overview",
        body: [
          "Palworld Wiki is an independent game wiki and player guide site. This Privacy Policy describes how the site handles information when you browse pages, use site search, open another page, or contact us by email.",
          "The site is designed as a public reading and lookup resource. We do not require account registration, we do not ask visitors to submit gameplay data, and we do not provide account dashboards or user profiles.",
        ],
      },
      {
        title: "Information we may receive",
        body: [
          "When you visit the site, basic technical information may be processed by hosting, security, logging, or analytics systems. This can include browser type, device information, approximate region, pages requested, referral information, and timestamps.",
          "If you choose to email us, we may receive your email address, your name if you include it, and the content of your message. We use that information only to read, respond to, and manage the request.",
        ],
      },
      {
        title: "How information is used",
        body: [
          "Technical information helps keep the site available, diagnose errors, understand which pages need improvement, prevent abuse, and maintain a better page experience for players.",
          "Email information is used to respond to questions, copyright concerns, correction requests, business notices, or other site-related messages. We do not sell personal information.",
        ],
      },
      {
        title: "Cookies and similar technologies",
        body: [
          "The site may use cookies or similar browser technologies if they are required by hosting, security, analytics, or performance services. These technologies can help remember basic preferences, measure page performance, or protect the site from abusive traffic.",
          "You can usually control cookies through your browser settings. Blocking some cookies may affect analytics accuracy or certain browser-level behavior, but the main wiki content should remain readable.",
        ],
      },
      {
        title: "Third-party services",
        body: [
          "Some technical services may process limited information on our behalf, such as hosting, performance monitoring, analytics, search indexing, security checks, or embedded content used by guide pages.",
          "Those services are responsible for their own privacy practices. We choose services for ordinary website operation, but we cannot control every third-party system once a request leaves this site.",
        ],
      },
      {
        title: "Data retention and contact",
        body: [
          "We keep information only as long as reasonably needed for site operation, legal compliance, abuse prevention, troubleshooting, or correspondence history.",
          `For privacy questions, correction requests, or concerns about information you sent to us, contact ${legalContactEmail}.`,
        ],
      },
    ],
  },
  termsOfService: {
    title: "Palworld Wiki Terms of Service",
    seo: {
      title: "Palworld Wiki Terms of Service and Site Rules",
      description:
        "Palworld Wiki Terms of Service explain permitted use, content accuracy, intellectual property, availability, responsibility limits, and contact procedures.",
      keywords: "Palworld Wiki Terms of Service, Palworld Wiki terms, Palworld Wiki site rules",
    },
    eyebrow: "Legal",
    description:
      "These Terms of Service explain the basic rules for using Palworld Wiki as an independent player guide and lookup site.",
    href: "/legal/terms-of-service",
    sections: [
      {
        title: "Acceptance of terms",
        body: [
          "By accessing or using Palworld Wiki, you agree to these Terms of Service. If you do not agree with these terms, do not use the site.",
          "These terms may be updated from time to time. Continued use of the site after updates means you accept the revised terms.",
        ],
      },
      {
        title: "Site purpose",
        body: [
          "Palworld Wiki provides game lookup pages, player guides, Pal data, item pages, breeding notes, map planning, patch coverage, and related informational content.",
          "The site is intended for general informational and entertainment purposes. Game data, routes, recommendations, and update notes may change as the game changes.",
        ],
      },
      {
        title: "Allowed use",
        body: [
          "You may browse the site, link to public pages, use the information for personal gameplay planning, and share page URLs with other players.",
          "You may not use the site to attack infrastructure, extract content automatically at unreasonable volume, bypass security controls, misrepresent the site, or copy large portions of the site into another product without permission.",
        ],
      },
      {
        title: "Accuracy and availability",
        body: [
          "We work to keep content useful and current, but we do not guarantee that every page is complete, error-free, or current for every game version.",
          "The site may be updated, reorganized, unavailable, or discontinued at any time. We are not responsible for gameplay decisions, lost progress, missed items, or other outcomes based on site content.",
        ],
      },
      {
        title: "Intellectual property",
        body: [
          "Original site layout, written guide text, page organization, and site-specific presentation are owned by Palworld Wiki unless otherwise stated.",
          "Palworld names, game concepts, images, and related marks belong to their respective owners. This site is an independent fan-made guide and is not an official game publisher website.",
        ],
      },
      {
        title: "Contact",
        body: [
          `Questions about these terms can be sent to ${legalContactEmail}. Please include the page URL and a clear description of the issue when relevant.`,
        ],
      },
    ],
  },
  copyright: {
    title: "Palworld Wiki Copyright",
    seo: {
      title: "Palworld Wiki Copyright and Rights Notice",
      description:
        "Palworld Wiki Copyright explains ownership of original guide content, game-related rights, permitted linking, reuse limits, notices, and contact procedures.",
      keywords: "Palworld Wiki Copyright, Palworld Wiki rights, Palworld Wiki fan guide copyright",
    },
    eyebrow: "Legal",
    description:
      "This Copyright page explains ownership, fan-site status, content usage, and how to contact Palworld Wiki about rights concerns.",
    href: "/legal/copyright",
    sections: [
      {
        title: "Copyright notice",
        body: [
          legalCopyrightNotice,
          "Original site text, organization, interface presentation, and guide structure are protected by copyright unless otherwise noted.",
        ],
      },
      {
        title: "Game-related rights",
        body: [
          "Palworld names, logos, artwork, screenshots, characters, Pals, items, locations, and related game assets are the property of their respective owners.",
          "This site is an independent fan-made wiki and guide site. It is not affiliated with, endorsed by, or operated by the owners or publishers of Palworld.",
        ],
      },
      {
        title: "Permitted page use",
        body: [
          "You may link to Palworld Wiki pages and use page URLs for personal or community discussion.",
          "You may not copy full pages, mirror the site, bulk reuse structured content, republish images as your own assets, or use the site in a way that suggests official endorsement.",
        ],
      },
      {
        title: "Rights concerns",
        body: [
          "If you believe content on the site infringes your rights, contact us with the page URL, a description of the material, proof that you are authorized to act, and the requested action.",
          `Rights notices can be sent to ${legalContactEmail}. We review reasonable requests and may remove, revise, or clarify content when appropriate.`,
        ],
      },
    ],
  },
  aboutUs: {
    title: "About Palworld Wiki",
    seo: {
      title: "About Palworld Wiki - Purpose, Coverage and Contact",
      description:
        "About Palworld Wiki explains the player-guide mission, Pal and Database coverage, breeding, map and update focus, content standards, and contact details.",
      keywords: "About Palworld Wiki, Palworld Wiki about us, Palworld Wiki player guide",
    },
    eyebrow: "About",
    description:
      "About Palworld Wiki, an independent player-focused guide site for Pals, Database items, breeding, maps, updates, and practical Palworld routes.",
    href: "/legal/about-us",
    sections: [
      {
        title: "Who we are",
        body: [
          "Palworld Wiki is an independent player-focused guide site built for people who want quick lookup pages and practical route planning in one place.",
          "The site organizes Pals, Database items, breeding workflows, map planning, update notes, and guide checklists so players can move from a question to the next useful action.",
        ],
      },
      {
        title: "What the site covers",
        body: [
          "Core coverage includes Pal pages, item categories, item detail pages, breeding planning, Palpagos map guidance, update tracking, and concise progression guides.",
          "The goal is to keep pages useful for actual play: choosing workers, comparing combat options, finding item paths, planning Cake production, checking map routes, and reviewing major update changes.",
        ],
      },
      {
        title: "Content standards",
        body: [
          "We separate factual game data from practical player advice. When a page includes route guidance, it is written to help players make decisions rather than to replace in-game checking.",
          "Because Palworld changes over time, some details may need updates after patches. Pages are reviewed as game data and player guidance change.",
        ],
      },
      {
        title: "Independence",
        body: [
          "Palworld Wiki is not an official Palworld website. The site exists as a fan-made wiki and guide project for players.",
          `For corrections, site questions, or general contact, email ${legalContactEmail}.`,
        ],
      },
    ],
  },
  contactUs: {
    title: "Contact Palworld Wiki",
    seo: {
      title: "Contact Palworld Wiki - Corrections and Notices",
      description:
        "Contact Palworld Wiki for corrections, copyright notices, privacy questions, content issues, and general site feedback using the official contact email.",
      keywords: "Contact Palworld Wiki, Palworld Wiki contact, Palworld Wiki corrections",
    },
    eyebrow: "Contact",
    description:
      "Contact Palworld Wiki about corrections, legal notices, content questions, and general site feedback.",
    href: "/legal/contact-us",
    sections: [
      {
        title: "Contact email",
        body: [
          `For site questions, correction requests, copyright notices, privacy questions, or other messages, contact ${legalContactEmail}.`,
          "There is no contact form on this page. Please use email so the message includes your return address and enough detail for a clear reply.",
        ],
      },
      {
        title: "What to include",
        body: [
          "For corrections, include the page URL, the specific line or section, what should be changed, and any context that helps us verify the issue.",
          "For rights or copyright concerns, include the page URL, the material at issue, your relationship to the rights holder, and the requested action.",
          "For general feedback, include the page or feature you are referring to and what would make it more useful for players.",
        ],
      },
      {
        title: "Response expectations",
        body: [
          "We review reasonable messages, but we cannot guarantee a response time or guarantee that every requested edit will be made.",
          "Messages that are abusive, automated, unrelated to the site, or missing enough detail may not receive a response.",
        ],
      },
    ],
  },
};
