import React, { useState } from 'react';
import { Calculator, FileText, CheckCircle, BriefcaseIcon, Building2, AlertCircle } from 'lucide-react';

interface LoanDetails {
  amount: number;
  term: number;
  purpose: string;
  loanType: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationalId: string;
  address: string;
  employmentStatus: string;
  employerName: string;
  monthlyIncome: number;
  collateralType: string;
  collateralValue: number;
  hasExistingLoan: boolean;
  existingLoanAmount?: number;
}

function App() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    amount: 1000,
    term: 12,
    purpose: '',
    loanType: 'personal',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationalId: '',
    address: '',
    employmentStatus: 'employed',
    employerName: '',
    monthlyIncome: 0,
    collateralType: 'none',
    collateralValue: 0,
    hasExistingLoan: false,
    existingLoanAmount: 0,
  });

  const loanTypes = {
    personal: { maxAmount: 50000, minIncome: 1000, interestRate: 0.25 },
    business: { maxAmount: 100000, minIncome: 2000, interestRate: 0.20 },
    education: { maxAmount: 30000, minIncome: 800, interestRate: 0.15 },
  };

  const getInterestRate = () => {
    const baseRate = loanTypes[loanDetails.loanType as keyof typeof loanTypes].interestRate;
    let rate = baseRate;
    
    // Adjust rate based on collateral
    if (loanDetails.collateralType !== 'none') {
      rate -= 0.02;
    }
    
    // Adjust rate based on employment and income
    if (loanDetails.monthlyIncome > 5000) {
      rate -= 0.01;
    }
    
    return rate;
  };

  const calculateMonthlyPayment = () => {
    const monthlyRate = getInterestRate() / 12;
    const payment = (loanDetails.amount * monthlyRate * Math.pow(1 + monthlyRate, loanDetails.term)) / 
                   (Math.pow(1 + monthlyRate, loanDetails.term) - 1);
    return payment.toFixed(2);
  };

  const totalPayment = (parseFloat(calculateMonthlyPayment()) * loanDetails.term).toFixed(2);

  const validateApplication = () => {
    const newErrors: string[] = [];
    const age = new Date().getFullYear() - new Date(loanDetails.dateOfBirth).getFullYear();
    
    if (age < 18) {
      newErrors.push("You must be at least 18 years old to apply");
    }

    if (loanDetails.monthlyIncome < loanTypes[loanDetails.loanType as keyof typeof loanTypes].minIncome) {
      newErrors.push(`Minimum monthly income requirement not met for ${loanDetails.loanType} loan`);
    }

    if (loanDetails.amount > loanTypes[loanDetails.loanType as keyof typeof loanTypes].maxAmount) {
      newErrors.push(`Maximum loan amount exceeded for ${loanDetails.loanType} loan`);
    }

    const monthlyPayment = parseFloat(calculateMonthlyPayment());
    if (monthlyPayment > loanDetails.monthlyIncome * 0.4) {
      newErrors.push("Monthly payment cannot exceed 40% of monthly income");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateApplication()) {
      setStep(step + 1);
    }
  };

  const formatCedi = (amount: string | number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(Number(amount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto pt-10 px-4 pb-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex space-x-8">
              <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                <Calculator className="w-6 h-6 mr-2" />
                <span className="font-semibold">Calculate</span>
              </div>
              <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                <FileText className="w-6 h-6 mr-2" />
                <span className="font-semibold">Apply</span>
              </div>
              <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-semibold">Confirm</span>
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-red-800 font-semibold">Please correct the following:</h3>
              </div>
              <ul className="list-disc list-inside text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">Loan Calculator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Type</label>
                  <select
                    value={loanDetails.loanType}
                    onChange={(e) => setLoanDetails({...loanDetails, loanType: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="business">Business Loan</option>
                    <option value="education">Education Loan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Amount (GH₵)</label>
                  <input
                    type="number"
                    value={loanDetails.amount}
                    onChange={(e) => setLoanDetails({...loanDetails, amount: Number(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="1000"
                    max={loanTypes[loanDetails.loanType as keyof typeof loanTypes].maxAmount}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum: {formatCedi(loanTypes[loanDetails.loanType as keyof typeof loanTypes].maxAmount)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Term (Months)</label>
                  <input
                    type="number"
                    value={loanDetails.term}
                    onChange={(e) => setLoanDetails({...loanDetails, term: Number(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    min="6"
                    max="60"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Payment:</p>
                      <p className="text-lg font-bold text-green-600">{formatCedi(calculateMonthlyPayment())}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Payment:</p>
                      <p className="text-lg font-bold text-green-600">{formatCedi(totalPayment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Interest Rate:</p>
                      <p className="text-lg font-bold text-green-600">{(getInterestRate() * 100).toFixed(1)}% per annum</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Processing Fee:</p>
                      <p className="text-lg font-bold text-green-600">{formatCedi(loanDetails.amount * 0.02)}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Continue to Application
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">Loan Application</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        required
                        value={loanDetails.name}
                        onChange={(e) => setLoanDetails({...loanDetails, name: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={loanDetails.dateOfBirth}
                        onChange={(e) => setLoanDetails({...loanDetails, dateOfBirth: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">National ID Number</label>
                      <input
                        type="text"
                        required
                        value={loanDetails.nationalId}
                        onChange={(e) => setLoanDetails({...loanDetails, nationalId: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={loanDetails.phone}
                        onChange={(e) => setLoanDetails({...loanDetails, phone: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        required
                        value={loanDetails.email}
                        onChange={(e) => setLoanDetails({...loanDetails, email: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Residential Address</label>
                      <textarea
                        required
                        value={loanDetails.address}
                        onChange={(e) => setLoanDetails({...loanDetails, address: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    Employment & Income
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                      <select
                        required
                        value={loanDetails.employmentStatus}
                        onChange={(e) => setLoanDetails({...loanDetails, employmentStatus: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      >
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="business-owner">Business Owner</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {loanDetails.employmentStatus === 'self-employed' ? 'Business Name' : 'Employer Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={loanDetails.employerName}
                        onChange={(e) => setLoanDetails({...loanDetails, employerName: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monthly Income (GH₵)</label>
                      <input
                        type="number"
                        required
                        value={loanDetails.monthlyIncome}
                        onChange={(e) => setLoanDetails({...loanDetails, monthlyIncome: Number(e.target.value)})}
                        className="mt-1 block w-full rounded-md"
                        min={loanTypes[loanDetails.loanType as keyof typeof loanTypes].minIncome}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Collateral & Existing Loans
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Collateral Type</label>
                      <select
                        value={loanDetails.collateralType}
                        onChange={(e) => setLoanDetails({...loanDetails, collateralType: e.target.value})}
                        className="mt-1 block w-full rounded-md"
                      >
                        <option value="none">No Collateral</option>
                        <option value="property">Property</option>
                        <option value="vehicle">Vehicle</option>
                        <option value="investment">Investment/Savings</option>
                      </select>
                    </div>
                    {loanDetails.collateralType !== 'none' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Collateral Value (GH₵)</label>
                        <input
                          type="number"
                          required
                          value={loanDetails.collateralValue}
                          onChange={(e) => setLoanDetails({...loanDetails, collateralValue: Number(e.target.value)})}
                          className="mt-1 block w-full rounded-md"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={loanDetails.hasExistingLoan}
                          onChange={(e) => setLoanDetails({...loanDetails, hasExistingLoan: e.target.checked})}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">I have existing loans</span>
                      </label>
                    </div>
                    {loanDetails.hasExistingLoan && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Existing Loan Amount (GH₵)</label>
                        <input
                          type="number"
                          required
                          value={loanDetails.existingLoanAmount}
                          onChange={(e) => setLoanDetails({...loanDetails, existingLoanAmount: Number(e.target.value)})}
                          className="mt-1 block w-full rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Loan Purpose</h3>
                  <textarea
                    required
                    value={loanDetails.purpose}
                    onChange={(e) => setLoanDetails({...loanDetails, purpose: e.target.value})}
                    className="mt-1 block w-full rounded-md"
                    rows={3}
                    placeholder="Please describe how you plan to use the loan..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-800">Application Submitted!</h2>
              <p className="text-gray-600">
                Thank you for your loan application. Our team will review your application and contact you within 24-48 hours.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h3 className="font-semibold mb-2">Application Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-left">Loan Type:</div>
                  <div className="text-right font-semibold capitalize">{loanDetails.loanType} Loan</div>
                  <div className="text-left">Loan Amount:</div>
                  <div className="text-right font-semibold">{formatCedi(loanDetails.amount)}</div>
                  <div className="text-left">Monthly Payment:</div>
                  <div className="text-right font-semibold">{formatCedi(calculateMonthlyPayment())}</div>
                  <div className="text-left">Loan Term:</div>
                  <div className="text-right font-semibold">{loanDetails.term} months</div>
                  <div className="text-left">Interest Rate:</div>
                  <div className="text-right font-semibold">{(getInterestRate() * 100).toFixed(1)}% per annum</div>
                  <div className="text-left">Processing Fee:</div>
                  <div className="text-right font-semibold">{formatCedi(loanDetails.amount * 0.02)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;