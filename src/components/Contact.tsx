import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle, Building2, Globe } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// const BASE = "http://localhost:5000";
const BASE = "https://real-estate-project-backend-2-2.onrender.com";
interface ContactProps {
  currentLang: 'en' | 'mr';
}

const translations = {
  en: {
    title: "Get In Touch With Us",
    subtitle: "Have a question or need assistance? We're here to help! Our dedicated team is ready to assist you with all your real estate needs.",
    getInTouch: "Send Us A Message",
    subtitle2: "Fill out the form below and we'll respond within 24 hours",
    sendMessage: "Send Message",
    sending: "Sending...",
    responseTime: "We typically respond within 24 hours",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    email: "Email Address",
    subject: "Subject",
    message: "Your Message",
    namePlaceholder: "Enter your full name",
    phonePlaceholder: "+91 98765 43210",
    emailPlaceholder: "your.email@example.com",
    subjectPlaceholder: "How can we help you?",
    messagePlaceholder: "Tell us about your requirements in detail...",
    callUs: "Call Us Anytime",
    available: "Available 24/7 for your convenience",
    emailUs: "Email Us",
    responseTime2: "Quick response within 24 hours",
    visitOffice: "Visit Our Office",
    officeAddress1: "123 Business District, Andheri West",
    officeAddress2: "Mumbai, Maharashtra 400001",
    officeHours: "Office Hours",
    weekDays: "Monday - Saturday",
    hours1: "9:00 AM - 7:00 PM",
    hours2: "Sunday: 10:00 AM - 5:00 PM",
    quickHelp: "Need Immediate Assistance?",
    quickHelpSub: "Our team is available 24/7 to answer your questions",
    sentMessage: "Message Sent Successfully!",
    successMessage: "Thank you for contacting us. Our team will reach out to you soon.",
    errorMessage: "Failed to send message. Please try again.",
    requiredFields: "All fields are required",
    whyChooseUs: "Why Choose PlotChamp?",
    feature1Title: "Verified Properties",
    feature1Desc: "All properties are verified and authenticated",
    feature2Title: "Expert Guidance",
    feature2Desc: "Professional real estate consultants",
    feature3Title: "Best Prices",
    feature3Desc: "Competitive pricing with no hidden charges",
    feature4Title: "Legal Support",
    feature4Desc: "Complete legal documentation assistance"
  },
  mr: {
    title: "आमच्याशी संपर्क साधा",
    subtitle: "प्रश्न आहे किंवा मदत हवी आहे? आम्ही मदतीसाठी येथे आहोत! आमचा समर्पित संघ तुमच्या सर्व रिअल इस्टेट गरजांसाठी मदत करण्यास तयार आहे.",
    getInTouch: "आम्हाला संदेश पाठवा",
    subtitle2: "खालील फॉर्म भरा आणि आम्ही 24 तासांत प्रतिसाद देऊ",
    sendMessage: "संदेश पाठवा",
    sending: "पाठवत आहे...",
    responseTime: "आम्ही सामान्यतः 24 तासांत प्रतिसाद देतो",
    fullName: "पूर्ण नाव",
    phoneNumber: "फोन नंबर",
    email: "ईमेल पत्ता",
    subject: "विषय",
    message: "तुमचा संदेश",
    namePlaceholder: "तुमचे पूर्ण नाव प्रविष्ट करा",
    phonePlaceholder: "+९१ ९८७६५ ४३२१०",
    emailPlaceholder: "तुमचा.ईमेल@उदाहरण.com",
    subjectPlaceholder: "आम्ही तुमची कशी मदत करू शकतो?",
    messagePlaceholder: "तुमच्या गरजांबद्दल तपशीलवार सांगा...",
    callUs: "कधीही कॉल करा",
    available: "तुमच्या सोयीसाठी 24/7 उपलब्ध",
    emailUs: "आम्हाला ईमेल करा",
    responseTime2: "24 तासांत त्वरित प्रतिसाद",
    visitOffice: "आमच्या कार्यालयाला भेट द्या",
    officeAddress1: "123 व्यवसाय जिल्हा, अंधेरी पश्चिम",
    officeAddress2: "मुंबई, महाराष्ट्र ४००००१",
    officeHours: "कार्यालयाचे वेळ",
    weekDays: "सोमवार - शनिवार",
    hours1: "सकाळी ९:०० - संध्याकाळी ७:००",
    hours2: "रविवार: सकाळी १०:०० - संध्याकाळी ५:००",
    quickHelp: "तात्काळ मदत हवी?",
    quickHelpSub: "तुमच्या प्रश्नांची उत्तरे देण्यासाठी आमचा संघ 24/7 उपलब्ध आहे",
    sentMessage: "संदेश यशस्वीरित्या पाठवला!",
    successMessage: "आमच्याशी संपर्क साधल्याबद्दल धन्यवाद. आमचा संघ लवकरच तुमच्याशी संपर्क साधेल.",
    errorMessage: "संदेश पाठवण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    requiredFields: "सर्व फील्ड आवश्यक आहेत",
    whyChooseUs: "प्लॉटचॅम्प का निवडायचे?",
    feature1Title: "सत्यापित मालमत्ता",
    feature1Desc: "सर्व मालमत्ता सत्यापित आणि प्रमाणित आहेत",
    feature2Title: "तज्ञ मार्गदर्शन",
    feature2Desc: "व्यावसायिक रिअल इस्टेट सल्लागार",
    feature3Title: "सर्वोत्तम किंमती",
    feature3Desc: "कोणतेही लपलेले शुल्क नसलेल्या स्पर्धात्मक किंमत",
    feature4Title: "कायदेशीर सहाय्य",
    feature4Desc: "संपूर्ण कायदेशीर दस्तऐवजीकरण सहाय्य"
  }
};

