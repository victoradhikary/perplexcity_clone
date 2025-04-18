
import { Search, Sparkles, Compass } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Ask",
      description: "Enter your question or topic of interest in the search bar."
    },
    {
      icon: Sparkles,
      title: "Answer",
      description: "Get a comprehensive answer with sources from across the web."
    },
    {
      icon: Compass,
      title: "Explore",
      description: "Dive deeper with follow-up questions and explore related topics."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-3 perplexity-gradient">How It Works</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          QuerySpark combines powerful AI with real-time search to deliver accurate, 
          up-to-date answers to your questions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="how-it-works-card flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-perplexity/10 flex items-center justify-center mb-4">
                <step.icon className="h-6 w-6 text-perplexity" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
