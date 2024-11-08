import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const EditPatientProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    height: '',
    weight: '',
    personalHistory: '',
    familyHistory: '',
    allergies: '',
    medications: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (!currentUser?.uid) return;
        
        const patientRef = doc(db, 'patients', currentUser.uid);
        const patientSnap = await getDoc(patientRef);
        
        if (patientSnap.exists()) {
          const data = patientSnap.data();
          setFormData({
            name: data.name || '',
            gender: data.gender || '',
            dob: data.dob || '',
            height: data.height || '',
            weight: data.weight || '',
            personalHistory: data.personalHistory || '',
            familyHistory: data.familyHistory || '',
            allergies: data.allergies || '',
            medications: data.medications || '',
            remarks: data.remarks || ''
          });
        } else {
          setError('No patient data found');
        }
      } catch (err) {
        setError('Error fetching patient data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const patientRef = doc(db, 'patients', currentUser.uid);
      
      // Prepare the update data
      const updateData = {
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        personalHistory: formData.personalHistory,
        familyHistory: formData.familyHistory,
        allergies: formData.allergies,
        medications: formData.medications,
        remarks: formData.remarks,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(patientRef, updateData);
      setSuccess('Profile updated successfully!');
      
      // Wait a moment to show the success message
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 bg-blue-500">
            <h3 className="text-lg leading-6 font-medium text-white">
              Edit Profile
            </h3>
            <p className="mt-1 text-sm text-blue-50">
              Update your personal information and medical history
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                {success}
              </div>
            )}

            <div className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender *
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Date of Birth Field */}
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dob"
                      id="dob"
                      required
                      className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Height and Weight Fields */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        id="height"
                        step="0.1"
                        min="0"
                        className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Height in centimeters"
                      />
                    </div>

                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        step="0.1"
                        min="0"
                        className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Weight in kilograms"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical History Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Medical History</h4>
                <div className="space-y-4">
                  {/* Personal History Field */}
                  <div>
                    <label htmlFor="personalHistory" className="block text-sm font-medium text-gray-700">
                      Personal Medical History
                    </label>
                    <textarea
                      name="personalHistory"
                      id="personalHistory"
                      rows={3}
                      className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.personalHistory}
                      onChange={handleChange}
                      placeholder="Enter any relevant personal medical history"
                    />
                  </div>

                  {/* Family History Field */}
                  <div>
                    <label htmlFor="familyHistory" className="block text-sm font-medium text-gray-700">
                      Family Medical History
                    </label>
                    <textarea
                      name="familyHistory"
                      id="familyHistory"
                      rows={3}
                      className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.familyHistory}
                      onChange={handleChange}
                      placeholder="Enter relevant family medical history"
                    />
                  </div>

                  {/* Allergies Field */}
                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                      Allergies
                    </label>
                    <textarea
                      name="allergies"
                      id="allergies"
                      rows={2}
                      className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="List any allergies"
                    />
                  </div>

                  {/* Medications Field */}
                  <div>
                    <label htmlFor="medications" className="block text-sm font-medium text-gray-700">
                      Current Medications
                    </label>
                    <textarea
                      name="medications"
                      id="medications"
                      rows={2}
                      className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.medications}
                      onChange={handleChange}
                      placeholder="List current medications"
                    />
                  </div>

                  {/* Remarks Field */}
                  <div>
                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                      Additional Remarks
                    </label>
                    <textarea
                      name="remarks"
                      id="remarks"
                      rows={2}
                      className="mt-1 block w-full shadow-sm sm:text-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Any additional information or remarks"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatientProfile;