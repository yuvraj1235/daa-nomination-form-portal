import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowUp, Upload, Check, Mail, X } from 'lucide-react';

interface FormData {
  // Nominator Details
  nominatorName: string;
  nominatorAffiliation: string;
  nominatorAddress: string;
  nominatorEmail: string;
  nominatorMobile: string;
  nominatorCategory: string;
  nominationCategories: string[];
  
  // Nominee Details
  nomineeName: string;
  nomineeFatherName: string;
  nomineeDegree: string;
  nomineeBranch: string;
  nomineePassingYear: string;
  nomineeOtherQualifications: string;
  nomineeCurrentPosition: string;
  nomineePastPositions: string;
  nomineeAddress: string;
  nomineeEmail: string;
  nomineeMobile: string;
  nomineeBiography: string;
  nomineeAwards: string;
  nomineeLinkedIn: string;
  nomineeAdditionalInfo: string;
  nominatorAssessment: string;
}

const NominationForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    nominatorName: '',
    nominatorAffiliation: '',
    nominatorAddress: '',
    nominatorEmail: '',
    nominatorMobile: '',
    nominatorCategory: '',
    nominationCategories: [],
    nomineeName: '',
    nomineeFatherName: '',
    nomineeDegree: '',
    nomineeBranch: '',
    nomineePassingYear: '',
    nomineeOtherQualifications: '',
    nomineeCurrentPosition: '',
    nomineePastPositions: '',
    nomineeAddress: '',
    nomineeEmail: '',
    nomineeMobile: '',
    nomineeBiography: '',
    nomineeAwards: '',
    nomineeLinkedIn: '',
    nomineeAdditionalInfo: '',
    nominatorAssessment: '',
  });

  const [files, setFiles] = useState({
    cv: null as File | null,
    photograph: null as File | null,
    supportingDocs: [] as File[]
  });

  const [dragStates, setDragStates] = useState({
    cv: false,
    photograph: false,
    supportingDocs: false
  });

  const cvInputRef = useRef<HTMLInputElement>(null);
  const photographInputRef = useRef<HTMLInputElement>(null);
  const supportingDocsInputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      nominationCategories: checked
        ? [...prev.nominationCategories, category]
        : prev.nominationCategories.filter(c => c !== category)
    }));
  };

  const handleFileChange = (field: keyof typeof files, file: File | File[]) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleDragOver = (e: React.DragEvent, field: keyof typeof dragStates) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, field: keyof typeof dragStates) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e: React.DragEvent, field: keyof typeof files) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (field === 'supportingDocs') {
      handleFileChange(field, droppedFiles);
    } else if (droppedFiles.length > 0) {
      handleFileChange(field, droppedFiles[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    if (field === 'supportingDocs') {
      handleFileChange(field, Array.from(selectedFiles));
    } else {
      handleFileChange(field, selectedFiles[0]);
    }
  };

  const removeFile = (field: keyof typeof files, index?: number) => {
    if (field === 'supportingDocs' && typeof index === 'number') {
      const updatedFiles = [...files.supportingDocs];
      updatedFiles.splice(index, 1);
      handleFileChange(field, updatedFiles);
    } else {
      handleFileChange(field, field === 'supportingDocs' ? [] : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nominatorName || !formData.nominatorEmail || !formData.nomineeName) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Success toast
    toast({
      title: "Nomination Submitted Successfully!",
      description: "Thank you for your nomination. We will review it shortly.",
      className: "bg-emerald-600 text-white border-emerald-500"
    });

    console.log('Form submitted:', { formData, files });
  };

  const nominationCategories = [
    'Excellence in Academic & Research',
    'Excellence in Corporate & Industry',
    'Excellence in Public Administration',
    'Excellence in Entrepreneurial Venture',
    'Excellence in Service to Society'
  ];

  const degrees = ['B.E', 'B.Tech', 'M.Tech', 'PhD', 'MBA', 'MCA', 'MSW', 'MSc'];
  const identityCategories = ['Alumni', 'Faculty', 'Senate Member', 'Others'];

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-blue-900/10"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-on-scroll">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm font-medium">NIT Durgapur - CAAIR Cell</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
            Distinguished Alumni Award
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-4">
            Nomination Form
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Submit your nomination below before{' '}
            <span className="text-yellow-400 font-semibold">11th September 2023, 11:59 PM IST</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nominator Details */}
          <Card className="form-card animate-on-scroll">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-400 flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-400 font-bold">1</span>
                </div>
                Nominator Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="form-label">Full Name *</Label>
                  <Input 
                    className="form-input"
                    value={formData.nominatorName}
                    onChange={(e) => handleInputChange('nominatorName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label className="form-label">Affiliation & Designation *</Label>
                  <Input 
                    className="form-input"
                    value={formData.nominatorAffiliation}
                    onChange={(e) => handleInputChange('nominatorAffiliation', e.target.value)}
                    placeholder="Your current position and organization"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="form-label">Address *</Label>
                <Textarea 
                  className="form-input min-h-[100px]"
                  value={formData.nominatorAddress}
                  onChange={(e) => handleInputChange('nominatorAddress', e.target.value)}
                  placeholder="Your complete address"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="form-label">Email *</Label>
                  <Input 
                    type="email"
                    className="form-input"
                    value={formData.nominatorEmail}
                    onChange={(e) => handleInputChange('nominatorEmail', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label className="form-label">Mobile Number *</Label>
                  <Input 
                    type="tel"
                    className="form-input"
                    value={formData.nominatorMobile}
                    onChange={(e) => handleInputChange('nominatorMobile', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="form-label">Identity Category *</Label>
                <Select onValueChange={(value) => handleInputChange('nominatorCategory', value)}>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select your category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {identityCategories.map((category) => (
                      <SelectItem key={category} value={category} className="text-slate-200 focus:bg-slate-700">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="form-label">Category of Nomination *</Label>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  {nominationCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 border border-slate-600/30">
                      <Checkbox
                        id={category}
                        className="border-slate-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <Label htmlFor={category} className="text-sm text-slate-300 leading-tight cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nominee Details */}
          <Card className="form-card animate-on-scroll">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 font-bold">2</span>
                </div>
                Nominee Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="form-label">Full Name *</Label>
                  <Input 
                    className="form-input"
                    value={formData.nomineeName}
                    onChange={(e) => handleInputChange('nomineeName', e.target.value)}
                    placeholder="Nominee's full name"
                    required
                  />
                </div>
                <div>
                  <Label className="form-label">Father's Name</Label>
                  <Input 
                    className="form-input"
                    value={formData.nomineeFatherName}
                    onChange={(e) => handleInputChange('nomineeFatherName', e.target.value)}
                    placeholder="Father's name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="form-label">Degree *</Label>
                  <Select onValueChange={(value) => handleInputChange('nomineeDegree', value)}>
                    <SelectTrigger className="form-input">
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {degrees.map((degree) => (
                        <SelectItem key={degree} value={degree} className="text-slate-200 focus:bg-slate-700">
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="form-label">Branch / Specialization</Label>
                  <Input 
                    className="form-input"
                    value={formData.nomineeBranch}
                    onChange={(e) => handleInputChange('nomineeBranch', e.target.value)}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <Label className="form-label">Year of Passing</Label>
                  <Input 
                    type="number"
                    className="form-input"
                    value={formData.nomineePassingYear}
                    onChange={(e) => handleInputChange('nomineePassingYear', e.target.value)}
                    placeholder="e.g., 2010"
                    min="1960"
                    max="2024"
                  />
                </div>
              </div>

              <div>
                <Label className="form-label">Other Qualifications</Label>
                <Input 
                  className="form-input"
                  value={formData.nomineeOtherQualifications}
                  onChange={(e) => handleInputChange('nomineeOtherQualifications', e.target.value)}
                  placeholder="Additional degrees, certifications, etc."
                />
              </div>

              <div>
                <Label className="form-label">Present Position & Organization</Label>
                <Input 
                  className="form-input"
                  value={formData.nomineeCurrentPosition}
                  onChange={(e) => handleInputChange('nomineeCurrentPosition', e.target.value)}
                  placeholder="Current job title and company/organization"
                />
              </div>

              <div>
                <Label className="form-label">Past Positions & Organizations</Label>
                <Textarea 
                  className="form-input min-h-[100px]"
                  value={formData.nomineePastPositions}
                  onChange={(e) => handleInputChange('nomineePastPositions', e.target.value)}
                  placeholder="Previous work experience and positions held"
                />
              </div>

              <div>
                <Label className="form-label">Contact Address</Label>
                <Textarea 
                  className="form-input min-h-[100px]"
                  value={formData.nomineeAddress}
                  onChange={(e) => handleInputChange('nomineeAddress', e.target.value)}
                  placeholder="Complete contact address"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="form-label">Email</Label>
                  <Input 
                    type="email"
                    className="form-input"
                    value={formData.nomineeEmail}
                    onChange={(e) => handleInputChange('nomineeEmail', e.target.value)}
                    placeholder="nominee@example.com"
                  />
                </div>
                <div>
                  <Label className="form-label">Mobile Number</Label>
                  <Input 
                    type="tel"
                    className="form-input"
                    value={formData.nomineeMobile}
                    onChange={(e) => handleInputChange('nomineeMobile', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <Label className="form-label">Biography / Achievements (500 words max)</Label>
                <Textarea 
                  className="form-input min-h-[150px]"
                  value={formData.nomineeBiography}
                  onChange={(e) => handleInputChange('nomineeBiography', e.target.value)}
                  placeholder="Detailed biography and major achievements"
                  maxLength={500}
                />
                <div className="text-right text-sm text-slate-400 mt-1">
                  {formData.nomineeBiography.length}/500 words
                </div>
              </div>

              <div>
                <Label className="form-label">Awards / Recognitions</Label>
                <Textarea 
                  className="form-input min-h-[100px]"
                  value={formData.nomineeAwards}
                  onChange={(e) => handleInputChange('nomineeAwards', e.target.value)}
                  placeholder="List of awards, honors, and recognitions received"
                />
              </div>

              <div>
                <Label className="form-label">LinkedIn / Web Profile</Label>
                <Input 
                  type="url"
                  className="form-input"
                  value={formData.nomineeLinkedIn}
                  onChange={(e) => handleInputChange('nomineeLinkedIn', e.target.value)}
                  placeholder="https://linkedin.com/in/profile or website URL"
                />
              </div>

              <div>
                <Label className="form-label">Additional Information</Label>
                <Textarea 
                  className="form-input min-h-[100px]"
                  value={formData.nomineeAdditionalInfo}
                  onChange={(e) => handleInputChange('nomineeAdditionalInfo', e.target.value)}
                  placeholder="Any other relevant information"
                />
              </div>

              <div>
                <Label className="form-label">Nominator's Critical Assessment *</Label>
                <Textarea 
                  className="form-input min-h-[150px]"
                  value={formData.nominatorAssessment}
                  onChange={(e) => handleInputChange('nominatorAssessment', e.target.value)}
                  placeholder="Your detailed assessment of why this nominee deserves the Distinguished Alumni Award"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card className="form-card animate-on-scroll">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4 text-yellow-400" />
                </div>
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* CV Upload */}
                <div>
                  <Label className="form-label">Upload CV</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                      dragStates.cv 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : 'border-slate-600 hover:border-yellow-400'
                    }`}
                    onDragOver={(e) => handleDragOver(e, 'cv')}
                    onDragLeave={(e) => handleDragLeave(e, 'cv')}
                    onDrop={(e) => handleDrop(e, 'cv')}
                    onClick={() => cvInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 mb-1">
                      {dragStates.cv ? 'Drop CV file here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-slate-500">PDF, DOC, DOCX (Max 10MB)</p>
                    <Input 
                      ref={cvInputRef}
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="hidden" 
                      onChange={(e) => handleFileInputChange(e, 'cv')}
                    />
                  </div>
                  {files.cv && (
                    <div className="mt-2 p-2 bg-slate-700/30 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-slate-300 truncate">{files.cv.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('cv')}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Photograph Upload */}
                <div>
                  <Label className="form-label">Upload Photograph</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                      dragStates.photograph 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : 'border-slate-600 hover:border-yellow-400'
                    }`}
                    onDragOver={(e) => handleDragOver(e, 'photograph')}
                    onDragLeave={(e) => handleDragLeave(e, 'photograph')}
                    onDrop={(e) => handleDrop(e, 'photograph')}
                    onClick={() => photographInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 mb-1">
                      {dragStates.photograph ? 'Drop image here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-slate-500">JPG, PNG, JPEG (Max 5MB)</p>
                    <Input 
                      ref={photographInputRef}
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      className="hidden"
                      onChange={(e) => handleFileInputChange(e, 'photograph')}
                    />
                  </div>
                  {files.photograph && (
                    <div className="mt-2 p-2 bg-slate-700/30 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-slate-300 truncate">{files.photograph.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('photograph')}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Supporting Documents Upload */}
              <div>
                <Label className="form-label">Upload Supporting Documents</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                    dragStates.supportingDocs 
                      ? 'border-yellow-400 bg-yellow-400/10' 
                      : 'border-slate-600 hover:border-yellow-400'
                  }`}
                  onDragOver={(e) => handleDragOver(e, 'supportingDocs')}
                  onDragLeave={(e) => handleDragLeave(e, 'supportingDocs')}
                  onDrop={(e) => handleDrop(e, 'supportingDocs')}
                  onClick={() => supportingDocsInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400 mb-1">
                    {dragStates.supportingDocs ? 'Drop files here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-500">Multiple files supported: PDF, DOC, JPG, PNG (Max 10MB each)</p>
                  <Input 
                    ref={supportingDocsInputRef}
                    type="file" 
                    multiple 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                    className="hidden"
                    onChange={(e) => handleFileInputChange(e, 'supportingDocs')}
                  />
                </div>
                {files.supportingDocs.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.supportingDocs.map((file, index) => (
                      <div key={index} className="p-2 bg-slate-700/30 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-slate-300 truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('supportingDocs', index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <div className="text-center animate-on-scroll">
            <Button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
            >
              <Check className="w-5 h-5 mr-2" />
              Submit Nomination
            </Button>
            <p className="text-slate-400 mt-4 text-sm">
              Please ensure all required fields are filled before submitting
            </p>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-16 text-center space-y-4 animate-on-scroll">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Mail className="w-4 h-4" />
            <span>Need help? Contact: </span>
            <a href="mailto:caair@admin.nitdgp.ac.in" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              caair@admin.nitdgp.ac.in
            </a>
          </div>
          <div className="text-slate-500 text-sm">
            © NIT Durgapur – CAAIR Cell
          </div>
        </footer>

        {/* Scroll to Top Button */}
        <Button 
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 backdrop-blur-sm transition-all duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="w-5 h-5 text-emerald-400" />
        </Button>
      </div>
    </div>
  );
};

export default NominationForm;
