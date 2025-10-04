import { Target, Award, TrendingUp, Phone, Mail, Building, Info } from 'lucide-react';

interface AboutProps {
  currentLang: 'en' | 'mr';
}

const translations = {
  en: {
    title: "About PlotChamp",
    subtitle: "Your trusted partner in finding the perfect property. We've been helping people find their dream homes and investment opportunities for over 15 years.",
    stats: {
      properties: "Properties Sold",
      clients: "Happy Clients", 
      experience: "Years Experience",
      cities: "Cities Covered"
    },
    story: {
      title: "Our Story",
      p1: "Founded in 2009, PlotChamp started with a simple mission: to make real estate accessible and transparent for everyone.",
      p2: "We believe that finding the right property shouldn't be complicated.",
      p3: "Today, we're proud to have helped thousands of families find their perfect homes.",
      mission: "Our Mission",
      missionText: "To revolutionize the real estate experience by providing transparent, efficient property solutions."
    },
    values: {
      title: "Our Values",
      transparency: "Transparency",
      customer: "Customer First", 
      excellence: "Excellence"
    },
    cta: {
      title: "Ready to Find Your Dream Property?",
      subtitle: "Let our experienced team help you",
      call: "Call Us Now",
      message: "Send Message"
    }
  },
  mr: {
    title: "प्लॉटचॅम्प विषयी",
    subtitle: "उत्तम जागा शोधण्यात आपला विश्वासू सहकारी. आम्ही 15 वर्षांपेक्षा जास्त काळ लोकांना मदत करत आहोत.",
    stats: {
      properties: "विकल्या गेलेल्या जागा",
      clients: "आनंदी ग्राहक",
      experience: "वर्षांचा अनुभव", 
      cities: "शहरे झाकली"
    },
    story: {
      title: "आमची कहाणी",
      p1: "2009 मध्ये स्थापन झालेली प्लॉटचॅम्पची सुरुवात एका साध्या उद्देशाने झाली.",
      p2: "आमचा विश्वास आहे की योग्य जागा शोधणे क्लिष्ट नसावे.",
      p3: "आज, आम्हाला अभिमान वाटतो की आम्ही हजारो कुटुंबांना मदत केली आहे.",
      mission: "आमचे मिशन",
      missionText: "पारदर्शक, कार्यक्षम प्रॉपर्टी उपाय प्रदान करून रिअल इस्टेट अनुभवात क्रांती घडवून आणणे."
    },
    values: {
      title: "आमची मूल्ये",
      transparency: "पारदर्शकता",
      customer: "ग्राहक प्रथम",
      excellence: "उत्कृष्टता"
    },
    cta: {
      title: "आपली स्वप्नातली जागा शोधण्यास सज्ज आहात?",
      subtitle: "आमचा अनुभवी संघ आपल्याला मदत करू द्या",
      call: "आत्ताच कॉल करा",
      message: "संदेश पाठवा"
    }
  }
};

const About = ({ currentLang }: AboutProps) => {
  const t = translations[currentLang];

  const stats = [
    { label: t.stats.properties, value: "2,500+", icon: Award },
    { label: t.stats.clients, value: "1,800+", icon: TrendingUp },
    { label: t.stats.experience, value: "15+", icon: Target },
    { label: t.stats.cities, value: "25+", icon: Building },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.title}</h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {t.story.title}
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>{t.story.p1}</p>
                <p>{t.story.p2}</p>
                <p>{t.story.p3}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">{t.story.mission}</h3>
              <p>{t.story.missionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t.values.title}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.values.transparency}</h3>
            </div>
            
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.values.customer}</h3>
            </div>
            
            <div className="text-center bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t.values.excellence}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl mb-8 opacity-95">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-700 font-medium py-3 px-8 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              {t.cta.call}
            </button>
            <button className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 mr-2" />
              {t.cta.message}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;