const BookingHeader = ({ currentStep, serviceSubtitle, selectedTrainer, selectedTimes }) => {
  const steps = [
    { 
      title: 'DỊCH VỤ', 
      isActive: currentStep === 0,
      isCompleted: currentStep > 0,
      subtitle: serviceSubtitle || ''
    },
    { 
      title: 'HUẤN LUYỆN VIÊN', 
      isActive: currentStep === 1,
      isCompleted: currentStep > 1,
      subtitle: selectedTrainer || '' // Hiển thị tên huấn luyện viên đã chọn
    },
    { 
      title: 'THỜI GIAN', 
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
      subtitle: selectedTimes || '' // Will display selected times here
    },
    { 
      title: 'THANH TOÁN', 
      isActive: currentStep === 3,
      isCompleted: currentStep > 3,
      subtitle: ''
    }
  ];

  return (
    <nav className="w-full border-b border-gray-200 shadow-lg"> {/* Thêm shadow ở đây */}
      <div className="container mx-auto">
        <div className="relative">
          <ul className="flex items-center">
            {steps.map((step, index) => (
              <li 
                key={step.title}
                className={`relative flex-1 text-center ${index < steps.length - 1 ? 'border-r border-gray-200' : ''}`}
              >
                <a 
                  className={`relative block py-4 px-4 ${step.isActive ? 'bg-white' : 'hover:bg-gray-50'}`}
                >
                  <div className="relative">
                    <div className={`text-sm ${step.isActive || step.isCompleted ? 'text-blue-600' : 'text-gray-600'}`}>
                      {step.title}
                      {step.isCompleted && (
                        <span className="ml-2 text-green-500">✓</span>
                      )}
                    </div>
                    {step.subtitle && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.subtitle}
                      </div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default BookingHeader;
