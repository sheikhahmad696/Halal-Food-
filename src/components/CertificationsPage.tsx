import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertTriangle, FileText, Globe } from 'lucide-react';
import { PageRoute } from '../types';

interface CertificationsPageProps {
  onRouteChange: (route: PageRoute) => void;
}

const CERT_AUTHORITIES = [
  {
    code: 'MUIS',
    name: 'Majlis Ugama Islam Singapura (MUIS)',
    country: 'Singapore 🇸🇬',
    standards: 'Strict zero-alcohol, dedicated halal kitchens, annual unannounced audits, pork-free segregated logistics.',
    slaughterMethod: 'Hand-slaughtered and reversible stunned halal slaughter under certified international abattoirs.',
    verificationPortal: 'https://muis.gov.sg/halal',
    badge: 'MUIS Singapore Halal',
    status: 'Government Statutory Board',
  },
  {
    code: 'KMF',
    name: 'Korea Muslim Federation (KMF)',
    country: 'South Korea 🇰🇷',
    standards: 'Sole official Islamic body in South Korea. Certifies domestic Korean Hanwoo beef, poultry, and Korean traditional restaurants.',
    slaughterMethod: '100% Zabiha slaughter with verified Muslim slaughtermen. Strict screening for pork broth & mirin (cooking wine).',
    verificationPortal: 'http://www.koreahalal.org',
    badge: 'KMF Halal Certified',
    status: 'Official Federation',
  },
  {
    code: 'CICOT',
    name: 'The Central Islamic Council of Thailand (CICOT)',
    country: 'Thailand 🇹🇭',
    standards: 'Governs all Halal certification in Thailand. Audits street kitchens, coastal fisheries, and convenience store suppliers.',
    slaughterMethod: 'Islamic slaughter standard (THS 2432). Strictly monitors fish sauces, oyster extracts, and gelatin.',
    verificationPortal: 'http://cicot.or.th',
    badge: 'The Halal Standard of Thailand',
    status: 'National Supreme Authority',
  },
  {
    code: 'HMC',
    name: 'Halal Monitoring Committee (HMC UK)',
    country: 'United Kingdom 🇬🇧',
    standards: '100% non-stunned hand slaughter standard with permanent on-site inspection. Widely recognized as Europe’s strictest standard.',
    slaughterMethod: 'Strictly zero mechanical stunning. Full inspector presence at every stage from abattoir to restaurant.',
    verificationPortal: 'https://halalhmc.org',
    badge: 'HMC Stun-Free Certified',
    status: 'Independent Non-Profit Monitoring',
  },
  {
    code: 'HMA',
    name: 'Halal Monitoring Authority (HMA Canada)',
    country: 'Canada 🇨🇦',
    standards: 'Strict Canadian certification standard inspecting poultry and meat plants across Ontario, Quebec, and British Columbia.',
    slaughterMethod: 'Focus on hand slaughter with continuous on-site inspector verification.',
    verificationPortal: 'https://hmacanada.org',
    badge: 'HMA Certified Canada',
    status: 'Certified Regulatory Council',
  },
  {
    code: 'HFSAA',
    name: 'Halal Food Standards Alliance of America (HFSAA)',
    country: 'United States 🇺🇸',
    standards: 'Supervises commercial food service, abattoirs, and meat processors throughout North America.',
    slaughterMethod: 'Strict non-stunned and verified humane zabiha meat processes.',
    verificationPortal: 'https://hfsaa.org',
    badge: 'HFSAA Zabiha Verified',
    status: 'US National Halal Alliance',
  },
  {
    code: 'JAKIM',
    name: 'Jabatan Kemajuan Islam Malaysia (JAKIM)',
    country: 'Malaysia 🇲🇾',
    standards: 'Global gold standard benchmark for municipal, pharmaceutical, and hospitality Halal certification.',
    slaughterMethod: 'Halal MS1500:2019 standard with stringent traceability from farm to table.',
    verificationPortal: 'http://www.halal.gov.my',
    badge: 'JAKIM Malaysia',
    status: 'Prime Minister’s Department Authority',
  },
  {
    code: 'PHDA',
    name: 'Punjab Halal Development Agency (PHDA)',
    country: 'Pakistan 🇵🇰',
    standards: 'Provincial standards body monitoring slaughterhouses, food points, and royal culinary establishments in Punjab.',
    slaughterMethod: '100% Constitutional Zabiha halal meat production.',
    verificationPortal: 'https://halal.punjab.gov.pk',
    badge: 'PHDA Halal Pakistan',
    status: 'Government Agency',
  },
];

export const CertificationsPage: React.FC<CertificationsPageProps> = ({
  onRouteChange,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = CERT_AUTHORITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={() => onRouteChange({ type: 'home' })}
            className="hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
          </button>
          <span>/</span>
          <span className="font-semibold text-stone-900">Halal Certification Verification Guide</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Global Verification Standards
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
              International Halal Certification Authorities & Standards
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed">
              Understand the slaughter methods, audit rigor, and alcohol policies behind every verified establishment listed on HalalAtlas across 10 countries.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100 max-w-sm">
            <input
              type="text"
              placeholder="Search certification body (e.g. HMC, MUIS, KMF, CICOT)..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Certification Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((cert) => (
            <div
              key={cert.code}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4 hover:border-emerald-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs font-mono">
                      {cert.code}
                    </span>
                    <span className="text-xs font-semibold text-stone-600">
                      {cert.country}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    {cert.name}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-medium">
                    {cert.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-lg border border-stone-100">
                <div>
                  <strong className="text-stone-900 block mb-0.5">Slaughter & Zabiha Standards:</strong>
                  <span>{cert.slaughterMethod}</span>
                </div>
                <div>
                  <strong className="text-stone-900 block mb-0.5">Kitchen & Alcohol Governance:</strong>
                  <span>{cert.standards}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Active in HalalAtlas
                </span>
                <a
                  href={cert.verificationPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-500 hover:text-stone-900 underline text-[11px]"
                >
                  Official Registry ↗
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
