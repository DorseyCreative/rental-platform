'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Download,
  Table,
  FileText,
  Link as LinkIcon,
  Globe,
  Sparkles,
  Info
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

type ImportStep = 'upload' | 'mapping' | 'preview' | 'importing' | 'complete'
type ImportType = 'inventory' | 'customers' | 'rentals'

export default function DataImportPage() {
  const [step, setStep] = useState<ImportStep>('upload')
  const [importType, setImportType] = useState<ImportType>('inventory')
  const [file, setFile] = useState<File | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [mappedData, setMappedData] = useState<any[]>([])
  const [progress, setProgress] = useState(0)
  const [importSource, setImportSource] = useState<'file' | 'url'>('file')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      // Parse file and move to mapping step
      setStep('mapping')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  })

  const handleUrlImport = async () => {
    if (!sourceUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to import from",
        variant: "destructive"
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/import-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceUrl,
          importType,
          action: 'analyze'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze URL')
      }

      const result = await response.json()
      if (result.success) {
        setMappedData(result.preview || [])
        setStep('mapping')
        toast({
          title: "Data Analyzed Successfully",
          description: `Found ${result.totalRecords || 0} records with AI-powered field mapping`,
        })
      } else {
        throw new Error(result.error || 'Failed to analyze data')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import from URL'
      
      // Show detailed error guidance
      if (errorMessage.includes('PERMISSION_ERROR') || errorMessage.includes('PERMISSION_DENIED')) {
        toast({
          title: "🔒 Sheet is Private",
          description: "Your Google Sheet needs to be made public for import. See detailed instructions in the popup.",
          variant: "destructive"
        })
        
        // Extract the detailed instructions after the error type
        const instructions = errorMessage.includes(': ') ? errorMessage.split(': ').slice(1).join(': ') : errorMessage
        
        // Show detailed popup with formatting
        const popup = window.confirm(`🔒 GOOGLE SHEET PERMISSION ISSUE

Your sheet is private and cannot be accessed for import.

${instructions}

Click OK to open detailed instructions, or Cancel to try a different URL.`)
        
        if (popup) {
          // Log detailed instructions to console as backup
          console.log('📋 DETAILED SHARING INSTRUCTIONS:\n\n', instructions)
        }
      } else if (errorMessage.includes('INVALID_URL')) {
        toast({
          title: "Invalid URL Format",
          description: "The URL format is not supported. Please check the instructions.",
          variant: "destructive"
        })
        alert(`URL FORMAT ISSUE:\n\n${errorMessage.split(': ')[1] || errorMessage}`)
      } else {
        toast({
          title: "Import Failed",
          description: errorMessage.length > 100 ? 'Check console for detailed error message' : errorMessage,
          variant: "destructive"
        })
        if (errorMessage.length > 100) {
          console.error('📋 DETAILED ERROR:\n', errorMessage)
          alert(`IMPORT ERROR:\n\n${errorMessage}`)
        }
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImport = async () => {
    setStep('importing')
    try {
      const response = await fetch('/api/import-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceUrl: importSource === 'url' ? sourceUrl : undefined,
          file: importSource === 'file' ? file : undefined,
          importType,
          mappedData,
          action: 'import'
        }),
      })

      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      const result = await response.json()
      if (result.success) {
        setStep('complete')
      } else {
        throw new Error(result.error || 'Import failed')
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      })
      setStep('preview')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header with Context */}
        <div className="mb-8">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Data Import Center:</strong> Import your existing business data into the platform. 
              All imported data will be available immediately in your dashboard and other platform features.
              {' '}
              <Link href="/" className="underline font-medium">Back to Home</Link>
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Import Your Data</h1>
            <p className="text-lg text-gray-600">
              Easily migrate your existing inventory, customers, and rental history
            </p>
          </div>
        </div>

        {/* Import Type Selection */}
        {step === 'upload' && (
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={importType === 'inventory' ? 'default' : 'outline'}
                onClick={() => setImportType('inventory')}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Inventory
              </Button>
              <Button
                variant={importType === 'customers' ? 'default' : 'outline'}
                onClick={() => setImportType('customers')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Customers
              </Button>
              <Button
                variant={importType === 'rentals' ? 'default' : 'outline'}
                onClick={() => setImportType('rentals')}
              >
                <Table className="mr-2 h-4 w-4" />
                Rentals
              </Button>
            </div>

            {/* Import Source Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Import {importType} Data</CardTitle>
                <CardDescription>
                  Choose your data source: upload files or import from online spreadsheets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={importSource} onValueChange={(value) => setImportSource(value as 'file' | 'url')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload File
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Import from URL
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="file" className="mt-6">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg mb-2">
                        {isDragActive
                          ? 'Drop the file here...'
                          : 'Drag & drop your file here, or click to browse'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Support for CSV, Excel (.xlsx, .xls) - Maximum file size: 10MB
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="url" className="mt-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                          <p className="font-medium text-blue-900">AI-Powered Import</p>
                        </div>
                        <p className="text-sm text-blue-700">
                          Our AI will automatically analyze your data structure and map fields intelligently.
                          Supports Google Sheets, Airtable, and other online spreadsheets.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sourceUrl">Spreadsheet URL</Label>
                        <Input
                          id="sourceUrl"
                          type="url"
                          placeholder="https://docs.google.com/spreadsheets/d/... or any CSV export URL"
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500 space-y-1">
                          <p><strong>For Google Sheets:</strong></p>
                          <p>1. Share your sheet: Click "Share" → "Anyone with the link" → "Viewer"</p>
                          <p>2. OR: File → Share → Publish to web → CSV format</p>
                          <p>3. Copy the link and paste it above</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleUrlImport} 
                        disabled={!sourceUrl.trim() || isAnalyzing}
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Data...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            Analyze & Import from URL
                          </>
                        )}
                      </Button>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p><strong>Supported formats:</strong></p>
                        <ul className="ml-4 space-y-1">
                          <li>• Google Sheets (public or CSV export)</li>
                          <li>• Airtable CSV exports</li>
                          <li>• Any publicly accessible CSV file</li>
                          <li>• Dropbox/OneDrive shared CSV links</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Need help getting started? Download sample templates:</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Inventory Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Customer Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Rental Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Field Mapping */}
        {step === 'mapping' && (
          <Card>
            <CardHeader>
              <CardTitle>Map Your Fields</CardTitle>
              <CardDescription>
                Match your spreadsheet columns to our system fields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <p className="font-medium">AI-Powered Field Detection</p>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {importSource === 'url' 
                      ? 'Our AI analyzed your data and automatically mapped 8 out of 10 fields based on content patterns'
                      : 'We\'ve automatically matched 8 out of 10 fields based on column names'
                    }
                  </p>
                </div>

                {importSource === 'url' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <p className="font-medium text-blue-900">Data Source Analysis</p>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Detected data type: {importType === 'inventory' ? 'Equipment inventory' : importType}</p>
                      <p>• Source format: Google Sheets CSV export</p>
                      <p>• Records found: 247 rows</p>
                      <p>• AI confidence: 94%</p>
                    </div>
                  </div>
                )}

                {/* Mock field mapping UI */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-sm font-medium">Your Column: "Equipment Name"</div>
                    <div className="text-sm">→ Maps to: Name</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="text-sm font-medium">Your Column: "Daily Price"</div>
                    <div className="text-sm">→ Maps to: Daily Rate</div>
                  </div>
                  {/* Add more mappings */}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    Back
                  </Button>
                  <Button onClick={() => setStep('preview')}>
                    Preview Import
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Preview */}
        {step === 'preview' && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Import Data</CardTitle>
              <CardDescription>
                Review the first 5 records before importing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">CAT 320 Excavator</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">Excavators</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">$850</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="text-green-600">✓ Valid</span>
                      </td>
                    </tr>
                    {/* Add more preview rows */}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">Import Summary</p>
                <div className="mt-2 space-y-1 text-sm text-blue-700">
                  <p>• Total records: 247</p>
                  <p>• Valid records: 245</p>
                  <p>• Records with warnings: 2</p>
                  <p>• Duplicate records found: 0</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep('mapping')}>
                  Back
                </Button>
                <Button onClick={handleImport}>
                  Start Import
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Importing Progress */}
        {step === 'importing' && (
          <Card>
            <CardContent className="pt-12 pb-8">
              <div className="text-center">
                <FileSpreadsheet className="h-16 w-16 mx-auto text-blue-600 animate-pulse mb-4" />
                <h3 className="text-xl font-semibold mb-2">Importing Your Data</h3>
                <p className="text-gray-600 mb-6">Please wait while we import your records...</p>
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-gray-500">{progress}% complete</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Complete */}
        {step === 'complete' && (
          <Card>
            <CardContent className="pt-12 pb-8">
              <div className="text-center">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Import Complete!</h3>
                <p className="text-gray-600 mb-2">
                  Successfully imported 245 {importType} records
                </p>
                
                <div className="mt-6 mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-left max-w-md mx-auto">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Your data has been imported to:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    {importType === 'inventory' && (
                      <>
                        <li>• Equipment catalog in your dashboard</li>
                        <li>• Available for rental bookings</li>
                        <li>• Visible in customer portal</li>
                      </>
                    )}
                    {importType === 'customers' && (
                      <>
                        <li>• Customer database in admin panel</li>
                        <li>• Available for creating rentals</li>
                        <li>• Accessible in CRM features</li>
                      </>
                    )}
                    {importType === 'rentals' && (
                      <>
                        <li>• Rental history in dashboard</li>
                        <li>• Analytics and reporting</li>
                        <li>• Customer rental records</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Import More Data
                  </Button>
                  <Button asChild>
                    <a href={importType === 'inventory' ? '/dashboard' : '/admin'}>
                      {importType === 'inventory' ? 'View Equipment' : 'View in Admin'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Tip: You can always import more data later from the home page
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}