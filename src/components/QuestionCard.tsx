
import React from 'react';

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedValue?: number;
  onSelect: (value: number) => void;
  questionNumber: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  options, 
  selectedValue, 
  onSelect, 
  questionNumber 
}) => {
  return (
    <div className="question-card animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {questionNumber}. {question}
      </h3>
      
      <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${questionNumber}`}>
        {options.map((option, index) => {
          const value = index + 1;
          const isSelected = selectedValue === value;
          
          return (
            <label 
              key={value}
              className={`radio-option ${isSelected ? 'radio-option-selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${questionNumber}`}
                value={value}
                checked={isSelected}
                onChange={() => onSelect(value)}
                className="sr-only"
              />
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <span className="text-gray-700 leading-relaxed">{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