const Contact = ({ currentLang }: ContactProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const t = translations[currentLang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: t.requiredFields,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE}/api/contact/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: t.sentMessage,
          description: t.successMessage,
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || t.errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Hero Section with animated background */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-sm font-semibold">🏘️ PlotChamp Real Estate</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form - Takes 2 columns */}
            <Card className="lg:col-span-2 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                  <Send className="h-8 w-8" />
                  {t.getInTouch}
                </CardTitle>
                <p className="text-center text-white/90 mt-2">
                  {t.subtitle2}
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-red-500">*</span> {t.fullName}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        placeholder={t.namePlaceholder}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-red-500">*</span> {t.phoneNumber}
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                        placeholder={t.phonePlaceholder}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-red-500">*</span> {t.email}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      placeholder={t.emailPlaceholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-red-500">*</span> {t.subject}
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="h-12 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors"
                      placeholder={t.subjectPlaceholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-red-500">*</span> {t.message}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t.messagePlaceholder}
                      className="resize-none text-base min-h-[150px] border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        {t.sendMessage}
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    {t.responseTime}
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact Cards */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Phone className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{t.callUs}</h3>
                    <a href="tel:+919876543210" className="text-2xl font-bold block hover:underline">
                      +91 98765 43210
                    </a>
                    <p className="text-sm opacity-90 mt-2">{t.available}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-600 to-purple-700 text-white overflow-hidden hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">{t.emailUs}</h3>
                    <a href="mailto:info@plotchamp.com" className="text-lg font-semibold block hover:underline">
                      info@plotchamp.com
                    </a>
                    <p className="text-sm opacity-90 mt-2">{t.responseTime2}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white overflow-hidden hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{t.visitOffice}</h3>
                    <p className="text-sm opacity-95 leading-relaxed">
                      {t.officeAddress1}<br />
                      {t.officeAddress2}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-600 to-teal-700 text-white overflow-hidden hover:shadow-2xl transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">{t.officeHours}</h3>
                    <div className="space-y-1 text-sm opacity-95">
                      <p className="font-semibold">{t.weekDays}</p>
                      <p>{t.hours1}</p>
                      <p className="mt-2">{t.hours2}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.whyChooseUs}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.feature1Title}</h3>
                <p className="text-gray-600">{t.feature1Desc}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-purple-500 hover:shadow-xl transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.feature2Title}</h3>
                <p className="text-gray-600">{t.feature2Desc}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-green-500 hover:shadow-xl transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.feature3Title}</h3>
                <p className="text-gray-600">{t.feature3Desc}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-indigo-500 hover:shadow-xl transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.feature4Title}</h3>
                <p className="text-gray-600">{t.feature4Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Help CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t.quickHelp}
          </h2>
          <p className="text-xl mb-10 opacity-95 max-w-2xl mx-auto">
            {t.quickHelpSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-10 py-6 font-semibold shadow-2xl"
              onClick={() => window.location.href = 'tel:+919876543210'}
            >
              <Phone className="w-6 h-6 mr-3" />
              +91 98765 43210
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-10 py-6 font-semibold"
              onClick={() => window.location.href = 'mailto:info@plotchamp.com'}
            >
              <Mail className="w-6 h-6 mr-3" />
              info@plotchamp.com
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
