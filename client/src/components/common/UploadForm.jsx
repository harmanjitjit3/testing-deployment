// import { useState } from "react";
// import { Upload, X } from "lucide-react";

// export default function UploadForm({ onUploaded }) {
//   const [file, setFile] = useState(null);
//   const [tags, setTags] = useState("");
//   const [msg, setMsg] = useState("");
//   const [dragActive, setDragActive] = useState(false);

//   async function handleUpload(e) {
//     e.preventDefault();
//     if (!file) {
//       setMsg("Please select a file first.");
//       return;
//     }

//     try {
//       setMsg("Uploading...");
//       // const token = getToken();
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("tags", tags);

//       await apiFetch("/files/upload", {
//         method: "POST",
//         body: formData,
//         token,
//         isFormData: true,
//       });

//       setMsg("Upload successful ✅");
//       setFile(null);
//       setTags("");
//       if (onUploaded) onUploaded();
//     } catch (err) {
//       console.error(err);
//       setMsg("Upload failed ❌");
//     }
//   }

//   function handleDrop(e) {
//     e.preventDefault();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setFile(e.dataTransfer.files[0]);
//     }
//   }

//   return (
//     <form onSubmit={handleUpload} className="space-y-5">
//       {/* File Upload Zone */}
//       <div
//         className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition ${
//           dragActive
//             ? "border-primary bg-primary/5"
//             : "border-gray-300 bg-gray-50"
//         }`}
//         onClick={() => document.getElementById("fileInput").click()}
//         onDrop={handleDrop}
//         onDragOver={(e) => {
//           e.preventDefault();
//           setDragActive(true);
//         }}
//         onDragLeave={(e) => {
//           e.preventDefault();
//           setDragActive(false);
//         }}
//       >
//         {file ? (
//           <div className="flex items-center gap-3">
//             <p className="text-gray-700 font-medium truncate max-w-[220px]">
//               {file.name}
//             </p>
//             <button
//               type="button"
//               className="text-gray-400 hover:text-red-500"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setFile(null);
//               }}
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         ) : (
//           <>
//             <Upload className="h-9 w-9 text-gray-400 mb-2" />
//             <p className="text-gray-600 font-medium">
//               Drag & drop or click to select a file
//             </p>
//             <p className="text-xs text-gray-400 mt-1">
//               PDF, DOCX, PNG, JPG up to 10MB
//             </p>
//           </>
//         )}
//         <input
//           id="fileInput"
//           type="file"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//       </div>

//       {/* Tags */}
//       <input
//         type="text"
//         placeholder="Enter tags (comma separated)"
//         value={tags}
//         onChange={(e) => setTags(e.target.value)}
//         className="w-full rounded-xl border border-gray-300 px-4 py-2 sm:py-3 text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
//       />

//       {/* Upload Button */}
//       <button
//         type="submit"
//         className="w-full rounded-xl bg-primary px-4 py-2.5 sm:py-3 font-semibold text-white shadow-md transition hover:opacity-90"
//       >
//         Upload File
//       </button>

//       {/* Message */}
//       {msg && (
//         <p className="text-center text-sm font-medium text-gray-600">{msg}</p>
//       )}
//     </form>
//   );
// }
