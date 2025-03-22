import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Bell,
  Brain,
  Ellipsis,
  Flag,
  PowerIcon as Gear,
  Image,
  Link,
  MicIcon as Microphone,
  Plus,
  Share,
  Tag,
} from 'lucide-react';

export default function JournalApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="text-primary text-2xl" />
              <span className="ml-2 text-xl font-semibold text-primary">Jotta</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600 hover:text-primary" />
              </Button>
              <Button variant="ghost" size="icon">
                <Gear className="h-5 w-5 text-gray-600 hover:text-primary" />
              </Button>
              <Avatar>
                <AvatarImage
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                  alt="Profile"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Journal Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Daily Journal</h1>
            <p className="text-gray-600 mt-2">Thursday, March 14, 2025</p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-4 mb-8">
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" />
              Start Entry
            </Button>
            <Button variant="outline">
              <Microphone className="mr-2 h-4 w-4" />
              Voice Note
            </Button>
          </div>

          {/* Editor Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">10:30 AM</span>
                  <div className="flex space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      Meeting
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      @Alice
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                className="w-full h-40 resize-none focus:outline-none text-gray-700"
                placeholder="What's on your mind?"
              />
            </CardContent>
          </Card>

          {/* Previous Entries */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Previous Entries</h2>

            {/* Entry Card */}
            <Card className="mb-4">
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Yesterday, 3:45 PM</span>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      Personal
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-6 py-0">
                <p className="text-gray-700">
                  Had a productive brainstorming session with the team today. We discussed the new
                  feature implementation and timeline. Need to follow up with @Bob about the
                  technical requirements.
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-primary text-sm p-0 h-auto"
                  >
                    <Flag className="mr-1 h-4 w-4" /> Flag for follow-up
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-primary text-sm p-0 h-auto"
                  >
                    <Share className="mr-1 h-4 w-4" /> Share
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="fixed right-0 top-16 h-full w-72 bg-white border-l border-gray-200 p-4">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Quick Stats</h3>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Entries this week</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tagged people</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending follow-ups</span>
              <span className="font-semibold text-orange-500">3</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Recent Tags</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              Meeting
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              Project
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              Personal
            </Badge>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            >
              Ideas
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Recent People</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                  alt="Bob Smith"
                />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-gray-700">Bob Smith</span>
            </div>
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg"
                  alt="Alice Johnson"
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-gray-700">Alice Johnson</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
