import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import ImageOptimized from "@/components/ImageOptimized";
const logo = "/images/logo.png";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
    { code: "ku", name: "Kurdish", flag: "🇮🇶", nativeName: "کوردی" },
    { code: "ar", name: "العربية", flag: "🇸🇾", nativeName: "العربية" },
  ];

  const handleLanguageSelect = (langCode: string) => {
    localStorage.setItem('selectedLanguage', langCode);
    navigate(`/categories/${langCode}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center bg-background"
    >
      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand */}
        <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
          <ImageOptimized
            src={logo}
            alt="German Doner Logo"
            className="mx-auto mb-6 w-24 sm:w-32 md:w-40 lg:w-48 h-auto max-w-full object-contain"
            priority={true}
            width={400}
            sizes="(min-width:1024px) 480px, 40vw"
            srcSet={`${logo} 400w, ${logo} 800w`}
          />
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-2 sm:mb-4 drop-shadow-lg font-display tracking-wide"
            variants={itemVariants}
          >
            Welcome to
          </motion.h1>
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[hsl(39_92%_53%)] mb-4 drop-shadow-lg font-display tracking-wide"
            variants={itemVariants}
          >
            German Doner
          </motion.h2>
        </motion.div>

        {/* Language Selection */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card backdrop-blur-sm shadow-elegant border border-border">
            <CardContent className="p-4 sm:p-8">
              <motion.div 
                className="flex items-center justify-center gap-2 mb-6"
                variants={itemVariants}
              >
                <Languages className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">
                  Choose Your Language
                </h2>
              </motion.div>
              
              <div className="grid gap-3 sm:gap-4">
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.code}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full text-base sm:text-lg py-4 sm:py-6 ${lang.code === 'ar' ? 'font-arabic' : ''}`}
                    >
                      <span className="font-semibold">{lang.nativeName}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Berlin Doner Info */}
        <motion.div 
          className="grid md:grid-cols-2 gap-4 mt-8"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-card backdrop-blur-sm border border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <p className="text-[hsl(39_92%_53%)]">Queen Towers, Erbil</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-card backdrop-blur-sm border border-border hover:border-primary transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🕐</div>
                <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                <p className="text-[hsl(39_92%_53%)]">Daily: 11:00 - 22:00</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
