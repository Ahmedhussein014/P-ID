import React, { useRef, useState } from 'react';
// Fix: Added Activity and Network to imports to resolve "Cannot find name" errors
import { Upload, FileImage, AlertCircle, Activity, Network } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string, mimeType: string, previewUrl: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size exceeds 10MB limit.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const base64String = (e.target.result as string).split(',')[1];
        const previewUrl = URL.createObjectURL(file);
        onFileSelect(base64String, file.type, previewUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4">
      <div
        className={`relative group flex flex-col items-center justify-center w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
          ${dragActive 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
          <div className={`p-4 rounded-full mb-4 transition-colors duration-300 ${dragActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
            <Upload className="w-10 h-10" />
          </div>
          <p className="mb-2 text-lg font-medium text-slate-700">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-slate-500">
            P&ID Diagrams (PNG, JPG, WebP) up to 10MB
          </p>
        </div>

        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 animate-fade-in">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Example feature list */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileImage className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Visual Recognition</h3>
          <p className="text-sm text-slate-500">Instantly identifies pumps, valves, and piping connections.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Process Logic</h3>
          <p className="text-sm text-slate-500">Explains the control philosophy and safety interlocks.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Network className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Interactive Chat</h3>
          <p className="text-sm text-slate-500">Ask specific questions about any part of the diagram.</p>
        </div>
      </div>
    </div>
  );
};