import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getCourseAssessments } from '../../../services/businessCentralApi';

const AssessmentForm = ({ assessment, onSubmit, onCancel }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch questions on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);

                // console.log('[DEBUG] Fetching questions for course:', assessment?.courseId);
                const questionsData = await getCourseAssessments(assessment?.courseId);

                if (questionsData && questionsData.length > 0) {
                    setQuestions(questionsData);
                    // Initialize timer if assessment has duration
                    // if (assessment?.duration) {
                    //     setTimeRemaining(assessment.duration * 60); // Convert minutes to seconds
                    // }
                    console.log('[DEBUG] Loaded questions:', questionsData);
                } else {
                    setError('No questions found for this assessment');
                }
            } catch (err) {
                console.error('[DEBUG] Error fetching questions:', err);
                setError('Failed to load assessment questions: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (assessment?.courseId) {
            fetchQuestions();
        }
    }, [assessment]);

    // Timer countdown effect
    // useEffect(() => {
    //     if (timeRemaining > 0) {
    //         const timer = setTimeout(() => {
    //             setTimeRemaining(timeRemaining - 1);
    //         }, 1000);
    //         return () => clearTimeout(timer);
    //     } else if (timeRemaining === 0) {
    //         handleSubmitAssessment();
    //     }
    // }, [timeRemaining]);

    // Handle answer change
    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Handle assessment submission
    const handleSubmitAssessment = async () => {
        if (isSubmitting) return;

        const unansweredQuestions = questions.filter(q => !answers[q.id] || answers[q.id].trim() === '');
        if (unansweredQuestions.length > 0 && timeRemaining > 0) {
            const confirmed = window.confirm(
                `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
            );
            if (!confirmed) return;
        }

        setIsSubmitting(true);
        try {
            console.log('assessmentCourseId from assessmentForm.jsx: ',assessment?.courseId)
            const submissionData = {
                // assessmentId: assessment?.id,
                courseId: assessment?.courseId,
                bookingId: assessment?.bookingId,
                courseTitle: assessment?.courseName,
                resourceId: assessment?.resourceId,
                answers: questions.map(q => ({
                    questionNo: q.questionNo,
                    question: q.question,
                    answer: answers[q.id] || ''
                })),
                submittedAt: new Date().toISOString(),
                // timeUsed: assessment?.duration ? (assessment.duration * 60 - (timeRemaining || 0)) : 0
            };

            // console.log('[DEBUG] Submitting assessment:', submissionData);
            await onSubmit(submissionData);
        } catch (err) {
            console.error('Error submitting assessment:', err);
            alert('Failed to submit assessment: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Loading state
    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6">
                    <div className="text-center py-8">
                        <Icon name="Loader2" size={32} className="mx-auto mb-4 animate-spin text-primary" />
                        <h3 className="text-lg font-medium text-authority-charcoal mb-2">
                            Loading Assessment Questions
                        </h3>
                        <p className="text-professional-gray">
                            Fetching questions from Business Central...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                    <div className="text-center">
                        <Icon name="AlertCircle" size={32} className="mx-auto mb-4 text-error" />
                        <h3 className="text-lg font-medium text-authority-charcoal mb-2">
                            Assessment Loading Error
                        </h3>
                        <p className="text-professional-gray mb-6">{error}</p>
                        <div className="flex space-x-3">
                            <Button variant="outline" onClick={onCancel} fullWidth>
                                Close
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => window.location.reload()}
                                fullWidth
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;
    const answeredCount = Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">{assessment?.courseName}</h2>
                            <p className="opacity-90">{assessment?.type}</p>
                        </div>
                        <div className="text-right">
                            {/* {timeRemaining !== null && (
                                <div className="text-2xl font-bold">
                                    {formatTime(timeRemaining)}
                                </div>
                            )} */}
                            <div className="text-sm opacity-90">
                                {answeredCount} of {questions.length} answered
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {/* <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div> */}
                </div>

                {/* Questions Content */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
                    <div className="space-y-8">
                        {questions.map((question, index) => (
                            <div key={question.id} className="bg-background rounded-lg p-6 border border-border">
                                <div className="flex items-start space-x-4">
                                    {/* Question Number */}
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>

                                    {/* Question Content */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-authority-charcoal mb-4">
                                            {question.question}
                                        </h3>

                                        {/* Text Area for Answer */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-professional-gray">
                                                Your Answer:
                                            </label>
                                            <textarea
                                                rows="6"
                                                placeholder="Enter your answer here..."
                                                value={answers[question.id] || ''}
                                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                            />

                                            {/* Character count */}
                                            <div className="text-xs text-professional-gray text-right">
                                                {(answers[question.id] || '').length} characters
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Assessment Instructions:</p>
                                <ul className="list-disc list-inside space-y-1 text-blue-700">
                                    <li>Answer all questions to the best of your ability</li>
                                    <li>Provide detailed and clear responses</li>
                                    {timeRemaining && <li>Complete the assessment before time runs out</li>}
                                    <li>Review your answers before submitting</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-background border-t border-border p-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-professional-gray">
                            <span className="font-medium">{answeredCount}</span> of {questions.length} questions answered
                            {timeRemaining && (
                                <span className="ml-4">
                                    Time remaining: <span className="font-medium">{formatTime(timeRemaining)}</span>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                onClick={onCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="default"
                                onClick={handleSubmitAssessment}
                                loading={isSubmitting}
                                iconName="Send"
                                iconPosition="left"
                                className="bg-success hover:bg-success/90"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentForm;
