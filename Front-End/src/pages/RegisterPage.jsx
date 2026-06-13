import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Lock, Eye, EyeOff, Check, GraduationCap, Lightbulb, 
  Layout, Database, Cpu, Smartphone, ChevronRight, AlertCircle, ArrowLeft 
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Multi-step state
  const [step, setStep] = useState(1);

  // Form field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Learner'); // 'Learner' or 'Mentor'
  
  // Step 3 (Learner personalization) states
  const [path, setPath] = useState('Frontend'); // Frontend, Backend, AI, Mobile
  const [level, setLevel] = useState('Beginner'); // Beginner, Intermediate

  // UI / validation states
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Validate Step 1
  const validateStep1 = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStep1Valid = () => {
    if (!name.trim()) return false;
    if (!email || !/\S+@\S+\.\S+/.test(email)) return false;
    if (!password || password.length < 8) return false;
    return true;
  };

  // Navigate forward
  const handleContinue = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (role === 'Mentor') {
        // Mentor registration completes here!
        handleFinish();
      } else {
        // Learner goes to personalization (step 3)
        setStep(3);
      }
    }
  };

  // Navigate backward
  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Finish Setup & Register
  const handleFinish = () => {
    setGeneralError('');
    
    const userData = {
      name,
      email,
      password,
      role,
      ...(role === 'Learner' ? { path, level } : {})
    };

    const result = register(userData);
    if (result.success) {
      if (role === 'Mentor') {
        navigate('/mentor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setGeneralError(result.message);
      // Go back to step 1 if the email is already taken
      setStep(1);
    }
  };

  // Step 3 options
  const pathways = [
    { id: 'Frontend', title: 'Frontend', desc: 'React, Vue, and CSS architecture.', icon: Layout },
    { id: 'Backend', title: 'Backend', desc: 'Node.js, Python, and Microservices.', icon: Database },
    { id: 'AI', title: 'AI & Data', desc: 'LLMs, RAG, and predictive models.', icon: Cpu },
    { id: 'Mobile', title: 'Mobile', desc: 'Swift, Kotlin, and native experiences.', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2"></div>

      {/* Main Multi-step Card Container */}
      <div className="w-full max-w-5xl bg-white border border-slate-200/55 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[580px]">
        
        {/* Left Column: Dark Info panel */}
        <div className="md:w-[40%] bg-gradient-to-b from-brand-darkBg to-brand-darkBgEnd p-8 md:p-10 flex flex-col justify-between text-left relative text-white">
          {/* Subtle Grid overlay for premium depth */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none rounded-l-3xl"></div>
          
          {/* Top Logo */}
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
              <span className="font-display font-black text-white text-base">C</span>
            </div>
            <span className="font-display font-semibold text-lg text-white tracking-tight">CodePath</span>
          </div>

          {/* Dynamic Content based on Steps */}
          <div className="my-12 relative z-10 max-w-xs">
            {step < 3 ? (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-2xl sm:text-3xl leading-snug">
                  Begin your journey to mastery.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed font-normal">
                  Join a community of ambitious professionals and students. Define your path, track your progress, and achieve your goals with our high-performance learning ecosystem.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-2xl sm:text-3xl leading-snug">
                  Architect your future.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed font-normal">
                  Tell us what you want to build, and we'll craft the perfect curriculum to get you there.
                </p>
              </div>
            )}
          </div>

          {/* Pagination Indicators (Dots) */}
          <div className="flex gap-2.5 items-center relative z-10">
            {[1, 2, 3].map((dotIndex) => (
              <button
                key={dotIndex}
                disabled={dotIndex > step && !isStep1Valid()}
                onClick={() => {
                  if (dotIndex === 3 && role === 'Mentor') return;
                  setStep(dotIndex);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  dotIndex === step 
                    ? 'w-7 bg-white' 
                    : 'w-2.5 bg-white/30 hover:bg-white/50 cursor-pointer'
                } ${dotIndex === 3 && role === 'Mentor' ? 'hidden' : ''}`}
              ></button>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="md:w-[60%] p-8 sm:p-10 flex flex-col justify-between text-left">
          
          {/* Step Progress Line */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Account Setup</span>
              <span>Step {step} of {role === 'Mentor' ? 2 : 3}</span>
            </div>
            {/* Progress Bar Container */}
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-brand-primary transition-all duration-500 rounded-full"
                style={{ 
                  width: role === 'Mentor' 
                    ? `${(step / 2) * 100}%` 
                    : `${(step / 3) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Form Content body */}
          <div className="my-auto py-4">
            
            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-sm text-red-600">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {/* STEP 1: Account Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Create your account</h3>
                  <p className="text-slate-400 text-sm">Let's start with your basic details to set up your profile.</p>
                </div>

                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className={`w-full pl-9 pr-4 py-2 bg-slate-50/50 border ${
                          errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-primary/10'
                        } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className={`w-full pl-9 pr-4 py-2 bg-slate-50/50 border ${
                          errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-primary/10'
                        } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Lock size={16} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-9 py-2 bg-slate-50/50 border ${
                          errors.password ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-brand-primary/10'
                        } rounded-xl text-sm focus:outline-none focus:ring-4 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-none">Must be at least 8 characters long.</p>
                    {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Role Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">Choose your role</h3>
                  <p className="text-slate-400 text-sm">Tell us how you'd like to use CodePath.</p>
                </div>

                <div className="space-y-4">
                  {/* Learner Card */}
                  <div
                    onClick={() => setRole('Learner')}
                    className={`flex items-center gap-4 p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${
                      role === 'Learner'
                        ? 'border-brand-primary bg-brand-primary/[0.02] shadow-md shadow-brand-primary/5'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      role === 'Learner'
                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      <GraduationCap size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-slate-800 text-sm">Learner</h4>
                      <p className="text-xs text-slate-400 leading-normal mt-0.5">Follow structured roadmaps and track your learning progress.</p>
                    </div>
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 border ${
                      role === 'Learner' 
                        ? 'bg-brand-primary border-brand-primary text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {role === 'Learner' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Mentor Card */}
                  <div
                    onClick={() => setRole('Mentor')}
                    className={`flex items-center gap-4 p-5 border rounded-2xl cursor-pointer transition-all duration-300 ${
                      role === 'Mentor'
                        ? 'border-brand-primary bg-brand-primary/[0.02] shadow-md shadow-brand-primary/5'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      role === 'Mentor'
                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      <Lightbulb size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-slate-800 text-sm">Mentor</h4>
                      <p className="text-xs text-slate-400 leading-normal mt-0.5">Guide learners and support the community on their journey.</p>
                    </div>
                    <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 border ${
                      role === 'Mentor' 
                        ? 'bg-brand-primary border-brand-primary text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {role === 'Mentor' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Path & Skill (Learner Only) */}
            {step === 3 && role === 'Learner' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1 font-display">Customize your learning journey</h3>
                  <p className="text-slate-400 text-sm">Select your learning path and current skill level.</p>
                </div>

                {/* Primary Focus Grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Primary Focus</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {pathways.map((item) => {
                      const Icon = item.icon;
                      const isSelected = path === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setPath(item.id)}
                          className={`flex items-center gap-3.5 p-4 border rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-brand-primary bg-brand-primary/[0.02] shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                              : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-slate-800 text-xs">{item.title}</h4>
                            <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current Skill Level Slider/Capsule */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Current Skill Level</label>
                  <div className="w-full bg-slate-100/80 p-1 rounded-xl flex relative h-11">
                    {/* Sliding Background */}
                    <div 
                      className="absolute top-1 bottom-1 bg-white border border-slate-200/50 rounded-lg shadow-sm transition-all duration-300"
                      style={{ 
                        left: level === 'Beginner' ? '4px' : '50%',
                        width: 'calc(50% - 8px)'
                      }}
                    ></div>
                    <button
                      type="button"
                      onClick={() => setLevel('Beginner')}
                      className={`flex-1 text-center font-semibold text-sm relative z-10 transition-colors ${
                        level === 'Beginner' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Beginner
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevel('Intermediate')}
                      className={`flex-1 text-center font-semibold text-sm relative z-10 transition-colors ${
                        level === 'Intermediate' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Intermediate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons footer */}
          <div className="border-t border-slate-100 pt-6 flex items-center justify-between mt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 transition-all text-sm"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <div className="text-sm">
                <span className="text-slate-400 font-medium">Already have an account? </span>
                <Link to="/login" className="font-bold text-brand-primary hover:text-brand-primaryHover transition-colors">
                  Log in
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={step === (role === 'Mentor' ? 2 : 3) ? handleFinish : handleContinue}
              className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-primaryHover text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              <span>{step === (role === 'Mentor' ? 2 : 3) ? 'Finish Setup' : 'Continue'}</span>
              <ChevronRight size={16} className="mt-0.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
