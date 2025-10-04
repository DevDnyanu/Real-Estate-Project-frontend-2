import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactProps {
  currentLang: 'en' | 'mr';
}

const translations = {
  en: {
    title: "Contact Us",
    subtitle: "Let's discuss your real estate needs. Our expert team is ready to assist you.",
    getInTouch: "Get In Touch",
    subtitle2: "Send us a message and we'll respond within 24 hours",
    sendMessage: "Send Message",
    responseTime: "We'll get back to you as soon as possible",
    fullName: "Full Name *",
    phoneNumber: "Phone Number *",
    email: "Email Address *",
    subject: "Subject *",
    message: "Message *",
    namePlaceholder: "Your full name",
    phonePlaceholder: "+91 98765 43210",
    emailPlaceholder: "your.email@example.com",
    subjectPlaceholder: "How can we help you?",
    messagePlaceholder: "Tell us about your requirements...",
    callUs: "Call Us Now",
    available: "Available 24/7",
    emailUs: "Email Us",
    responseTime2: "Response within 24hrs",
    visitOffice: "Visit Our Office",
    officeAddress1: "123 Business District",
    officeAddress2: "Mumbai, Maharashtra 400001",
    officeHours: "Office Hours",
    weekDays: "Monday - Saturday",
    hours1: "9:00 AM - 7:00 PM",
    hours2: "Sunday: 10:00 AM - 5:00 PM",
    quickHelp: "Need Quick Help?",
    quickHelpSub: "Call us now for instant support and consultation",
    sentMessage: "Message Sent!",
    successMessage: "Thank you for contacting us. We'll get back to you soon."
  },
  mr: {
    title: "आमच्याशी संपर्क साधा",
    subtitle: "चला तुमच्या रिअल इस्टेट गरजांवर चर्चा करू. आमची तज्ञ टीम तुमची मदत करण्यास तयार आहे.",
    getInTouch: "संपर्क साधा",
    subtitle2: "आम्हाला संदेश पाठवा आणि आम्ही 24 तासांत प्रतिसाद देऊ",
    sendMessage: "संदेश पाठवा",
    responseTime: "आम्ही लवकरात लवकर तुमच्याशी संपर्क साधू",
    fullName: "पूर्ण नाव *",
    phoneNumber: "फोन नंबर *",
    email: "ईमेल पत्ता *",
    subject: "विषय *",
    message: "संदेश *",
    namePlaceholder: "तुमचे पूर्ण नाव",
    phonePlaceholder: "+९१ ९८७६५ ४३२१०",
    emailPlaceholder: "तुमचा.ईमेल@उदाहरण.com",
    subjectPlaceholder: "आम्ही तुमची कशी मदत करू शकतो?",
    messagePlaceholder: "तुमच्या गरजांबद्दल आम्हाला सांगा...",
    callUs: "आता कॉल करा",
    available: "24/7 उपलब्ध",
    emailUs: "आम्हाला ईमेल करा",
    responseTime2: "24 तासांत प्रतिसाद",
    visitOffice: "आमच्या कार्यालयाला भेट द्या",
    officeAddress1: "123 व्यवसाय जिल्हा",
    officeAddress2: "मुंबई, महाराष्ट्र ४००००१",
    officeHours: "कार्यालयाचे वेळ",
    weekDays: "सोमवार - शनिवार",
    hours1: "सकाळी ९:०० - संध्याकाळी ७:००",
    hours2: "रविवार: सकाळी १०:०० - संध्याकाळी ५:००",
    quickHelp: "त्वरित मदत हवी?",
    quickHelpSub: "त्वरित सहाय्य आणि सल्ल्यासाठी आता कॉल करा",
    sentMessage: "संदेश पाठवला!",
    successMessage: "आमच्याशी संपर्क साधल्याबद्दल धन्यवाद. आम्ही लवकरच तुमच्याशी संपर्क साधू."
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

  const t = translations[currentLang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t.sentMessage,
      description: t.successMessage,
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">{t.title}</h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t.getInTouch}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.subtitle2}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <Card className="lg:col-span-3 shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-8">
                <CardTitle className="text-3xl font-bold text-gray-800 text-center">{t.sendMessage}</CardTitle>
                <p className="text-gray-600 text-center text-lg">
                  {t.responseTime}
                </p>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-base font-medium text-gray-700">{t.fullName}</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-12 text-base border-gray-300"
                        placeholder={t.namePlaceholder}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-base font-medium text-gray-700">{t.phoneNumber}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-12 text-base border-gray-300"
                        placeholder={t.phonePlaceholder}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium text-gray-700">{t.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 text-base border-gray-300"
                      placeholder={t.emailPlaceholder}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-base font-medium text-gray-700">{t.subject}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="h-12 text-base border-gray-300"
                      placeholder={t.subjectPlaceholder}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-base font-medium text-gray-700">{t.message}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t.messagePlaceholder}
                      className="resize-none text-base min-h-[120px] border-gray-300"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 font-semibold">
                    <Send className="w-5 h-5 mr-3" />
                    {t.sendMessage}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg border-0 bg-blue-600 text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">{t.callUs}</h3>
                      <p className="text-xl font-semibold">+91 98765 43210</p>
                      <p className="text-sm opacity-80 mt-1">{t.available}</p>
                    </div>
                    
                    <div className="border-t border-white/20 pt-8 text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">{t.emailUs}</h3>
                      <p className="text-lg font-medium">info@plotchamp.com</p>
                      <p className="text-sm opacity-80 mt-1">{t.responseTime2}</p>
                    </div>
                    
                    <div className="border-t border-white/20 pt-8 text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">{t.visitOffice}</h3>
                      <p className="text-sm opacity-90">{t.officeAddress1}</p>
                      <p className="text-sm opacity-90">{t.officeAddress2}</p>
                    </div>
                    
                    <div className="border-t border-white/20 pt-8 text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">{t.officeHours}</h3>
                      <p className="text-sm opacity-90">{t.weekDays}</p>
                      <p className="text-sm opacity-90">{t.hours1}</p>
                      <p className="text-sm opacity-90 mt-2">{t.hours2}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.quickHelp}
          </h2>
          <p className="text-xl mb-10 opacity-95">
            {t.quickHelpSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="secondary" size="lg" className="flex items-center text-lg px-10 py-4 font-semibold bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="w-6 h-6 mr-3" />
              +91 1234567890
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-10 py-4 font-semibold">
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