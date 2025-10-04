// // components/PackageStatus.tsx
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { getRemainingProperties, hasValidPackage } from '@/lib/packageUtils';
// import { Package, AlertCircle, CheckCircle } from 'lucide-react';

// interface PackageStatusProps {
//   currentLang: 'en' | 'mr';
//   userType: 'buyer' | 'seller';
// }

// const PackageStatus: React.FC<PackageStatusProps> = ({ currentLang, userType }) => {
//   const selectedPackage = localStorage.getItem('selectedPackage');
//   const remaining = getRemainingProperties();
//   const isValid = hasValidPackage();
  
//   const translations = {
//     en: {
//       title: "Your Package",
//       current: "Current Package",
//       remainingViews: "Remaining Views",
//       remainingListings: "Remaining Listings",
//       valid: "Active",
//       expired: "Expired",
//       noPackage: "No active package",
//       upgrade: "Upgrade Now"
//     },
//     mr: {
//       title: "तुमचा पॅकेज",
//       current: "सध्याचा पॅकेज",
//       remainingViews: "उर्वरित दृश्ये",
//       remainingListings: "उर्वरित लिस्टिंग",
//       valid: "सक्रिय",
//       expired: "कालबाह्य",
//       noPackage: "कोणताही सक्रिय पॅकेज नाही",
//       upgrade: "आता अपग्रेड करा"
//     }
//   };
  
//   const t = translations[currentLang];
  
//   if (!selectedPackage || !isValid) {
//     return (
//       <Card className="mb-6">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-lg flex items-center">
//             <Package className="h-5 w-5 mr-2" />
//             {t.title}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
//               <span>{t.noPackage}</span>
//             </div>
//             <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
//               {t.expired}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }
  
//   return (
//     <Card className="mb-6">
//       <CardHeader className="pb-3">
//         <CardTitle className="text-lg flex items-center">
//           <Package className="h-5 w-5 mr-2" />
//           {t.title}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center justify-between mb-2">
//           <span className="font-medium">{t.current}</span>
//           <Badge variant="outline" className="capitalize">
//             {selectedPackage}
//           </Badge>
//         </div>
        
//         <div className="flex items-center justify-between mb-2">
//           <span className="font-medium">
//             {userType === 'buyer' ? t.remainingViews : t.remainingListings}
//           </span>
//           <span className="font-bold text-blue-600">{remaining}</span>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <span className="font-medium">Status</span>
//           <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             {t.valid}
//           </Badge>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PackageStatus;