import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, MessageCircle, User } from 'lucide-react';

// Type definitions for structured LLM response
interface StructuredResponse {
  summary: string;
  recommendations: string[];
  cautions: string[];
}

interface FallbackResponse {
  reply?: string;
  summary?: string;
}

type ApiResponse = StructuredResponse | FallbackResponse;

const AssistantPage = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Profile state
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');
  const [goal, setGoal] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);

  // Environment-based API configuration with fallback
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  // Background decoration elements
  const BlurredCircle = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full mix-blend-overlay blur-3xl ${className}`}></div>
  );

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setConditions(prev => [...prev, condition]);
    } else {
      setConditions(prev => prev.filter(c => c !== condition));
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: question,
          context: {
            age: age ? parseInt(age) : null,
            weight: weight ? parseInt(weight) : null,
            activity,
            goal,
            conditions
          }
        }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: ApiResponse = await res.json();
      
      // Handle new structured response format
      if ('summary' in data && 'recommendations' in data && 'cautions' in data) {
        let formattedResponse = `${data.summary}\n\n`;
        
        if (data.recommendations.length > 0) {
          formattedResponse += "Key Recommendations:\n";
          data.recommendations.forEach((rec: string) => {
            formattedResponse += `• ${rec}\n`;
          });
          formattedResponse += "\n";
        }
        
        if (data.cautions.length > 0) {
          formattedResponse += "What To Be Careful About:\n";
          data.cautions.forEach((caut: string) => {
            formattedResponse += `• ${caut}\n`;
          });
        }
        
        setResponse(formattedResponse);
      } else {
        // Fallback for old format or raw text
        setResponse(data.reply || data.summary || "No response received.");
      }
    } catch (err: any) {
      console.error('Chat API error:', err);
      setResponse("AI service temporarily unavailable.");
    } finally {
      setLoading(false);
    }
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
            {/* Profile Info Section */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Info
                </CardTitle>
                <CardDescription>
                  Provide your details for personalized nutrition advice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 25"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-fitness-muted border-fitness-border focus:border-fitness-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-fitness-muted border-fitness-border focus:border-fitness-primary"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <Select value={activity} onValueChange={setActivity}>
                      <SelectTrigger className="bg-fitness-muted border-fitness-border focus:border-fitness-primary">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedentary">Sedentary</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Strength Training">Strength Training</SelectItem>
                        <SelectItem value="Athlete">Athlete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Goal</Label>
                    <Select value={goal} onValueChange={setGoal}>
                      <SelectTrigger className="bg-fitness-muted border-fitness-border focus:border-fitness-primary">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fat Loss">Fat Loss</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Health Conditions</Label>
                  <div className="flex flex-wrap gap-4">
                    {['Hypertension', 'Diabetes', 'Kidney Issues'].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={conditions.includes(condition)}
                          onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                        />
                        <Label htmlFor={condition} className="text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

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