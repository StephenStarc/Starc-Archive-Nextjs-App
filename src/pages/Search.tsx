/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from 'react-router-dom';
import { Search } from "lucide-react";
// @ts-expect-error
import { db } from '../firebase'; // Adjust the import path as needed
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

interface Post {
  id: string;
  title: string;
  category: string;
  createdAt: Date;
  summary: string;
  imageUrl: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsQuery = query(collection(db, 'publicPosts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Post[];
      setAllPosts(posts);
    };

    fetchPosts();
  }, []);

  const handleSearch = () => {
    const results = allPosts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Blog Posts</h1>
        
        <div className="flex space-x-2 mb-8">
          <Input
            type="text"
            placeholder="Search for blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        <Card>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-4">
                {searchResults.length > 0 ? (
                  searchResults.map((post) => (
                    <Link to={`/post/${post.id}`} key={post.id}>
                      <div className="flex items-start space-x-4 p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                        <img src={post.imageUrl} alt={post.title} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h2 className="text-base font-semibold mb-1">{post.title}</h2>
                          <div className="flex items-center text-xs text-muted-foreground mb-1">
                            <span>{post.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            <span className="mx-2">|</span>
                            <span>{post.category}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{post.summary}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : searchQuery ? (
                  <p className="text-center text-muted-foreground">No results found for "{searchQuery}"</p>
                ) : (
                  <p className="text-center text-muted-foreground">Enter a search query to find blog posts</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer/>
    </>
  );
}