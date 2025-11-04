import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Shield, Scan, FileSearch, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.apk') || droppedFile.name.endsWith('.java') || droppedFile.name.endsWith('.jar')) {
        setFile(droppedFile);
      } else {
        toast.error('Please upload APK, Java, or JAR files only');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.apk') || selectedFile.name.endsWith('.java') || selectedFile.name.endsWith('.jar')) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload APK, Java, or JAR files only');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/qark/scan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('File uploaded successfully! Starting scan...');
      
      // Navigate to scan page
      navigate(`/scan/${response.data.scan_id}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">QARK v6</h1>
                <p className="text-sm text-gray-400">Quick Android Review Kit</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              onClick={() => navigate('/history')}
            >
              <FileSearch className="w-4 h-4 mr-2" />
              Scan History
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Android Security
            <span className="text-blue-500"> Vulnerability Scanner</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Discover security vulnerabilities in your Android applications with speed and precision
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all">
            <CardHeader>
              <Scan className="w-12 h-12 text-blue-500 mb-4" />
              <CardTitle className="text-white">Comprehensive Scan</CardTitle>
              <CardDescription className="text-gray-400">
                Full scan for all known security vulnerabilities in Android applications
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all">
            <CardHeader>
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <CardTitle className="text-white">Advanced Detection</CardTitle>
              <CardDescription className="text-gray-400">
                Detect vulnerabilities in SSL, encryption, permissions, and 40+ vulnerability types
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all">
            <CardHeader>
              <FileSearch className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="text-white">Detailed Reports</CardTitle>
              <CardDescription className="text-gray-400">
                Detailed reports in multiple formats (HTML, JSON, XML, CSV) with fix recommendations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="max-w-2xl mx-auto bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">Start Scanning Now</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Upload APK or Java file to start scanning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".apk,.java,.jar"
                onChange={handleFileChange}
                disabled={uploading}
              />
              
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              
              {file ? (
                <div className="mb-4">
                  <p className="text-white font-semibold text-lg mb-2">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-white font-semibold mb-2">
                    Drag & drop your file here or click to select
                  </p>
                  <p className="text-gray-400 text-sm">
                    APK, Java, or JAR (Max: 500 MB)
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload').click()}
                  disabled={uploading}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Choose File
                </Button>
                
                {file && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4 mr-2" />
                        Start Scan
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p className="mb-2">Developed by:</p>
          <p>Daoud Abu Madi</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
