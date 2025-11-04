import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, AlertCircle, CheckCircle2, XCircle, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ScanPage = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [scanId]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get(`${API}/qark/scan/${scanId}/status`);
      setStatus(response.data);
      setLoading(false);

      if (response.data.status === 'completed') {
        fetchResult();
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
      toast.error('Failed to fetch scan status');
    }
  };

  const fetchResult = async () => {
    try {
      const response = await axios.get(`${API}/qark/scan/${scanId}/result`);
      setResult(response.data);
    } catch (error) {
      console.error('Failed to fetch result:', error);
    }
  };

  const downloadReport = async (reportType) => {
    try {
      const response = await axios.get(`${API}/qark/scan/${scanId}/report/${reportType}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qark_report_${scanId}.${reportType}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Downloaded ${reportType.toUpperCase()} report successfully`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'VULNERABILITY': 'destructive',
      'WARNING': 'warning',
      'INFO': 'secondary',
    };
    return colors[severity] || 'secondary';
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'VULNERABILITY') return <XCircle className="w-4 h-4" />;
    if (severity === 'WARNING') return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle2 className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold text-white">QARK v6</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Status Card */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl">Scan Status</CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  Scan ID: {scanId}
                </CardDescription>
              </div>
              <Badge
                variant={status?.status === 'completed' ? 'success' : 'secondary'}
                className="text-lg px-4 py-2"
              >
                {status?.status === 'pending' && 'Pending'}
                {status?.status === 'decompiling' && 'Decompiling'}
                {status?.status === 'scanning' && 'Scanning'}
                {status?.status === 'reporting' && 'Generating Report'}
                {status?.status === 'completed' && 'Completed'}
                {status?.status === 'failed' && 'Failed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-semibold">{status?.progress}%</span>
                </div>
                <Progress value={status?.progress} className="h-3" />
              </div>
              <p className="text-gray-300">{status?.message}</p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700">
                <CardHeader>
                  <CardTitle className="text-white">Total Vulnerabilities</CardTitle>
                  <p className="text-5xl font-bold text-white mt-4">{result.total_vulnerabilities}</p>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-700">
                <CardHeader>
                  <CardTitle className="text-white">Warnings</CardTitle>
                  <p className="text-5xl font-bold text-white mt-4">
                    {result.vulnerabilities_by_severity.WARNING || 0}
                  </p>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white">Info</CardTitle>
                  <p className="text-5xl font-bold text-white mt-4">
                    {result.vulnerabilities_by_severity.INFO || 0}
                  </p>
                </CardHeader>
              </Card>
            </div>

            {/* Download Reports */}
            <Card className="bg-gray-800/50 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Download Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => downloadReport('html')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    HTML Report
                  </Button>
                  <Button
                    onClick={() => downloadReport('json')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    JSON Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerabilities List */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Discovered Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-gray-900/50 mb-4">
                    <TabsTrigger value="all">All ({result.total_vulnerabilities})</TabsTrigger>
                    <TabsTrigger value="vulnerability">
                      Critical ({result.vulnerabilities_by_severity.VULNERABILITY || 0})
                    </TabsTrigger>
                    <TabsTrigger value="warning">
                      Warnings ({result.vulnerabilities_by_severity.WARNING || 0})
                    </TabsTrigger>
                    <TabsTrigger value="info">
                      Info ({result.vulnerabilities_by_severity.INFO || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3">
                    {result.vulnerabilities.map((vuln, index) => (
                      <Card key={index} className="bg-gray-900/50 border-gray-700">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getSeverityIcon(vuln.severity)}
                              <h3 className="text-white font-semibold text-lg">{vuln.name}</h3>
                            </div>
                            <Badge variant={getSeverityColor(vuln.severity)}>
                              {vuln.severity}
                            </Badge>
                          </div>
                          <p className="text-gray-400 mb-2">{vuln.description}</p>
                          {vuln.file_path && (
                            <div className="text-sm text-gray-500">
                              <span className="font-mono">{vuln.file_path}</span>
                              {vuln.line_number && <span> : Line {vuln.line_number}</span>}
                            </div>
                          )}
                          <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
                            {vuln.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="vulnerability" className="space-y-3">
                    {result.vulnerabilities
                      .filter((v) => v.severity === 'VULNERABILITY')
                      .map((vuln, index) => (
                        <Card key={index} className="bg-gray-900/50 border-gray-700">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getSeverityIcon(vuln.severity)}
                                <h3 className="text-white font-semibold text-lg">{vuln.name}</h3>
                              </div>
                              <Badge variant={getSeverityColor(vuln.severity)}>
                                {vuln.severity}
                              </Badge>
                            </div>
                            <p className="text-gray-400 mb-2">{vuln.description}</p>
                            {vuln.file_path && (
                              <div className="text-sm text-gray-500">
                                <span className="font-mono">{vuln.file_path}</span>
                                {vuln.line_number && <span> : Line {vuln.line_number}</span>}
                              </div>
                            )}
                            <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
                              {vuln.category}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>

                  <TabsContent value="warning" className="space-y-3">
                    {result.vulnerabilities
                      .filter((v) => v.severity === 'WARNING')
                      .map((vuln, index) => (
                        <Card key={index} className="bg-gray-900/50 border-gray-700">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getSeverityIcon(vuln.severity)}
                                <h3 className="text-white font-semibold text-lg">{vuln.name}</h3>
                              </div>
                              <Badge variant={getSeverityColor(vuln.severity)}>
                                {vuln.severity}
                              </Badge>
                            </div>
                            <p className="text-gray-400 mb-2">{vuln.description}</p>
                            {vuln.file_path && (
                              <div className="text-sm text-gray-500">
                                <span className="font-mono">{vuln.file_path}</span>
                                {vuln.line_number && <span> : Line {vuln.line_number}</span>}
                              </div>
                            )}
                            <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
                              {vuln.category}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>

                  <TabsContent value="info" className="space-y-3">
                    {result.vulnerabilities
                      .filter((v) => v.severity === 'INFO')
                      .map((vuln, index) => (
                        <Card key={index} className="bg-gray-900/50 border-gray-700">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getSeverityIcon(vuln.severity)}
                                <h3 className="text-white font-semibold text-lg">{vuln.name}</h3>
                              </div>
                              <Badge variant={getSeverityColor(vuln.severity)}>
                                {vuln.severity}
                              </Badge>
                            </div>
                            <p className="text-gray-400 mb-2">{vuln.description}</p>
                            {vuln.file_path && (
                              <div className="text-sm text-gray-500">
                                <span className="font-mono">{vuln.file_path}</span>
                                {vuln.line_number && <span> : Line {vuln.line_number}</span>}
                              </div>
                            )}
                            <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
                              {vuln.category}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default ScanPage;
