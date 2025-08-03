import React, { useState } from 'react';
import { Mail, MessageCircle, Instagram, Phone, Eye, EyeOff, ArrowRight, Zap, Users, Globe } from 'lucide-react';
import './style.css'
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const messagingPlatforms = [
    { 
      name: 'WhatsApp', 
      icon: 'https://cdn-icons-png.flaticon.com/128/3536/3536445.png', 
      color: 'text-green-500', 
      bgColor: 'bg-green-500/10',
      hoverBg: 'hover:bg-green-500/20',
      description: 'Business messaging'
    },
    { 
      name: 'Gmail', 
      icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968534.png', 
      color: 'text-red-500', 
      bgColor: 'bg-red-500/10',
      hoverBg: 'hover:bg-red-500/20',
      description: 'Email management'
    },
    { 
      name: 'Instagram', 
      icon: 'https://cdn-icons-png.flaticon.com/128/15713/15713420.png', 
      color: 'text-pink-500', 
      bgColor: 'bg-pink-500/10',
      hoverBg: 'hover:bg-pink-500/20',
      description: 'Social engagement'
    },
    { 
      name: 'Viber', 
      icon: 'https://cdn-icons-png.flaticon.com/128/2504/2504948.png', 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-500/10',
      hoverBg: 'hover:bg-purple-500/20',
      description: 'Voice & messaging'
    }
  ];

  const features = [
    { icon: 'https://cdn-icons-png.flaticon.com/128/252/252590.png', text: 'Lightning Fast' },
    { icon: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png', text: 'Team Collaboration' },
    { icon: 'https://cdn-icons-png.flaticon.com/128/2489/2489606.png', text: 'Global Reach' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Curved Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Enhanced Branding with Curved Design */}
        <div className="hidden lg:flex lg:flex-1 relative">
          {/* Curved SVG Background */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <path d="M0,0 L70,0 Q85,50 70,100 L0,100 Z" fill="url(#curveGradient)" />
            </svg>
          </div>

          {/* Decorative Curved Lines */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-20" preserveAspectRatio="none">
              <path d="M75,0 Q90,50 75,100" stroke="white" strokeWidth="0.5" fill="none" />
              <path d="M80,0 Q95,50 80,100" stroke="white" strokeWidth="0.3" fill="none" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white max-w-lg">
            {/* Logo and Branding */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                  <img className="w-12 h-12" src="https://image.crisp.chat/avatar/website/7cc44f6d-29de-4a1a-9ac6-2211adbba7e9/120/?1751957050179&quot"/>
                </div>
                <div>
                  <h1 className="text-4xl font-bold">KrispCall</h1>
                  <p className="text-lg font-light opacity-90">Omni Channel</p>
                </div>
              </div>
              <p className="text-xl mb-4 leading-relaxed">
                Unify all your customer communications in one powerful platform
              </p>
              <p className="text-sm opacity-80 leading-relaxed">
                Connect WhatsApp, Email, Social Media, and voice calls seamlessly. 
                Boost your team's productivity with intelligent message routing and automation.
              </p>
            </div>
            
            {/* Platform Grid with Enhanced Design */}
            <div className="grid grid-cols-2 gap-4 mb-8 w-full">
              {messagingPlatforms.map((platform, index) => {
                return (
                  <div 
                    key={platform.name}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-500 hover:bg-white/20 hover:scale-105 cursor-pointer group border border-white/20"
                    style={{
                      animationDelay: `${index * 0.15}s`,
                      animation: 'slideInLeft 0.8s ease-out forwards'
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <img src={platform.icon} className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold mb-1">{platform.name}</span>
                      <span className="text-xs opacity-75">{platform.description}</span>
                    </div>

                  </div>
                );
              })}
            </div>
            
            {/* Feature Highlights */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div 
                    key={feature.text}
                    className="flex items-center space-x-3 opacity-90"
                    style={{
                      animationDelay: `${(index + 4) * 0.15}s`,
                      animation: 'slideInLeft 0.8s ease-out forwards'
                    }}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <img src={feature.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Login Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">KrispCall</h1>
                  <p className="text-gray-600 text-sm">Omni Channel</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to access your omni-channel dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 pr-12 bg-white/70 backdrop-blur-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 font-medium">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors font-medium">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl"
                  >
                    Sign In to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-500 font-semibold transition-colors">
                      Start free trial
                    </a>
                  </p>
                </div>

                {/* Mobile Platform Icons */}
                <div className="lg:hidden mt-8 pt-8 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600 mb-4 font-medium">Supported Platforms</p>
                  <div className="grid grid-cols-4 gap-3">
                    {messagingPlatforms.map((platform) => {
                      const IconComponent = platform.icon;
                      return (
                        <div
                          key={platform.name}
                          className={`${platform.bgColor} ${platform.hoverBg} p-4 rounded-xl transition-all duration-300 cursor-pointer group`}
                        >
                          <div className="flex flex-col items-center">
                            <img src={platform.icon} className={`w-6 h-6 ${platform.color} group-hover:scale-110 transition-transform duration-300`} />
                            <span className="text-xs mt-2 text-gray-600 font-medium">{platform.name}</span>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;