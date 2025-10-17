import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, FileSearch, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HistoryPage = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await axios.get(`${API}/qark/scans`);
      setScans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch scans:', error);
      toast.error('Failed to fetch scan history');
      setLoading(false);
    }
  };

  const deleteScan = async (scanId) => {
    try {
      await axios.delete(`${API}/qark/scan/${scanId}`);
      toast.success('Scan deleted successfully');
      fetchScans();
    } catch (error) {
      console.error('Failed to delete scan:', error);
      toast.error('Failed to delete scan');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'success',
      'pending': 'secondary',
      'decompiling': 'warning',
      'scanning': 'warning',
      'failed': 'destructive',
    };
    return colors[status] || 'secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      'completed': 'Completed',
      'pending': 'Pending',
      'decompiling': 'Decompiling',
      'scanning': 'Scanning',
      'reporting': 'Generating Report',
      'failed': 'Failed',
    };
    return texts[status] || status;
  };

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
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Scan History</h2>
          <p className="text-gray-400">View all previous scan operations</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
          </div>
        ) : scans.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="py-12 text-center">
              <FileSearch className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No scan operations yet</p>
              <Button
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Start New Scan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <Card
                key={scan.scan_id}
                className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => navigate(`/scan/${scan.scan_id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">
                        {scan.filename}
                      </CardTitle>
                      <Badge variant={getStatusColor(scan.status)}>
                        {getStatusText(scan.status)}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScan(scan.scan_id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Progress:</span>
                      <span className="text-white font-semibold">{scan.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono break-all">
                      {scan.scan_id}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
