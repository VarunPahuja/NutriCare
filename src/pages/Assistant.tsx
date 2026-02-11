import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, MessageCircle } from 'lucide-react';

const AssistantPage = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Background decoration elements
  const BlurredCircle = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full mix-blend-overlay blur-3xl ${className}`}></div>
  );

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    // Mock 1-second delay
    setTimeout(() => {
      setResponse('This is a demo AI response. Backend integration coming next.');
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      {/* Background effects */}
      <BlurredCircle className="w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10" />
      <BlurredCircle className="w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10" />
      
      {/* Navigation */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Header section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                AI Nutrition Assistant (Beta)
              </h1>
              <p className="text-sm text-gray-400">
                For informational purposes only. Not medical advice.
              </p>
            </div>
          </div>
          
          {/* Assistant Interface */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Input Section */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Ask Your Nutrition Question
                </CardTitle>
                <CardDescription>
                  Get personalized nutrition advice and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., What foods should I eat to boost my energy?"
                    className="flex-1 bg-fitness-muted border-fitness-border focus:border-fitness-primary"
                    disabled={loading}
                  />
                  <Button 
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    className="bg-fitness-primary hover:bg-fitness-primary/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Ask'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response Section */}
            {(response || loading) && (
              <Card className="fitness-card">
                <CardHeader>
                  <CardTitle>AI Response</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-fitness-primary" />
                      <span className="ml-3 text-gray-400">Generating response...</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <div className="bg-fitness-muted/50 rounded-lg p-4 border border-fitness-border">
                        <p className="text-white mb-0">{response}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Educational Notice */}
            <Card className="fitness-card border-amber-500/20 bg-amber-500/5">
              <CardContent className="pt-6">
                <div className="text-sm text-amber-200">
                  <strong>Note:</strong> This AI assistant is currently in beta. 
                  Responses are for informational purposes only and should not replace 
                  professional medical or nutritional advice. Always consult with a 
                  healthcare provider for personalized recommendations.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssistantPage;