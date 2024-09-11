// import { useState } from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// const BlogPostEditor = () => {
//   const [content, setContent] = useState<string>('');

//   return (
//     <div>
//       <h2>Create a New Blog Post</h2>
//       <Editor
//         apiKey="bs48lk7xf5sdfty2c13z4fffjpsbgoczk1ykkrvgpzfusj6x"  // Optional, you can get a free API key from TinyMCE
//         value={content}
//         init={{
//           height: 500,
//           menubar: false,
//           plugins: [
//             'advlist autolink lists link image charmap print preview anchor',
//             'searchreplace visualblocks code fullscreen',
//             'insertdatetime media table paste code help wordcount',
//           ],
//           toolbar:
//             'undo redo | formatselect | bold italic backcolor | \
//              alignleft aligncenter alignright alignjustify | \
//              bullist numlist outdent indent | removeformat | help | image',
//           images_upload_url: '/upload-image-endpoint', // Define your image upload URL here
//           automatic_uploads: true,
//           images_upload_handler: (blobInfo, success, failure) => {
//             const formData = new FormData();
//             formData.append('file', blobInfo.blob());

//             fetch('/upload-image-endpoint', { // Your server endpoint to handle image uploads
//               method: 'POST',
//               body: formData,
//             })
//               .then(response => response.json())
//               .then(result => {
//                 success(result.fileUrl); // Use the file URL returned by your server
//               })
//               .catch(() => failure('Image upload failed.'));
//           },
//         }}
//         onEditorChange={(newContent) => setContent(newContent)}
//       />
//       <button onClick={() => console.log(content)}>Submit Post</button>
//     </div>
//   );
// };

// export default BlogPostEditor;
