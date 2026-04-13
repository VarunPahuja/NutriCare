import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  role: ChatRole;
  content: string;
  timestamp: Date;
};

const AssistantPage = () => {
  const { profile } = useAuth();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Profile state
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('');
  const [goal, setGoal] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);

  // Background decoration elements
  const BlurredCircle = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full mix-blend-overlay blur-3xl ${className}`}></div>
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setConditions(prev => [...prev, condition]);
    } else {
      setConditions(prev => prev.filter(c => c !== condition));
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    const userMsg: ChatMessage = { role: 'user', content: message, timestamp: new Date() };
    const assistantMsg: ChatMessage = { role: 'assistant', content: '', timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    const userContext = {
      age: age ? parseInt(age, 10) : null,
      weight: weight ? parseInt(weight, 10) : null,
      activity,
      goal,
      conditions,
      name: profile?.full_name || null,
    };

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context: userContext }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data) as { content?: string; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.content) {
              setMessages((prev) => {
                if (!prev.length) return prev;
                const updated = [...prev];
                const idx = updated.length - 1;
                updated[idx] = {
                  ...updated[idx],
                  content: `${updated[idx].content}${parsed.content}`,
                };
                return updated;
              });
            }
          } catch {
            // Ignore malformed partial payloads
          }
        }
      }
    } catch {
      setMessages((prev) => {
        if (!prev.length) return prev;
        const updated = [...prev];
        const idx = updated.length - 1;
        updated[idx] = {
          ...updated[idx],
          content: 'Sorry, I could not process your request. Please try again.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const message = question.trim();
      if (!message) return;
      setQuestion('');
      sendMessage(message);
    }
  };

  const handleAsk = () => {
    const message = question.trim();
    if (!message) return;
    setQuestion('');
    sendMessage(message);
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
                  <button
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    className="bg-fitness-primary hover:bg-fitness-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Ask'
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Response Section */}
            {messages.length > 0 && (
              <Card className="fitness-card">
                <CardHeader>
                  <CardTitle>Conversation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[430px] overflow-y-auto">
                  {messages.map((message, index) => {
                    const isAssistant = message.role === 'assistant';
                    const isLast = index === messages.length - 1;
                    return (
                      <div
                        key={`${message.timestamp.getTime()}-${index}`}
                        className={`rounded-lg border p-4 ${
                          isAssistant
                            ? 'bg-fitness-muted/50 border-fitness-border'
                            : 'bg-fitness-primary/10 border-fitness-primary/30'
                        }`}
                      >
                        <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                          {isAssistant ? 'Assistant' : 'You'}
                        </p>
                        <p className="text-white whitespace-pre-wrap leading-relaxed">
                          {message.content}
                          {loading && isAssistant && isLast ? '▋' : ''}
                        </p>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
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