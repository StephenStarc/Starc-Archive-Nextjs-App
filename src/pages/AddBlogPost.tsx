/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// @ts-expect-error
import { storage, db } from '../firebase'; // Adjust the import path as needed
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function AddBlogPost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [postType, setPostType] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!title || !category || !postType || !summary || !content) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (!image) {
      setError('Please select an image for the blog post.');
      setIsLoading(false);
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `blog_images/${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Add blog post to Firestore
      const postData = {
        title,
        category,
        postType,
        summary,
        content,
        imageUrl,
        createdAt: new Date(),
      };

      const collectionRef = collection(db, postType === 'public' ? 'publicPosts' : 'privatePosts');
      await addDoc(collectionRef, postData);

      console.log('Blog post added successfully');
      setIsLoading(false);
      navigate('/dashboard'); // Redirect to dashboard after successful post
    } catch (error) {
      console.error('Error adding blog post: ', error);
      setError('Failed to add blog post. Please try again.');
      setIsLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image',
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Add New Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter blog post title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  placeholder="Choose Category" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postType">Post Type</Label>
                <Select value={postType} onValueChange={setPostType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Post Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea 
                  id="summary" 
                  placeholder="Enter a brief summary of your post" 
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Blog Image</Label>
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your blog post content here"
                   className="quill-editor"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Publishing...' : 'Publish Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
    </>
  );
}