import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>('standard');
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  const monthlyPrice = 599;
  const yearlyPrice = Math.floor(monthlyPrice * 10); // 10 months for the price of 12

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const toggleVariants = {
    yearly: { x: 28 },
    monthly: { x: 0 },
  };

  const features = [
    'Автоматическое распознавание оценок',
    'Интеллектуальный планировщик',
    'Персонализированные учебные цели',
    'Визуализация прогресса',
    'Мини-уроки и практические задания',
    'Отслеживание ошибок и рекомендации',
    'Темная и светлая темы',
    'Многоязычный интерфейс',
  ];

  const premiumFeatures = [
    ...features,
    'Приоритетная поддержка',
    'Расширенная аналитика',
    'Персональные рекомендации AI',
    'Экспорт данных в PDF',
  ];

  const handleSubscribe = () => {
    // Here would be the payment processing logic
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 py-16 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Инвестируй в свое <span className="text-blue-600 dark:text-blue-400">образование</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Разблокируй весь потенциал NIStego и преврати учебу в увлекательное путешествие
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div variants={itemVariants} className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 flex items-center shadow-md">
            <span
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                !isYearly
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Ежемесячно
            </span>
            <div className="px-2 relative">
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full">
                <motion.div
                  className="w-6 h-6 bg-blue-600 rounded-full absolute top-0"
                  variants={toggleVariants}
                  animate={isYearly ? 'yearly' : 'monthly'}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                isYearly
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setIsYearly(true)}
            >
              Ежегодно <span className="text-xs font-bold text-green-500">-17%</span>
            </span>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Standard Plan */}
          <motion.div
            variants={itemVariants}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ${
              selectedPlan === 'standard' ? 'scale-105 border-2 border-blue-500' : ''
            }`}
            onClick={() => setSelectedPlan('standard')}
          >
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Стандарт</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Все необходимое для учебы</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Популярный</span>
                </div>
              </div>
              
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {isYearly ? yearlyPrice : monthlyPrice}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  ₸/{isYearly ? 'год' : 'месяц'}
                </span>
              </div>
              
              <ul className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`mt-8 w-full py-3 px-6 rounded-xl font-medium text-white transition-colors ${
                  selectedPlan === 'standard'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
                onClick={handleSubscribe}
              >
                Выбрать план
              </motion.button>
            </div>
          </motion.div>
          
          {/* Premium Plan */}
          <motion.div
            variants={itemVariants}
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ${
              selectedPlan === 'premium' ? 'scale-105 border-2 border-purple-500' : ''
            }`}
            onClick={() => setSelectedPlan('premium')}
          >
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Премиум</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Максимальные возможности</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900 rounded-full px-3 py-1">
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Скоро</span>
                </div>
              </div>
              
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {isYearly ? yearlyPrice * 1.5 : monthlyPrice * 1.5}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  ₸/{isYearly ? 'год' : 'месяц'}
                </span>
              </div>
              
              <ul className="mt-8 space-y-4">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className={`mt-8 w-full py-3 px-6 rounded-xl font-medium text-white transition-colors ${
                  selectedPlan === 'premium'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
                onClick={handleSubscribe}
                disabled={true}
              >
                Скоро
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Testimonials */}
        <motion.div variants={itemVariants} className="mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Что говорят наши пользователи
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Алия К.',
                role: 'Ученица 10 класса',
                content: 'NIStego помог мне улучшить мои оценки по математике и физике. Теперь я всегда знаю, над чем работать!',
                image: 'https://randomuser.me/api/portraits/women/32.jpg'
              },
              {
                name: 'Тимур М.',
                role: 'Ученик 11 класса',
                content: 'Благодаря умному планировщику я стал гораздо продуктивнее. Рекомендую всем, кто хочет улучшить свои результаты!',
                image: 'https://randomuser.me/api/portraits/men/22.jpg'
              },
              {
                name: 'Карина Н.',
                role: 'Ученица 9 класса',
                content: 'Визуализация прогресса очень мотивирует. Я вижу свой рост и это вдохновляет меня двигаться дальше!',
                image: 'https://randomuser.me/api/portraits/women/44.jpg'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* FAQ */}
        <motion.div variants={itemVariants} className="mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Часто задаваемые вопросы
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'Могу ли я отменить подписку в любое время?',
                answer: 'Да, вы можете отменить подписку в любой момент. После отмены вы сможете пользоваться сервисом до конца оплаченного периода.'
              },
              {
                question: 'Какие способы оплаты вы принимаете?',
                answer: 'Мы принимаем все основные банковские карты, а также Apple Pay, Google Pay и Kaspi QR.'
              },
              {
                question: 'Есть ли пробный период?',
                answer: 'Да, у нас есть 14-дневный пробный период, в течение которого вы можете бесплатно пользоваться всеми функциями приложения.'
              },
              {
                question: 'Как работает годовая подписка?',
                answer: 'При выборе годовой подписки вы получаете скидку 17% по сравнению с ежемесячной оплатой. Платеж взимается один раз в год.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                    <span className="text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-24 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы начать свое образовательное путешествие?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам студентов, которые уже улучшили свои результаты с NIStego
          </p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setIsHoveringButton(true)}
            onHoverEnd={() => setIsHoveringButton(false)}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-2xl transition-all duration-300"
            onClick={handleSubscribe}
          >
            Начать бесплатный пробный период
            <motion.span
              className="inline-block ml-2"
              animate={{ x: isHoveringButton ? 5 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              →
            </motion.span>
          </motion.button>
          <p className="text-blue-100 mt-4">
            Без обязательств. Отмена в любое время.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Subscription; 