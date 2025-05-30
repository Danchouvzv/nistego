import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Button from '../shared/ui/Button';
import { useMediaQuery } from 'react-responsive';
// Комментируем импорт шрифта, чтобы избежать ошибки
// import '@fontsource/playfair-display';

const MAX_TRAIL_POINTS = 20;

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trailPoints, setTrailPoints] = useState<{x: number, y: number}[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [cursorText, setCursorText] = useState<string>("");
  const [cursorMode, setCursorMode] = useState<"default" | "hover" | "click" | "text" | "link" | "button">("default");
  
  // Cursor motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSize = useMotionValue(20);
  const cursorOpacity = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorSizeSpring = useSpring(cursorSize, { damping: 15, stiffness: 150 });
  const cursorOpacitySpring = useSpring(cursorOpacity, { damping: 25, stiffness: 300 });

  // Parallax scrolling effect
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // Mouse movement effect
  useEffect(() => {
    // Задержка появления курсора для плавного входа
    setTimeout(() => {
      cursorOpacity.set(1);
    }, 500);
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      cursorX.set(clientX);
      cursorY.set(clientY);
      
      // Update trail points
      setTrailPoints(prev => {
        const newPoints = [...prev, { x: clientX, y: clientY }];
        return newPoints.slice(-MAX_TRAIL_POINTS);
      });
      
      // Определяем, над каким элементом находится курсор
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        setCursorMode("link");
        setCursorText("View");
      } else if (target.tagName === 'BUTTON' || target.closest('button')) {
        setCursorMode("button");
        setCursorText("Click");
      } else {
        setCursorText("");
        setCursorMode(isHovering ? "hover" : "default");
      }
    };
    
    const handleMouseDown = () => {
      setIsClicking(true);
      setCursorMode("click");
      cursorSize.set(16);
      setTimeout(() => {
        setIsClicking(false);
        setCursorMode(isHovering ? "hover" : "default");
      }, 300);
    };
    
    const handleMouseUp = () => {
      cursorSize.set(20);
    };
    
    const handleMouseLeave = () => {
      cursorOpacity.set(0);
    };
    
    const handleMouseEnter = () => {
      cursorOpacity.set(1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, cursorSize, cursorOpacity, isHovering]);

  // Intersection observer for section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const heroImageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  // Новые варианты для курсора
  const cursorVariants: Variants = {
    default: {
      height: 36,
      width: 36,
      borderRadius: "50%",
      backgroundColor: "rgba(0, 200, 151, 0.2)",
      border: "2px solid rgba(0, 200, 151, 0.8)",
      mixBlendMode: "difference" as const,
      boxShadow: "0 0 15px 3px rgba(0, 200, 151, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)",
      x: 0,
      y: 0,
      scale: 1
    },
    hover: {
      height: 60,
      width: 60,
      borderRadius: "50%",
      backgroundColor: "rgba(0, 200, 151, 0.3)",
      border: "2px solid rgba(0, 200, 151, 0.9)",
      mixBlendMode: "difference" as const,
      boxShadow: "0 0 20px 5px rgba(0, 200, 151, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.4)",
      x: 0,
      y: 0,
      scale: 1
    },
    click: {
      height: 30,
      width: 30,
      borderRadius: "50%",
      backgroundColor: "rgba(0, 86, 199, 0.4)",
      border: "2px solid rgba(0, 86, 199, 0.9)",
      mixBlendMode: "difference" as const,
      boxShadow: "0 0 25px 6px rgba(0, 86, 199, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.6)",
      x: 0,
      y: 0,
      scale: 0.9
    },
    link: {
      height: 80,
      width: 80,
      borderRadius: "50%",
      backgroundColor: "rgba(255, 86, 120, 0.2)",
      border: "2px solid rgba(255, 86, 120, 0.8)",
      mixBlendMode: "difference" as const,
      boxShadow: "0 0 20px 5px rgba(255, 86, 120, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.4)",
      x: 0,
      y: 0,
      scale: 1
    },
    button: {
      height: 70,
      width: 70,
      borderRadius: "50%",
      backgroundColor: "rgba(255, 180, 0, 0.2)",
      border: "2px solid rgba(255, 180, 0, 0.8)",
      mixBlendMode: "difference" as const,
      boxShadow: "0 0 20px 5px rgba(255, 180, 0, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.4)",
      x: 0,
      y: 0,
      scale: 1
    }
  };

  const morphingPathVariants: Variants = {
    initial: { 
      opacity: 0.7,
      d: "M0,0 L100,0 L100,100 L0,100 Z"
    },
    animate: { 
      opacity: 0.7,
      d: [
        "M0,0 L100,0 L100,100 L0,100 Z",
        "M0,0 L100,0 L90,100 L10,100 Z",
        "M0,0 L100,0 L85,100 L15,100 Z",
        "M0,0 L100,0 L80,100 L20,100 Z",
        "M0,0 L100,0 L85,100 L15,100 Z",
        "M0,0 L100,0 L90,100 L10,100 Z",
        "M0,0 L100,0 L100,100 L0,100 Z",
      ],
      transition: {
        duration: 20,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  const floatingShapesVariants = {
    shape1: {
      y: [0, -30, 0],
      x: [0, 20, 0],
      rotate: [0, 10, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    shape2: {
      y: [0, 40, 0],
      x: [0, -30, 0],
      rotate: [0, -15, 0],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    shape3: {
      y: [0, -25, 0],
      x: [0, -20, 0],
      rotate: [45, 60, 45],
      transition: {
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    shape4: {
      scale: [1, 1.2, 1],
      y: [0, 15, 0],
      transition: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const steps = [
    { number: '1', key: 'step1', icon: '🎯' },
    { number: '2', key: 'step2', icon: '📝' },
    { number: '3', key: 'step3', icon: '📊' },
    { number: '4', key: 'step4', icon: '🏆' }
  ];

  const faqs = [
    { 
      key: 'q1', 
      question: 'landing.faq.q1',
      answer: 'landing.faq.a1',
      icon: '🚀'
    },
    { 
      key: 'q2', 
      question: 'landing.faq.q2',
      answer: 'landing.faq.a2',
      icon: '📝'
    },
    { 
      key: 'q3', 
      question: 'landing.faq.q3',
      answer: 'landing.faq.a3',
      icon: '🎯'
    },
    { 
      key: 'q4', 
      question: 'landing.faq.q4',
      answer: 'landing.faq.a4',
      icon: '🤖'
    },
    { 
      key: 'q5', 
      question: 'landing.faq.q5',
      answer: 'landing.faq.a5',
      icon: '📊'
    },
    { 
      key: 'q6', 
      question: 'landing.faq.q6',
      answer: 'landing.faq.a6',
      icon: '🔥'
    },
    { 
      key: 'q7', 
      question: 'landing.faq.q7',
      answer: 'landing.faq.a7',
      icon: '👨‍🏫'
    },
    { 
      key: 'q8', 
      question: 'landing.faq.q8',
      answer: 'landing.faq.a8',
      icon: '📈'
    },
    { 
      key: 'q9', 
      question: 'landing.faq.q9',
      answer: 'landing.faq.a9',
      icon: '❓'
    },
    { 
      key: 'q10', 
      question: 'landing.faq.q10',
      answer: 'landing.faq.a10',
      icon: '🌐'
    },
    { 
      key: 'q11', 
      question: 'landing.faq.q11',
      answer: 'landing.faq.a11',
      icon: '📱'
    },
    { 
      key: 'q12', 
      question: 'landing.faq.q12',
      answer: 'landing.faq.a12',
      icon: '🏆'
    },
    { 
      key: 'q13', 
      question: 'landing.faq.q13',
      answer: 'landing.faq.a13',
      icon: '🔒'
    },
    { 
      key: 'q14', 
      question: 'landing.faq.q14',
      answer: 'landing.faq.a14',
      icon: '🏫'
    },
    { 
      key: 'q15', 
      question: 'landing.faq.q15',
      answer: 'landing.faq.a15',
      icon: '🎓'
    }
  ];

  const handleMouseEnter = () => {
    setIsHovering(true);
    cursorSize.set(45);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    cursorSize.set(20);
  };

  // Упрощенный компонент FaqItem без лишних анимаций при наведении
  const FaqItem = ({ faq, index }: { faq: typeof faqs[0], index: number }) => {
    const isOpen = openFaqId === faq.key;
    
    const toggleAccordion = () => {
      setOpenFaqId(isOpen ? null : faq.key);
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
      >
        <button
          onClick={toggleAccordion}
          className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none group"
          // Убраны обработчики событий наведения мыши для устранения лагов
        >
          <div className="flex items-center">
            <span className="text-2xl mr-4">{faq.icon}</span>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors duration-200 font-playfair">
              {t(faq.question)}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 pt-0 text-gray-600 dark:text-gray-300">
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-1">
                  {t(faq.answer)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="overflow-hidden cursor-none">
      {/* Креативный курсор с новыми эффектами */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
        {/* Основной круг курсора */}
        <motion.div
          className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-difference"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            opacity: cursorOpacitySpring,
            transform: 'translate(-50%, -50%)',
          }}
          variants={cursorVariants}
          animate={cursorMode}
          transition={{ 
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1] // Плавная анимация с небольшим отскоком
          }}
        >
          {/* Текст внутри курсора */}
          {cursorText && (
            <motion.span 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
        
        {/* Внутренний круг курсора */}
        <motion.div
          className="fixed top-0 left-0 rounded-full pointer-events-none bg-white"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            opacity: cursorOpacitySpring,
            width: 8,
            height: 8,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: isClicking ? 0.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Эффект частиц вокруг курсора */}
        {isClicking && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
              translateX: "-50%",
              translateY: "-50%"
            }}
          >
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distance = Math.random() * 30 + 20;
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-primary"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    x: Math.cos(angle) * 5,
                    y: Math.sin(angle) * 5,
                  }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [1, 0],
                    scale: [1, 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 0.8 + 0.5,
                    ease: "easeOut"
                  }}
                />
              );
            })}
          </motion.div>
        )}
        
        {/* Эффект магнитного притяжения к кнопкам */}
        {cursorMode === "button" && (
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none border-2 border-yellow-400"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              width: 90,
              height: 90,
              opacity: 0.2,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Эффект для ссылок */}
        {cursorMode === "link" && (
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none border-2 border-pink-500"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              width: 100,
              height: 100,
              opacity: 0.2,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
        
        {/* Эффект клика */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              className="fixed rounded-full border-2 border-secondary pointer-events-none"
              style={{
                x: mousePosition.x,
                y: mousePosition.y,
                translateX: "-50%",
                translateY: "-50%"
              }}
              initial={{ width: 20, height: 20, opacity: 1 }}
              animate={{ width: 100, height: 100, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <section 
        id="hero" 
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-br from-primary to-secondary overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Morphing Background SVG */}
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 200, 151, 0.8)">
                  <animate attributeName="stop-color" 
                    values="rgba(0, 200, 151, 0.8); rgba(0, 86, 199, 0.8); rgba(255, 86, 120, 0.8); rgba(0, 200, 151, 0.8)" 
                    dur="20s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="rgba(0, 86, 199, 0.8)">
                  <animate attributeName="stop-color" 
                    values="rgba(0, 86, 199, 0.8); rgba(255, 86, 120, 0.8); rgba(0, 200, 151, 0.8); rgba(0, 86, 199, 0.8)" 
                    dur="20s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <motion.path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="url(#heroGradient)"
              initial="initial"
              variants={morphingPathVariants}
              animate="animate"
            />
          </svg>
          
          {/* Floating Elements */}
          <div className="absolute inset-0">
            {/* Shape 1 - Floating circle with gradient */}
            <motion.div 
              className="absolute top-1/4 left-1/5 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-lg"
              variants={floatingShapesVariants}
              animate="shape1"
              style={{ filter: "url(#glow)" }}
            />
            
            {/* Shape 2 - Floating rounded rectangle */}
            <motion.div 
              className="absolute bottom-1/4 right-1/5 w-32 h-32 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-r from-blue-500/20 to-teal-500/20 backdrop-blur-lg rotate-12"
              variants={floatingShapesVariants}
              animate="shape2"
              style={{ filter: "url(#glow)" }}
            />
            
            {/* Shape 3 - Floating diamond */}
            <motion.div 
              className="absolute top-1/2 right-1/3 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-500/20 to-green-500/20 backdrop-blur-lg rotate-45"
              variants={floatingShapesVariants}
              animate="shape3"
              style={{ filter: "url(#glow)" }}
            />
            
            {/* Shape 4 - Small floating circle */}
            <motion.div 
              className="absolute top-1/3 right-1/4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-lg"
              variants={floatingShapesVariants}
              animate="shape4"
              style={{ filter: "url(#glow)" }}
            />
          </div>
          
          {/* Particle Grid (Optional) */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-30">
            {[...Array(144)].map((_, i) => (
              <motion.div 
                key={i} 
                className="w-1 h-1 bg-white rounded-full" 
                style={{ 
                  left: `${(i % 12) * 8.33}%`, 
                  top: `${Math.floor(i / 12) * 8.33}%` 
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10 flex flex-col justify-center items-center min-h-screen">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 text-white leading-tight tracking-tight"
            >
              <span className="inline-block relative overflow-hidden">
                <motion.span 
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  {t('landing.tagline')}
                </motion.span>
                <motion.span 
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-white/0 via-white/80 to-white/0"
                  animate={{ 
                    left: ["-100%", "100%"],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 3
                  }}
                />
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-2xl mx-auto font-light"
            >
              {t('landing.subtitle')}
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/auth/register">
                  <Button 
                    variant="light" 
                    size="lg"
                    className="shadow-[0_0_30px_rgba(0,200,151,0.5)] w-full sm:w-auto px-8 py-4 text-primary font-medium rounded-xl hover:shadow-[0_0_50px_rgba(0,200,151,0.8)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <motion.span
                      animate={{
                        backgroundPosition: ["0% center", "100% center", "0% center"],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent bg-size-200"
                    >
                      {t('landing.getStarted')}
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="#demo">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white/70 text-white backdrop-blur-sm hover:bg-white/10 w-full sm:w-auto px-8 py-4 font-medium rounded-xl transition-all duration-300 mt-4 sm:mt-0"
                  >
                    <motion.span
                      initial={{ opacity: 0.8 }}
                      animate={{
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {t('landing.watchDemo')}
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Animated down arrow */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-white/70" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </motion.div>
          
          {/* 3D Device Mockup */}
          <motion.div
            className="absolute -bottom-[20%] left-1/2 transform -translate-x-1/2 w-[80vw] max-w-4xl hidden md:block"
            variants={heroImageVariants}
            initial="hidden"
            animate="visible"
            style={{ 
              perspective: "1000px",
              perspectiveOrigin: "center", 
              y
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="relative w-full h-full"
              animate={{
                rotateX: [5, 0, 5],
                rotateY: [-5, 5, -5],
                rotateZ: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.img 
                src="/images/mockup-dashboard.png" 
                alt="NIStego Dashboard" 
                className="w-full h-auto rounded-xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] border border-white/20"
                style={{ filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.15))" }}
              />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scrolling Indicator */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center pointer-events-none">
          <div className="flex space-x-1">
            <motion.div 
              className="w-8 h-1 rounded-full bg-white/30" 
              animate={{ opacity: activeSection === 'hero' ? 1 : 0.3 }}
            />
            <motion.div 
              className="w-8 h-1 rounded-full bg-white/30" 
              animate={{ opacity: activeSection === 'benefits' ? 1 : 0.3 }}
            />
            <motion.div 
              className="w-8 h-1 rounded-full bg-white/30" 
              animate={{ opacity: activeSection === 'steps' ? 1 : 0.3 }}
            />
            <motion.div 
              className="w-8 h-1 rounded-full bg-white/30" 
              animate={{ opacity: activeSection === 'faq' ? 1 : 0.3 }}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-900 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
            >
              {t('landing.benefits.title')}
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {/* Time Benefit */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-primary/10 dark:bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                {t('landing.benefits.time.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('landing.benefits.time.description')}
              </p>
            </motion.div>
            
            {/* Grades Benefit */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-secondary/10 dark:bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center text-secondary mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                {t('landing.benefits.grades.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('landing.benefits.grades.description')}
              </p>
            </motion.div>
            
            {/* Gamification Benefit */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-warning/10 dark:bg-warning/20 w-16 h-16 rounded-full flex items-center justify-center text-warning mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">
                {t('landing.benefits.gamification.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {t('landing.benefits.gamification.description')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 gradient-text"
            >
              {t('landing.steps.title')}
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.key}
                variants={fadeInUp}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md text-center relative"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-2">
                  {t(`landing.steps.${step.key}`)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {index === 0 && t('goals.smartify')}
                  {index === 1 && t('planner.title')}
                  {index === 2 && t('dashboard.subjects.progress')}
                  {index === 3 && t('profile.badges')}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24" id="faq">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 gradient-text font-playfair"
            >
              {t('landing.faq.title')}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            >
              {t('landing.faq.subtitle')}
            </motion.p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
              {faqs.map((faq, index) => (
                <FaqItem key={faq.key} faq={faq} index={index} />
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
          >
            <Link to="/auth/register">
              <Button 
                variant="primary" 
                size="lg"
                className="shadow-lg shadow-primary/20 font-playfair"
              >
                {t('landing.getStarted')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-primary to-secondary w-10 h-10 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white text-lg font-bold">N</span>
                </div>
                <h2 className="text-xl font-bold font-playfair">NIStego</h2>
              </div>
              <p className="text-gray-400 mb-6">{t('landing.tagline')}</p>
              <p className="text-gray-400 mb-6">{t('landing.hero.subtitle')}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 font-playfair">{t('footer.links')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.about')}</a></li>
                <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">{t('landing.faq.title')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.community')}</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 font-playfair">{t('footer.contact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:hello@nistego.com" className="text-gray-300 hover:text-white transition-colors">hello@nistego.com</a>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Discord</a>
                </li>
              </ul>
            </div>
            
            <div className="md:text-right">
              <Link to="/auth/register">
                <Button 
                  variant="outline"
                  className="mb-6 w-full md:w-auto"
                >
                  {t('landing.getStarted')}
                </Button>
              </Link>
              <p className="text-gray-400 text-sm">
                &copy; 2025 NIStego. {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 