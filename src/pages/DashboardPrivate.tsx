/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, FileText, Lock,LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// @ts-expect-error
import { auth, db } from '../firebase'; // Adjust the import path as needed
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface Post {
  id: string;
  title: string;
  category: string;
  createdAt: Date;
  summary: string;
  imageUrl: string;
}

export default function DashboardPrivate() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });

    if (user) {
      const postsQuery = query(collection(db, 'privatePosts'), orderBy('createdAt', 'desc'));
      const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
        const newPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        })) as Post[];
        setPosts(newPosts);
      });

      return () => {
        unsubscribeAuth();
        unsubscribePosts();
      };
    }

    return unsubscribeAuth;
  }, [navigate, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (!user) {
    return <div>Please log in to view private posts.</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground p-4">
        <div className="flex items-center space-x-2 mb-6">
          <Avatar>
            <AvatarImage src={user?.photoURL || "/placeholder.svg?height=32&width=32"} alt="User" />
            <AvatarFallback>{user?.displayName ? user.displayName.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{user?.displayName || 'User'}</h2>
            <p className="text-sm">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <nav className="space-y-2">
        <Link to="/" className="flex items-center space-x-2 p-2 rounded hover:bg-primary-foreground hover:text-primary">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-primary-foreground hover:text-primary">
            <Home className="h-5 w-5" />
            <span>Posts</span>
          </Link>
         
          <Link to="/private-dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-primary-foreground hover:text-primary">
            <Lock className="h-5 w-5" />
            <span>Private Pages</span>
          </Link>
          <Link to="/add-post" className="flex items-center space-x-2 p-2 rounded hover:bg-primary-foreground hover:text-primary">
            <FileText className="h-5 w-5" />
            <span>Add Post</span>
          </Link>
          {/* <Link to="/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-primary-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link> */}
        </nav>
        <div className="absolute bottom-4">
          <Button variant="ghost" className="flex items-center space-x-2 text-primary-foreground" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Private Posts</h1>
        <Card>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)] mt-6">
              <div className="space-y-6">
                {posts.map((post) => (
                     <Link to={`/private-post/${post.id}`}>
                  <div key={post.id} className="flex items-start space-x-4 p-4 mb-3 bg-secondary rounded-lg">
                    <img src={post.imageUrl} alt={post.title} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <span>{post.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="mx-2">|</span>
                        <span>{post.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
  {post.summary.split(' ').slice(0, 20).join(' ')}
  {post.summary.split(' ').length > 20 ? '...' : ''}
</p>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}