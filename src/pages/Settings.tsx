import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { UserCog, Bell, Shield, CreditCard, User, LogOut, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your profile changes have been saved successfully.",
    });
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10"></div>
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10"></div>
      
      {/* Navigation */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <h1 className="text-3xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fitness-primary to-[#FF4757]">
            Settings
          </span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-3">
            <Card className="bg-fitness-card/90 border-fitness-border sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#notifications">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#preferences">
                      <UserCog className="h-4 w-4 mr-2" />
                      Preferences
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#billing">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Billing
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#privacy">
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy & Security
                    </a>
                  </Button>
                </nav>
                
                <div className="mt-8 pt-4 border-t border-fitness-border">
                  <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-9">
            {/* Profile section */}
            <section id="profile" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile details here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          defaultValue="Varun" 
                          className="bg-fitness-muted/70 border-fitness-border" 
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          defaultValue="Pahuja" 
                          className="bg-fitness-muted/70 border-fitness-border" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue="vpahuja1508@gmail.com" 
                        className="bg-fitness-muted/70 border-fitness-border" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone" 
                        defaultValue="(123) 456-7890" 
                        className="bg-fitness-muted/70 border-fitness-border" 
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="bg-gradient-to-r from-fitness-primary to-[#FF4757]">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>
            
            {/* Health Information section */}
            <section id="health" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                  <CardDescription>Your personal health information used for nutrition planning.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input 
                          id="height" 
                          defaultValue="165" 
                          className="bg-fitness-muted/70 border-fitness-border" 
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input 
                          id="weight" 
                          defaultValue="65" 
                          className="bg-fitness-muted/70 border-fitness-border" 
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="age">Age</Label>
                        <Input 
                          id="age" 
                          defaultValue="32" 
                          className="bg-fitness-muted/70 border-fitness-border" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="conditions">Health Conditions</Label>
                      <Input 
                        id="conditions" 
                        defaultValue="Type 2 Diabetes" 
                        className="bg-fitness-muted/70 border-fitness-border" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Input 
                        id="medications" 
                        defaultValue="Metformin" 
                        className="bg-fitness-muted/70 border-fitness-border" 
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="bg-gradient-to-r from-fitness-primary to-[#FF4757]">
                        Update Health Info
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>
            
            {/* Other sections follow the same pattern */}
            {/* Notifications section */}
            <section id="notifications" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">Meal Reminders</p>
                        <p className="text-sm text-gray-400">Get notifications when it's time for your scheduled meals</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="mealReminders" defaultChecked
                              className="w-4 h-4 accent-fitness-primary" />
                        <Label htmlFor="mealReminders" className="sr-only">Enable meal reminders</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">Weekly Progress Reports</p>
                        <p className="text-sm text-gray-400">Receive weekly summary of your nutrition progress</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="progressReports" defaultChecked
                              className="w-4 h-4 accent-fitness-primary" />
                        <Label htmlFor="progressReports" className="sr-only">Enable progress reports</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">New Articles & Tips</p>
                        <p className="text-sm text-gray-400">Get notified about new nutrition articles and tips</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="articleNotifications" defaultChecked
                              className="w-4 h-4 accent-fitness-primary" />
                        <Label htmlFor="articleNotifications" className="sr-only">Enable article notifications</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">Water Intake Reminders</p>
                        <p className="text-sm text-gray-400">Reminders to help you meet your daily water goal</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="waterReminders" defaultChecked
                              className="w-4 h-4 accent-fitness-primary" />
                        <Label htmlFor="waterReminders" className="sr-only">Enable water reminders</Label>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-gradient-to-r from-fitness-primary to-[#FF4757]">
                        Save Notification Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* Preferences section */}
            <section id="preferences" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize how the app works for you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-400">Toggle between light and dark theme</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleToggleTheme}
                        className="border-fitness-border"
                      >
                        {isDarkMode ? (
                          <>
                            <Sun className="h-4 w-4 mr-2" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4 mr-2" />
                            Dark Mode
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">Measurement Units</p>
                        <p className="text-sm text-gray-400">Choose your preferred measurement system</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select className="bg-fitness-muted border border-fitness-border rounded px-2 py-1 text-sm">
                          <option value="metric">Metric (kg, cm)</option>
                          <option value="imperial">Imperial (lb, in)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-gray-400">Select your preferred language</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select className="bg-fitness-muted border border-fitness-border rounded px-2 py-1 text-sm">
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-gradient-to-r from-fitness-primary to-[#FF4757]">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* Billing section */}
            <section id="billing" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>You are currently on the Premium Plan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-fitness-primary/20 to-fitness-accent/10 p-4 rounded-lg border border-fitness-primary/30 mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      <span className="text-fitness-primary">Premium</span> Plan
                    </h3>
                    <p className="text-sm mb-4">Your plan renews on April 25, 2025</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-fitness-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Unlimited meal plans
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-fitness-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Personalized nutrition advice
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-fitness-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Advanced analytics
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-fitness-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Priority support
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <Button variant="outline" className="border-fitness-border mb-3 sm:mb-0">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-card/90 border-fitness-border mt-6">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-fitness-border rounded-lg mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-fitness-muted rounded-md mr-3">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4589</p>
                        <p className="text-sm text-gray-400">Expires 09/26</p>
                      </div>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-fitness-primary/20 text-fitness-primary rounded text-xs">
                        Default
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="border-fitness-primary text-fitness-primary">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-card/90 border-fitness-border mt-6">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>View your recent payments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-fitness-border">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Date</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Amount</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Status</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-fitness-border">
                          <td className="px-4 py-3 text-sm">Mar 25, 2025</td>
                          <td className="px-4 py-3 text-sm">$12.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <Button variant="ghost" size="sm" className="text-fitness-accent">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-fitness-border">
                          <td className="px-4 py-3 text-sm">Feb 25, 2025</td>
                          <td className="px-4 py-3 text-sm">$12.99</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <Button variant="ghost" size="sm" className="text-fitness-accent">
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            {/* Privacy section */}
            <section id="privacy" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your account security and data preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Password</h3>
                      <p className="text-sm text-gray-400 mb-4">It's a good idea to use a strong password that you don't use elsewhere.</p>
                      <Button variant="outline" className="border-fitness-border">
                        Change Password
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t border-fitness-border">
                      <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400 mb-4">Add an extra layer of security to your account.</p>
                      <Button variant="outline" className="border-fitness-border">
                        Enable Two-Factor Auth
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t border-fitness-border">
                      <h3 className="text-lg font-medium mb-2">Data Privacy</h3>
                      <p className="text-sm text-gray-400 mb-4">Manage how your data is used and shared.</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Share my nutrition data with nutritionists</p>
                            <p className="text-xs text-gray-400">Allow nutritionists to view your meal plans and progress</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="shareNutritionists" defaultChecked
                                  className="w-4 h-4 accent-fitness-primary" />
                            <Label htmlFor="shareNutritionists" className="sr-only">Share with nutritionists</Label>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Allow personalized recommendations</p>
                            <p className="text-xs text-gray-400">We'll use your data to provide better meal suggestions</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="allowRecommendations" defaultChecked
                                  className="w-4 h-4 accent-fitness-primary" />
                            <Label htmlFor="allowRecommendations" className="sr-only">Allow recommendations</Label>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Share anonymized data for research</p>
                            <p className="text-xs text-gray-400">Help improve nutrition science with anonymized data</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="shareResearch" defaultChecked
                                  className="w-4 h-4 accent-fitness-primary" />
                            <Label htmlFor="shareResearch" className="sr-only">Share for research</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Button className="bg-gradient-to-r from-fitness-primary to-[#FF4757]">
                          Save Privacy Settings
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-fitness-border">
                      <h3 className="text-lg font-medium mb-2">Account Data</h3>
                      <p className="text-sm text-gray-400 mb-4">Download or delete your account data.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="border-fitness-border">
                          Download My Data
                        </Button>
                        <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
                          Delete My Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
