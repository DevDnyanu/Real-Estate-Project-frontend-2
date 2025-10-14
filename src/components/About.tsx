import { Target, Award, TrendingUp, Phone, Mail, Building, Info, Users, Shield, Heart, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface AboutProps {
  currentLang: 'en' | 'mr';
}

const translations = {
  en: {
    title: "About PlotChamp",
    subtitle: "Your trusted partner in finding the perfect property. We've been helping people find their dream homes and investment opportunities since 2009.",
    stats: {
      properties: "Properties Sold",
      clients: "Happy Clients",
      experience: "Years Experience",
      cities: "Cities Covered"
    },
    story: {
      title: "Our Story",
      tagline: "Building Dreams, Creating Homes",
      p1: "Founded in 2009, PlotChamp started with a simple yet powerful mission: to make real estate accessible, transparent, and hassle-free for everyone.",
      p2: "We believe that finding the right property shouldn't be complicated. With our experienced team and innovative technology, we've transformed the way people buy and sell properties in India.",
      p3: "Today, we're proud to have helped thousands of families find their perfect homes and assisted countless investors in making smart real estate decisions.",
      mission: "Our Mission",
      missionText: "To revolutionize the real estate experience by providing transparent, efficient, and customer-centric property solutions that empower every Indian to find their dream home.",
      vision: "Our Vision",
      visionText: "To become India's most trusted and preferred real estate platform, known for integrity, innovation, and customer satisfaction."
    },
    values: {
      title: "Our Core Values",
      subtitle: "The principles that guide everything we do",
      transparency: "Transparency",
      transparencyDesc: "Complete honesty in all transactions with no hidden charges",
      customer: "Customer First",
      customerDesc: "Your satisfaction is our top priority in every interaction",
      excellence: "Excellence",
      excellenceDesc: "Delivering the highest quality service consistently",
      integrity: "Integrity",
      integrityDesc: "Maintaining the highest ethical standards in all dealings"
    },
    features: {
      title: "Why Choose PlotChamp?",
      subtitle: "Experience the difference with our comprehensive services",
      feature1: "Verified Properties",
      feature1Desc: "Every property is thoroughly verified and authenticated by our expert team",
      feature2: "Legal Support",
      feature2Desc: "Complete legal documentation and title verification assistance",
      feature3: "Best Prices",
      feature3Desc: "Competitive market pricing with transparent cost breakdown",
      feature4: "Expert Guidance",
      feature4Desc: "Professional consultants to guide you through every step",
      feature5: "Quick Process",
      feature5Desc: "Fast and efficient property transactions with minimal paperwork",
      feature6: "After-Sales Support",
      feature6Desc: "Continued assistance even after the transaction is complete"
    },
    team: {
      title: "Meet Our Leadership",
      subtitle: "Experienced professionals dedicated to your success"
    },
    cta: {
      title: "Ready to Find Your Dream Property?",
      subtitle: "Let our experienced team help you make the right choice",
      call: "Call Us Now",
      message: "Get Started",
      explore: "Explore Properties"
    },
    achievements: {
      title: "Our Achievements",
      award1: "Best Real Estate Platform 2023",
      award2: "Customer Service Excellence Award",
      award3: "Most Trusted Brand in Real Estate",
      award4: "Innovation in Property Technology"
    }
  },
  mr: {
    title: "प्लॉटचॅम्प विषयी",
    subtitle: "उत्तम मालमत्ता शोधण्यात आपला विश्वासू सहकारी. 2009 पासून आम्ही लोकांना त्यांचे स्वप्नातले घर आणि गुंतवणुकीच्या संधी शोधण्यात मदत करत आहोत.",
    stats: {
      properties: "विकल्या गेलेल्या मालमत्ता",
      clients: "आनंदी ग्राहक",
      experience: "वर्षांचा अनुभव",
      cities: "शहरे झाकली"
    },
    story: {
      title: "आमची कहाणी",
      tagline: "स्वप्ने बांधणे, घरे तयार करणे",
      p1: "2009 मध्ये स्थापन झालेली प्लॉटचॅम्पची सुरुवात एका साध्या पण शक्तिशाली उद्देशाने झाली: रिअल इस्टेट सर्वांसाठी सुलभ, पारदर्शक आणि सोपे बनवणे.",
      p2: "आमचा विश्वास आहे की योग्य मालमत्ता शोधणे क्लिष्ट नसावे. आमच्या अनुभवी टीम आणि नाविन्यपूर्ण तंत्रज्ञानासह, आम्ही भारतात मालमत्ता खरेदी-विक्री करण्याच्या पद्धतीत परिवर्तन घडवून आणले आहे.",
      p3: "आज, आम्हाला अभिमान वाटतो की आम्ही हजारो कुटुंबांना त्यांचे परिपूर्ण घर शोधण्यात आणि असंख्य गुंतवणूकदारांना स्मार्ट रिअल इस्टेट निर्णय घेण्यास मदत केली आहे.",
      mission: "आमचे मिशन",
      missionText: "पारदर्शक, कार्यक्षम आणि ग्राहक-केंद्रित मालमत्ता उपाय प्रदान करून रिअल इस्टेट अनुभवात क्रांती घडवून आणणे जे प्रत्येक भारतीयाला त्यांचे स्वप्नातले घर शोधण्यास सक्षम करते.",
      vision: "आमची दृष्टी",
      visionText: "सचोटी, नाविन्य आणि ग्राहक समाधानासाठी ओळखले जाणारे भारतातील सर्वात विश्वासार्ह आणि पसंतीचे रिअल इस्टेट प्लॅटफॉर्म बनणे."
    },
    values: {
      title: "आमची मूल्ये",
      subtitle: "जी तत्त्वे आम्ही करत असलेल्या प्रत्येक गोष्टीचे मार्गदर्शन करतात",
      transparency: "पारदर्शकता",
      transparencyDesc: "कोणत्याही लपलेल्या शुल्काशिवाय सर्व व्यवहारांमध्ये संपूर्ण प्रामाणिकपणा",
      customer: "ग्राहक प्रथम",
      customerDesc: "प्रत्येक परस्परसंवादात तुमचे समाधान आमचे सर्वोच्च प्राधान्य आहे",
      excellence: "उत्कृष्टता",
      excellenceDesc: "सतत सर्वोच्च दर्जाची सेवा प्रदान करणे",
      integrity: "सचोटी",
      integrityDesc: "सर्व व्यवहारांमध्ये सर्वोच्च नैतिक मानके राखणे"
    },
    features: {
      title: "प्लॉटचॅम्प का निवडायचे?",
      subtitle: "आमच्या सर्वसमावेशक सेवांसह फरक अनुभवा",
      feature1: "सत्यापित मालमत्ता",
      feature1Desc: "प्रत्येक मालमत्ता आमच्या तज्ञ टीमद्वारे पूर्णपणे सत्यापित आणि प्रमाणित केली जाते",
      feature2: "कायदेशीर सहाय्य",
      feature2Desc: "संपूर्ण कायदेशीर दस्तऐवजीकरण आणि शीर्षक सत्यापन सहाय्य",
      feature3: "सर्वोत्तम किंमती",
      feature3Desc: "पारदर्शक खर्च विभाजनासह स्पर्धात्मक बाजार किंमत",
      feature4: "तज्ञ मार्गदर्शन",
      feature4Desc: "प्रत्येक पायरीवर तुम्हाला मार्गदर्शन करण्यासाठी व्यावसायिक सल्लागार",
      feature5: "द्रुत प्रक्रिया",
      feature5Desc: "कमीत कमी कागदोपत्री कामासह जलद आणि कार्यक्षम मालमत्ता व्यवहार",
      feature6: "विक्रीनंतर सहाय्य",
      feature6Desc: "व्यवहार पूर्ण झाल्यानंतरही सतत सहाय्य"
    },
    team: {
      title: "आमचे नेतृत्व भेटा",
      subtitle: "तुमच्या यशासाठी समर्पित अनुभवी व्यावसायिक"
    },
    cta: {
      title: "आपली स्वप्नातली मालमत्ता शोधण्यास सज्ज आहात?",
      subtitle: "योग्य निवड करण्यासाठी आमचा अनुभवी संघ तुम्हाला मदत करू द्या",
      call: "आत्ताच कॉल करा",
      message: "सुरुवात करा",
      explore: "मालमत्ता एक्सप्लोर करा"
    },
    achievements: {
      title: "आमची उपलब्धी",
      award1: "सर्वोत्तम रिअल इस्टेट प्लॅटफॉर्म 2023",
      award2: "ग्राहक सेवा उत्कृष्टता पुरस्कार",
      award3: "रिअल इस्टेटमधील सर्वात विश्वासार्ह ब्रँड",
      award4: "मालमत्ता तंत्रज्ञानातील नाविन्य"
    }
  }
};

const About = ({ currentLang }: AboutProps) => {
  const t = translations[currentLang];
  const navigate = useNavigate();

  const stats = [
    { label: t.stats.properties, value: "2,500+", icon: Award, color: "from-amber-500 to-orange-500" },
    { label: t.stats.clients, value: "1,800+", icon: Users, color: "from-green-500 to-emerald-500" },
    { label: t.stats.experience, value: "15+", icon: Target, color: "from-blue-500 to-indigo-500" },
    { label: t.stats.cities, value: "25+", icon: Building, color: "from-purple-500 to-pink-500" },
  ];

  const features = [
    {
      icon: CheckCircle2,
      title: t.features.feature1,
      desc: t.features.feature1Desc,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: t.features.feature2,
      desc: t.features.feature2Desc,
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: t.features.feature3,
      desc: t.features.feature3Desc,
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: t.features.feature4,
      desc: t.features.feature4Desc,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Target,
      title: t.features.feature5,
      desc: t.features.feature5Desc,
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Heart,
      title: t.features.feature6,
      desc: t.features.feature6Desc,
      color: "from-pink-500 to-pink-600"
    }
  ];

  const values = [
    {
      icon: Target,
      title: t.values.transparency,
      desc: t.values.transparencyDesc,
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Heart,
      title: t.values.customer,
      desc: t.values.customerDesc,
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Award,
      title: t.values.excellence,
      desc: t.values.excellenceDesc,
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: t.values.integrity,
      desc: t.values.integrityDesc,
      color: "from-orange-500 to-red-600"
    }
  ];

  const achievements = [
    { icon: Star, text: t.achievements.award1 },
    { icon: Award, text: t.achievements.award2 },
    { icon: Shield, text: t.achievements.award3 },
    { icon: TrendingUp, text: t.achievements.award4 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-sm font-bold tracking-wide">🏘️ SINCE 2009</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white shadow-2xl border-0 hover:shadow-3xl transition-all hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-semibold">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full">
                <span className="text-blue-700 font-semibold text-sm">{t.story.tagline}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {t.story.title}
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>{t.story.p1}</p>
                <p>{t.story.p2}</p>
                <p>{t.story.p3}</p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
                <CardContent className="p-8">
                  <Target className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{t.story.mission}</h3>
                  <p className="text-white/90 leading-relaxed">{t.story.missionText}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0 shadow-2xl">
                <CardContent className="p-8">
                  <Star className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{t.story.vision}</h3>
                  <p className="text-white/90 leading-relaxed">{t.story.visionText}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              {t.values.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.values.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all group">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all group">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              {t.achievements.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                    <p className="font-semibold text-white">{achievement.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-10 py-7 font-bold shadow-2xl"
              onClick={() => window.location.href = 'tel:+919876543210'}
            >
              <Phone className="w-6 h-6 mr-3" />
              {t.cta.call}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-10 py-7 font-bold"
              onClick={() => navigate('/contact')}
            >
              <Mail className="w-6 h-6 mr-3" />
              {t.cta.message}
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg px-10 py-7 font-bold shadow-2xl"
              onClick={() => navigate('/')}
            >
              {t.cta.explore}
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
