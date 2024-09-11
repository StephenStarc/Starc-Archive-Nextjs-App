/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
// @ts-expect-error
import { auth, db } from '../firebase'; // Adjust the import path as needed
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import Navbar from '@/components/Navbar';

interface BlogPost {
  title: string;
  category: string;
  imageUrl: string;
  author?: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  summary: string;
  content: string;
}

export default function PrivateBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id || !user) return;

      try {
        const docRef = doc(db, 'privatePosts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as BlogPost;
          setBlogPost({
            ...data,
            createdAt: data.createdAt ? new Date((data.createdAt as any).seconds * 1000) : new Date(),
            author: data.author || { name: 'Anonymous', avatar: '/placeholder.svg?height=40&width=40' },
          });
        } else {
          setError("Blog post not found");
        }
      } catch (err) {
        setError("Error fetching blog post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, user]);

  if (!user) {
    return <div>Please log in to view this private post.</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!blogPost) return <div>Blog post not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            <Avatar>
              <AvatarImage src="https://avatars.githubusercontent.com/u/144702766?s=400&u=628c799da91d2e49b3c33e09a70f9765f535e7c4&v=4" alt="Stephen Starc Profile" />
            </Avatar>
            <div>
              <p className="font-semibold">'Starc Archive'</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {blogPost.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          <Badge className="mb-6">{blogPost.category}</Badge>

          <img
            src={blogPost.imageUrl}
            alt={blogPost.title}
            className="w-full h-[400px] object-cover rounded-lg mb-6"
          />

          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-semibold mb-4">{blogPost.summary}</p>
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </div>
        </article>
      </main>

      <footer className="bg-primary text-primary-foreground mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">&copy; 2023 MyBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}