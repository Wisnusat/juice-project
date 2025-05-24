interface CheckoutProgressProps {
    currentStep: number
  }
  
  export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
    const steps = [
      { number: 1, label: "Order" },
      { number: 2, label: "Details" },
      { number: 3, label: "Payment" },
    ]
  
    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center gap-x-2">
            <div className="flex flex-col items-center gap-y-1">
                <span className={`${step.number <= currentStep ? "text-purple-700" : "text-gray-400"}`}>
                  {step.label}
                </span>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    step.number <= currentStep ? "bg-purple-700" : "bg-gray-300"
                  }`}
                >
                  {step.number}
                </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${step.number < currentStep ? "bg-purple-700" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>
    )
  }
  