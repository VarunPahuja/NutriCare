import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { UserCog, Bell, Shield, CreditCard, User, LogOut, Moon, Sun } from 'lucide-react';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  const { profile, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
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
                    <a href="#profile"><User className="h-4 w-4 mr-2" />Profile</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#notifications"><Bell className="h-4 w-4 mr-2" />Notifications</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#preferences"><UserCog className="h-4 w-4 mr-2" />Preferences</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#billing"><CreditCard className="h-4 w-4 mr-2" />Billing</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#privacy"><Shield className="h-4 w-4 mr-2" />Privacy &amp; Security</a>
                  </Button>
                </nav>

                <div className="mt-8 pt-4 border-t border-fitness-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    onClick={handleSignOut}
                  >
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
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        defaultValue={profile?.full_name || ''}
                        className="bg-fitness-muted/70 border-fitness-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={profile?.email || ''}
                        className="bg-fitness-muted/70 border-fitness-border"
                        disabled
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed here.</p>
                    </div>

                    {profile?.role === 'doctor' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="specialty">Specialty</Label>
                          <Input
                            id="specialty"
                            defaultValue={profile?.specialty || ''}
                            className="bg-fitness-muted/70 border-fitness-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            defaultValue={profile?.bio || ''}
                            rows={3}
                            className="w-full bg-fitness-muted/70 border border-fitness-border rounded-md px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-fitness-primary"
                          />
                        </div>
                      </>
                    )}

                    <div className="pt-4">
                      <Button type="submit" className="bg-gradient-to-r from-fitness-primary to-[#FF4757]">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Notifications section */}
            <section id="notifications" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 'mealReminders', label: 'Meal Reminders', desc: 'Get notifications when it\'s time for your scheduled meals' },
                      { id: 'progressReports', label: 'Weekly Progress Reports', desc: 'Receive weekly summary of your nutrition progress' },
                      { id: 'articleNotifications', label: 'New Articles & Tips', desc: 'Get notified about new nutrition articles and tips' },
                      { id: 'waterReminders', label: 'Water Intake Reminders', desc: 'Reminders to help you meet your daily water goal' },
                    ].map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-fitness-border">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <input type="checkbox" id={item.id} defaultChecked className="w-4 h-4 accent-fitness-primary" />
                      </div>
                    ))}

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
                      <Button variant="outline" size="sm" onClick={handleToggleTheme} className="border-fitness-border">
                        {isDarkMode ? <><Sun className="h-4 w-4 mr-2" />Light Mode</> : <><Moon className="h-4 w-4 mr-2" />Dark Mode</>}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-fitness-border">
                      <div>
                        <p className="font-medium">Measurement Units</p>
                        <p className="text-sm text-gray-400">Choose your preferred measurement system</p>
                      </div>
                      <select className="bg-fitness-muted border border-fitness-border rounded px-2 py-1 text-sm">
                        <option value="metric">Metric (kg, cm)</option>
                        <option value="imperial">Imperial (lb, in)</option>
                      </select>
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
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Manage your subscription and billing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">Billing management coming soon.</p>
                </CardContent>
              </Card>
            </section>

            {/* Privacy section */}
            <section id="privacy" className="mb-8">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle>Privacy &amp; Security</CardTitle>
                  <CardDescription>Manage your account security and data preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Password</h3>
                      <p className="text-sm text-gray-400 mb-4">It's a good idea to use a strong password that you don't use elsewhere.</p>
                      <Button variant="outline" className="border-fitness-border">Change Password</Button>
                    </div>

                    <div className="pt-4 border-t border-fitness-border">
                      <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400 mb-4">Add an extra layer of security to your account.</p>
                      <Button variant="outline" className="border-fitness-border">Enable Two-Factor Auth</Button>
                    </div>

                    <div className="pt-4 border-t border-fitness-border">
                      <h3 className="text-lg font-medium mb-2">Account Data</h3>
                      <p className="text-sm text-gray-400 mb-4">Download or delete your account data.</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="border-fitness-border">Download My Data</Button>
                        <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">Delete My Account</Button>
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
