import React, { useState } from 'react';

// Main App Component
const App = () => {
    // State to hold all form data in a single object
    const [formData, setFormData] = useState({
        fullName: '',
        admissionNumber: '',
        englishCA: '',
        englishExam: '',
        mathematicsCA: '',
        mathematicsExam: '',
        geographyCA: '',
        geographyExam: '',
        biologyCA: '',
        biologyExam: '',
        civicCA: '',
        civicExam: '',
        chemistryCA: '',
        chemistryExam: '',
        arabicCA: '',
        arabicExam: '',
        hausaCA: '',
        hausaExam: '',
        homeEconomicsCA: '',
        homeEconomicsExam: '',
        elementaryScienceCA: '',
        elementaryScienceExam: '',
    });

    // State to hold validation errors
    const [errors, setErrors] = useState({});
    // State to manage submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    // --- UTILITY FUNCTIONS ---

    /**
     * A generic change handler for all input fields.
     * Updates the formData state based on the input's name attribute.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    /**
     * Validates the entire form.
     * @returns {Object} An object containing error messages for invalid fields.
     */
    const validateForm = () => {
        const newErrors = {};

        // Required text fields
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
        if (!formData.admissionNumber.trim()) newErrors.admissionNumber = 'Admission Number is required.';

        // Score fields validation (checks if they are numbers and within 0-100 range)
        Object.keys(formData).forEach(key => {
            if (key.includes('CA') || key.includes('Exam')) {
                const score = Number(formData[key]);
                if (formData[key] === '') {
                    newErrors[key] = 'Score is required.';
                } else if (isNaN(score) || score < 0 || score > 100) {
                    newErrors[key] = 'Score must be a number between 0 and 100.';
                }
            }
        });

        return newErrors;
    };

    /**
     * Handles the form submission process.
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        setErrors(validationErrors);
        setSubmitMessage('');

        // If there are no errors, proceed with submission
        if (Object.keys(validationErrors).length === 0) {
            const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim();
            if (!scriptUrl) {
                setSubmitMessage('Google Apps Script is not configured. Set VITE_GOOGLE_APPS_SCRIPT_URL and restart the app.');
                return;
            }

            setIsSubmitting(true);

            try {
                await fetch(scriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    redirect: 'follow',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(formData)
                });

                setSubmitMessage('Scores submitted successfully!');

            } catch (error) {
                console.error('Submission Error:', error);
                setSubmitMessage('Failed to submit scores. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            console.log('Validation failed:', validationErrors);
        }
    };

    // --- JSX RENDER ---

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-cyan-400">Student Score Entry</h1>
                <p className="text-center text-gray-400 mb-8">Enter the scores for each subject component.</p>

                <form onSubmit={handleSubmit} noValidate>
                    {/* --- Student Details Section --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                                placeholder="e.g., Binta Bello"
                            />
                            {errors.fullName && <p className="text-red-400 text-xs mt-2">{errors.fullName}</p>}
                        </div>
                        {/* Admission Number */}
                        <div>
                            <label htmlFor="admissionNumber" className="block text-sm font-medium text-gray-300 mb-2">Admission Number</label>
                            <input
                                type="text"
                                id="admissionNumber"
                                name="admissionNumber"
                                value={formData.admissionNumber}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                                placeholder="e.g., SCH/23/001"
                            />
                            {errors.admissionNumber && <p className="text-red-400 text-xs mt-2">{errors.admissionNumber}</p>}
                        </div>
                    </div>

                    {/* --- Subjects Section --- */}
                    <div className="space-y-6">
                        {renderSubjectInputs('English', 'english', formData, handleChange, errors)}
                        {renderSubjectInputs('Mathematics', 'mathematics', formData, handleChange, errors)}
                        {renderSubjectInputs('Geography', 'geography', formData, handleChange, errors)}
                        {renderSubjectInputs('Biology', 'biology', formData, handleChange, errors)}
                        {renderSubjectInputs('Civic Education', 'civic', formData, handleChange, errors)}
                        {renderSubjectInputs('Chemistry', 'chemistry', formData, handleChange, errors)}
                        {renderSubjectInputs('Arabic', 'arabic', formData, handleChange, errors)}
                        {renderSubjectInputs('Hausa', 'hausa', formData, handleChange, errors)}
                        {renderSubjectInputs('Home Economics', 'homeEconomics', formData, handleChange, errors)}
                        {renderSubjectInputs('Elementary Science', 'elementaryScience', formData, handleChange, errors)}
                    </div>

                    {/* --- Submission Feedback --- */}
                    {submitMessage && (
                        <div className={`text-center p-3 mt-8 rounded-lg ${submitMessage.includes('successfully') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {submitMessage}
                        </div>
                    )}

                    {/* --- Submit Button --- */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-8 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : 'Submit Scores'}
                    </button>
                </form>
            </div>
        </div>
    );
};

/**
 * A helper component to render the CA and Exam inputs for a single subject.
 * This reduces code duplication.
 * @param {string} subjectName - The display name of the subject (e.g., "Mathematics").
 * @param {string} subjectKey - The key used in the state (e.g., "mathematics").
 * @param {Object} formData - The current form data state.
 * @param {Function} handleChange - The function to handle input changes.
 * @param {Object} errors - The current errors state.
 * @returns {JSX.Element}
 */
const renderSubjectInputs = (subjectName, subjectKey, formData, handleChange, errors) => {
    const caKey = `${subjectKey}CA`;
    const examKey = `${subjectKey}Exam`;

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">{subjectName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CA Score */}
                <div>
                    <label htmlFor={caKey} className="block text-sm font-medium text-gray-400 mb-2">CA Score</label>
                    <input
                        type="number"
                        id={caKey}
                        name={caKey}
                        value={formData[caKey]}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                        placeholder="e.g., 25"
                    />
                    {errors[caKey] && <p className="text-red-400 text-xs mt-2">{errors[caKey]}</p>}
                </div>
                {/* Exam Score */}
                <div>
                    <label htmlFor={examKey} className="block text-sm font-medium text-gray-400 mb-2">Exam Score</label>
                    <input
                        type="number"
                        id={examKey}
                        name={examKey}
                        value={formData[examKey]}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                        placeholder="e.g., 60"
                    />
                    {errors[examKey] && <p className="text-red-400 text-xs mt-2">{errors[examKey]}</p>}
                </div>
            </div>
        </div>
    );
};


export default App;
